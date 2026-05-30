import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns'

export function formatDate(date: string | null): string {
  if (!date) return '—'
  return format(parseISO(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy h:mm a')
}

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

export function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === 'done') return false
  return isPast(parseISO(dueDate))
}

export function addDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
