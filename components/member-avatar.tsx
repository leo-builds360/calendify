import { getInitials, getAvatarColor } from '@/lib/utils'

interface MemberAvatarProps {
  profile: { id: string; email: string; full_name: string | null } | null
  size?: 'sm' | 'md'
}

export default function MemberAvatar({ profile, size = 'sm' }: MemberAvatarProps) {
  if (!profile) return null

  const initials = getInitials(profile.full_name, profile.email)
  const color = getAvatarColor(profile.id)
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[11px]' : 'w-9 h-9 text-[13px]'

  return (
    <div
      title={profile.full_name ?? profile.email}
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-semibold border-2 border-white shrink-0`}
    >
      {initials}
    </div>
  )
}
