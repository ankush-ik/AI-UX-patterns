import './globals.css'
import type { Metadata } from 'next'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AI UX Patterns',
    template: '%s | AI UX Patterns',
  },
  description:
    'A curated collection of AI UX design patterns — proven solutions for building intuitive AI-powered experiences.',
  openGraph: {
    type: 'website',
    siteName: 'AI UX Patterns',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const skapaMcpBaseUrl = process.env.NEXT_PUBLIC_SKAPA_MCP_BASE_URL;
  const skapaFontStylesheet =
    process.env.NEXT_PUBLIC_SKAPA_FONT_STYLESHEET ??
    (skapaMcpBaseUrl ? `${skapaMcpBaseUrl.replace(/\/$/, '')}/fonts/noto-ikea-latin.css` : undefined);

  return (
    <html lang="en">
      <head>
        {skapaFontStylesheet ? (
          <link rel="stylesheet" href={skapaFontStylesheet} />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
