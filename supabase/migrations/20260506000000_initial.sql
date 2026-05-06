-- TrustReply schema. Apply via Supabase SQL editor or `supabase db push`.

-- Enums
do $$ begin
  create type plan_t as enum ('free', 'solo', 'team');
exception when duplicate_object then null; end $$;

do $$ begin
  create type questionnaire_status_t as enum ('pending', 'drafting', 'complete');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_status_t as enum ('pending', 'drafted', 'approved');
exception when duplicate_object then null; end $$;

do $$ begin
  create type confidence_t as enum ('high', 'medium', 'low');
exception when duplicate_object then null; end $$;

-- profiles: 1:1 with auth.users, billing state
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan plan_t not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  company_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile + seed policies when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  insert into public.policies (user_id, title, category, body) values
    (new.id, 'Replace me — example', 'Encryption', 'Data is encrypted at rest using AES-256 and in transit via TLS 1.2+.'),
    (new.id, 'Replace me — example', 'Access Control', 'Production access requires SSO + hardware MFA. Least-privilege RBAC reviewed quarterly.'),
    (new.id, 'Replace me — example', 'BCDR', 'Daily encrypted backups; RPO 24h, RTO 4h. Tested annually.'),
    (new.id, 'Replace me — example', 'Vendor Management', 'All sub-processors reviewed against SOC 2 / ISO 27001 evidence before onboarding.'),
    (new.id, 'Replace me — example', 'Data Handling', 'Customer data segregated logically per tenant; no commingled storage.'),
    (new.id, 'Replace me — example', 'Incident Response', '24/7 on-call. Customer notification within 72h of confirmed material incidents.'),
    (new.id, 'Replace me — example', 'Privacy', 'Compliant with GDPR and CCPA. DPA available on request.'),
    (new.id, 'Replace me — example', 'Network', 'VPC isolation, private subnets for data plane, WAF + DDoS protection at edge.');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- policies
create table if not exists public.policies (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  body text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists policies_user_idx on public.policies(user_id);
alter table public.policies enable row level security;

drop policy if exists "policies_owner_all" on public.policies;
create policy "policies_owner_all" on public.policies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- questionnaires
create table if not exists public.questionnaires (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  source_filename text not null,
  source_format text not null check (source_format in ('csv','xlsx')),
  question_column text not null,
  total_rows int not null default 0,
  status questionnaire_status_t not null default 'pending',
  layout jsonb,
  created_at timestamptz not null default now()
);
create index if not exists questionnaires_user_idx on public.questionnaires(user_id);
alter table public.questionnaires enable row level security;

drop policy if exists "questionnaires_owner_all" on public.questionnaires;
create policy "questionnaires_owner_all" on public.questionnaires
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- questions
create table if not exists public.questions (
  id bigserial primary key,
  questionnaire_id bigint not null references public.questionnaires(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  row_index int not null,
  question_text text not null,
  draft_answer text,
  final_answer text,
  citations jsonb,
  confidence confidence_t,
  needs_review_reason text,
  status question_status_t not null default 'pending',
  updated_at timestamptz not null default now()
);
create index if not exists questions_q_idx on public.questions(questionnaire_id, row_index);
alter table public.questions enable row level security;

drop policy if exists "questions_owner_all" on public.questions;
create policy "questions_owner_all" on public.questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
