import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Calendify – Le calendrier de toute la famille',
    template: '%s | Calendify',
  },
  description: 'Organisez-vous en famille ou entre proches avec un calendrier partagé simple et gratuit.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Calendify',
    startupImage: '/apple-icon',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${nunito.variable} font-sans min-h-screen bg-[#f5f5f7] antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
