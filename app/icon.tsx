import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #0071e3 0%, #34aadc 100%)',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Small heart */}
        <div style={{ position: 'relative', width: '16px', height: '14px', display: 'flex' }}>
          <div style={{ position: 'absolute', top: '0px', left: '0px', width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '0px', left: '8px', width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '4px', left: '0px', width: '16px', height: '10px', background: 'white', borderRadius: '1px 1px 8px 8px' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
