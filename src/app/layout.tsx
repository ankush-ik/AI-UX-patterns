import './globals.css'

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
