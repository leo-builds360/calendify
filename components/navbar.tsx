'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarDays, LogOut } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'
import { getInitials, getAvatarColor } from '@/lib/utils'
import type { Profile } from '@/lib/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AppNavbarProps {
  user: SupabaseUser
  profile: Profile | null
}

export default function AppNavbar({ user, profile }: AppNavbarProps) {
  const initials = getInitials(profile?.full_name ?? null, user.email ?? '')
  const avatarColor = getAvatarColor(user.id)

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0071e3] rounded-lg flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">
            Calendify
          </span>
        </Link>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 ${avatarColor} rounded-full flex items-center justify-center text-white text-[11px] font-semibold`}
            >
              {initials}
            </div>
            <span className="hidden sm:block text-[13px] text-[#6e6e73] max-w-[140px] truncate">
              {profile?.full_name ?? user.email}
            </span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
