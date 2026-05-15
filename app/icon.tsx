import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(145deg, #0071e3, #34aadc)',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '14px',
            background: 'white',
            borderRadius: '50% 50% 46% 46%',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
