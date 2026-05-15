import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '180px',
          height: '180px',
          background: 'linear-gradient(145deg, #0071e3, #34aadc)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '110px',
            background: 'white',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: '#0071e3',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <div style={{ width: '6px', height: '12px', background: 'rgba(255,255,255,0.8)', borderRadius: '3px' }} />
            <div style={{ width: '6px', height: '12px', background: 'rgba(255,255,255,0.8)', borderRadius: '3px' }} />
            <div style={{ width: '6px', height: '12px', background: 'rgba(255,255,255,0.8)', borderRadius: '3px' }} />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '44px',
                background: '#ff375f',
                borderRadius: '50% 50% 46% 46%',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 180,
      height: 180,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'image/png',
      },
    }
  )
}
