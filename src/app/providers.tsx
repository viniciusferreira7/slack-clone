'use client'

import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs'
import { env } from '@env'
import { ConvexReactClient } from 'convex/react'
import { Provider as JotaiProvider } from 'jotai'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL)

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <JotaiProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </JotaiProvider>
    </ConvexAuthNextjsProvider>
  )
}
