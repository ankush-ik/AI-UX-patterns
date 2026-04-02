import { ImageResponse } from 'next/og';

export const alt = 'Designing AI — Foundational elements and interactions for AI-enabled experiences';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function OgImage() {
  const [boldData, regularData] = await Promise.all([
    fetch('https://www.ikea.com/global/assets/fonts/woff2/noto-ikea-700.latin.a3f10ed8.woff2').then((r) => r.arrayBuffer()),
    fetch('https://www.ikea.com/global/assets/fonts/woff2/noto-ikea-400.latin.5a052965.woff2').then((r) => r.arrayBuffer()),
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
          fontFamily: 'Noto IKEA',
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
        { name: 'Noto IKEA', data: boldData, weight: 700, style: 'normal' },
        { name: 'Noto IKEA', data: regularData, weight: 400, style: 'normal' },
      ],
    }
  );
}
