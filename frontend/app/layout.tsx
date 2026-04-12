import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
