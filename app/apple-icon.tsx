import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #0071e3 0%, #34aadc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Calendar card */}
        <div
          style={{
            width: '114px',
            height: '108px',
            background: 'white',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}
        >
          {/* Calendar top bar */}
          <div
            style={{
              background: '#0071e3',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '14px',
              paddingRight: '14px',
            }}
          >
            {/* Binding rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '14px',
                  background: 'white',
                  borderRadius: '4px',
                  opacity: 0.9,
                }}
              />
            ))}
          </div>

          {/* Calendar body with heart */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Heart shape using two overlapping elements */}
            <div style={{ position: 'relative', width: '52px', height: '46px', display: 'flex' }}>
              {/* Left circle of heart */}
              <div
                style={{
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: '26px',
                  height: '26px',
                  background: '#ff375f',
                  borderRadius: '50%',
                }}
              />
              {/* Right circle of heart */}
              <div
                style={{
                  position: 'absolute',
                  top: '0px',
                  left: '26px',
                  width: '26px',
                  height: '26px',
                  background: '#ff375f',
                  borderRadius: '50%',
                }}
              />
              {/* Bottom triangle of heart */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '0px',
                  width: '52px',
                  height: '32px',
                  background: '#ff375f',
                  borderRadius: '2px 2px 24px 24px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
