import './globals.css'

import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Geist, Geist_Mono } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'

const Providers = dynamic(() => import('./providers'))

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Slack clone',
    absolute: 'Slack clone',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        >
          <Providers>
            <Toaster richColors />
            {children}
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
