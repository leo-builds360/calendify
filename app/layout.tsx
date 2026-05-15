import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Calendify – Shared Calendars',
    template: '%s | Calendify',
  },
  description: 'A beautiful shared calendar app for teams and families.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f5f5f7] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
