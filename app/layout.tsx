import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustReply — AI security questionnaire auto-responder",
  description:
    "Upload a SIG, CAIQ, or custom Excel security questionnaire. Get cited draft answers from your policy library in minutes, not days.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
