import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustReply — Answer security questionnaires in minutes",
  description:
    "Upload a SIG, CAIQ, or custom Excel security questionnaire. TrustReply drafts cited answers from your policy library so deals stop stalling at procurement.",
  metadataBase: new URL("https://trustreply.co.uk"),
  openGraph: {
    title: "TrustReply — Answer security questionnaires in minutes",
    description:
      "Cited draft answers from your policy library, in minutes instead of days.",
    siteName: "TrustReply",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
