import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Antigravity — AI Accountability Platform',
  description: 'Make bluffing impossible. AI-verified work logs and team accountability.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable} dark h-full`}>
      <body className="min-h-full bg-background font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
