import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "BioPeptidios — Performance & Longevity",
  description: "A plataforma global de peptídeos para performance, saúde e longevidade.",
  keywords: ["peptídeos", "performance", "longevidade", "biohacking", "saúde"],
  openGraph: {
    title: "BioPeptidios",
    description: "Peptídeos de Alta Performance",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* ── Google Analytics ── */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BNBP69F73Q" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BNBP69F73Q');
            `,
          }}
        />
      </head>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
