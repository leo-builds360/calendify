import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Calendify – Calendriers partagés',
    template: '%s | Calendify',
  },
  description: 'Une belle application de calendrier partagé pour équipes et familles.',
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
