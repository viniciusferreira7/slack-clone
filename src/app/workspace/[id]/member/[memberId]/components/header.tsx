'use client'

import { ChevronDown } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  memberName?: string
  memberImage?: string
  onClick?: () => void
}

export function Header({ memberName, memberImage, onClick }: HeaderProps) {
  const avatarFallback = memberName?.charAt(0).toUpperCase()

  return (
    <header className="bg-whit flex min-h-[49px] w-full items-center overflow-hidden border-b bg-white px-4">
      <Button
        variant="ghost"
        className="w-auto overflow-hidden px-2 text-lg font-semibold"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="mr-2 size-6">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <ChevronDown className="ml-2 size-2.5 shrink-0" />
      </Button>
    </header>
  )
}
