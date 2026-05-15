import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTimeLocal(isoString: string): string {
  const date = parseISO(isoString)
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

export function formatDateLocal(isoString: string): string {
  const date = parseISO(isoString)
  return format(date, 'yyyy-MM-dd')
}

export function toISOString(dateTimeLocal: string): string {
  return new Date(dateTimeLocal).toISOString()
}

export function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export function getAvatarColor(id: string): string {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-red-500',
    'bg-indigo-500',
  ]
  const index = id.charCodeAt(0) % colors.length
  return colors[index]
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}…`
}
