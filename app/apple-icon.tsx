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
            height: '112px',
            background: 'white',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top blue bar */}
          <div
            style={{
              background: '#0071e3',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '4px' }} />
            <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '4px' }} />
            <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '4px' }} />
          </div>
          {/* Body with heart emoji */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '46px',
            }}
          >
            ❤️
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
