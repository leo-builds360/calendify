import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-[#0071e3] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <span className="text-[18px] font-semibold text-[#1d1d1f] tracking-tight">
          Calendify
        </span>
      </Link>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {children}
      </div>
    </div>
  )
}
