'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { Loader, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteCookie } from '@/utils/cookies/delete-cookie'

import { useCurrentUser } from '../api/use-current-user'

export function UserButton() {
  const { signOut } = useAuthActions()
  const { data, isLoading } = useCurrentUser()

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />
  }

  if (!data) {
    return null
  }

  const { name, image } = data

  const avatarFallback = name!.charAt(0).toUpperCase()

  async function handleSignOut() {
    await deleteCookie('workspace-id')
    signOut()
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 rounded-md transition hover:opacity-75">
          <AvatarImage alt={name} src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            <span className="text-xs">{avatarFallback}</span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
