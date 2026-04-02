import { ImageResponse } from 'next/og';

export const alt = 'Designing AI — Foundational elements and interactions for AI-enabled experiences';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function OgImage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

  const [boldData, regularData] = await Promise.all([
    fetch(`${siteUrl}/fonts/NotoIKEALatinOnlyIJ-Bold.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${siteUrl}/fonts/NotoIKEALatinOnlyIJ-Regular.ttf`).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          fontFamily: 'Noto IKEA Latin',
          padding: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#111111',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            Designing AI
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: '#5f5f5f',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Foundational elements and interactions for AI-enabled experiences
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto IKEA Latin', data: boldData, weight: 700, style: 'normal' },
        { name: 'Noto IKEA Latin', data: regularData, weight: 400, style: 'normal' },
      ],
    }
  );
}
