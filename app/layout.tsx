import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Calendify – Le calendrier de toute la famille',
    template: '%s | Calendify',
  },
  description: 'Organisez-vous en famille ou entre proches avec un calendrier partagé simple et gratuit.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f5f5f7] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
