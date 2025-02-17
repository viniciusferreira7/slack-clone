'use client'

import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs'
import { env } from '@env'
import { ConvexReactClient } from 'convex/react'
import { Provider as JotaiProvider } from 'jotai'
import type { ReactNode } from 'react'

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL)

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <JotaiProvider>{children}</JotaiProvider>
    </ConvexAuthNextjsProvider>
  )
}
