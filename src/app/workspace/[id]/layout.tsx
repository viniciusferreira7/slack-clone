import type { ReactNode } from 'react'

import { Toolbar } from './components/toolbar'

interface WorkspaceIdLayoutProps {
  children: ReactNode
}

export default function WorkspaceIdLayout({
  children,
}: WorkspaceIdLayoutProps) {
  return (
    <div className="min-h-screen">
      <Toolbar />
      {children}
    </div>
  )
}
