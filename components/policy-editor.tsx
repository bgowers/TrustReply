"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Policy {
  id: number;
  title: string;
  category: string;
  body: string;
  updated_at: string;
}

const DEFAULT_CATEGORIES = [
  "Encryption",
  "Access Control",
  "BCDR",
  "Vendor Management",
  "Data Handling",
  "Incident Response",
  "Privacy",
  "Network",
];

export function PolicyEditor({ initial }: { initial: Policy[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Policy[]>(initial);
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState({ title: "", category: DEFAULT_CATEGORIES[0], body: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; category: string; body: string }>({
    title: "",
    category: "",
    body: "",
  });

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title || !draft.body) return;
    const res = await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      const created = (await res.json()) as Policy;
      setItems((prev) => [created, ...prev]);
      setDraft({ title: "", category: DEFAULT_CATEGORIES[0], body: "" });
      refresh();
    }
  }

  async function save(id: number) {
    const res = await fetch(`/api/policies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = (await res.json()) as Policy;
      setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
      refresh();
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this policy?")) return;
    const res = await fetch(`/api/policies/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      refresh();
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border bg-[color:var(--color-card)] p-4">
        <h2 className="text-sm font-semibold">Add a policy</h2>
        <form onSubmit={create} className="mt-3 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              required
              placeholder="Title (e.g. Data encryption at rest)"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
            <select
              className="rounded-md border bg-white px-3 py-2 text-sm shadow-sm"
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <Textarea
            required
            rows={4}
            placeholder="Policy body. 1–2 paragraphs of plain prose."
            value={draft.body}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              Add policy
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">
          {items.length} {items.length === 1 ? "policy" : "policies"}
        </h2>
        <ul className="space-y-3">
          {items.map((p) =>
            editingId === p.id ? (
              <li key={p.id} className="rounded-lg border bg-white p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  />
                  <select
                    className="rounded-md border bg-white px-3 py-2 text-sm"
                    value={editForm.category}
                    onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {[...new Set([...DEFAULT_CATEGORIES, editForm.category])].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Textarea
                  rows={4}
                  className="mt-3"
                  value={editForm.body}
                  onChange={(e) => setEditForm((f) => ({ ...f, body: e.target.value }))}
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => save(p.id)}>Save</Button>
                </div>
              </li>
            ) : (
              <li key={p.id} className="rounded-lg border bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[color:var(--color-card)] px-2 py-0.5 text-xs font-medium text-[color:var(--color-muted)]">
                        {p.category}
                      </span>
                      <h3 className="text-sm font-semibold">{p.title}</h3>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-[color:var(--color-muted)]">
                      {p.body}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingId(p.id);
                        setEditForm({ title: p.title, category: p.category, body: p.body });
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => remove(p.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
      </section>
    </div>
  );
}
