import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ROOC Builds — Comunidade Ragnarok Origin",
  description: "Descubra, crie e compartilhe builds para Ragnarok Origin.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <SiteHeader />
        <main className="mx-auto min-h-[calc(100vh-64px)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
