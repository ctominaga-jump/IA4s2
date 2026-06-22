import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IA para Vida Real",
  description:
    "Aprenda fazendo: defina um objetivo real, conclua missões práticas, receba feedback e evolua com apoio de IA.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/*
         * Fallback sem JS: framer-motion renderiza o estado inicial (opacity:0)
         * inline no SSR. Se o JS nao hidratar, este estilo (so aplicado quando
         * scripting esta desabilitado) força os wrappers de motion a ficarem
         * visiveis, evitando conteúdo preso invisível na landing publica.
         */}
        <noscript>
          <style>{`.m-reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
