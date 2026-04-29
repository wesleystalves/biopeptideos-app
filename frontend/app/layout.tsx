import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import Script from "next/script";

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
      <body>
        {/* ── Google Analytics ── */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BNBP69F73Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BNBP69F73Q');
          `}
        </Script>

        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
