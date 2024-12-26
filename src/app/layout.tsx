import './globals.css'

import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Geist, Geist_Mono } from 'next/font/google'

const ConvexClientProvider = dynamic(
  () => import('./contexts/convex-client-provider'),
)

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Slack clone',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
