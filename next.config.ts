import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@fullcalendar/core',
    '@fullcalendar/daygrid',
    '@fullcalendar/timegrid',
    '@fullcalendar/interaction',
    '@fullcalendar/react',
  ],
}

export default nextConfig
