import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
        {/* Calendar card */}
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
          {/* Blue top bar */}
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

          {/* Body — red rounded square as heart symbol */}
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
    { ...size }
  )
}
