import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calendify',
    short_name: 'Calendify',
    description: 'Le calendrier partagé de toute la famille',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#0071e3',
    icons: [
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  }
}
