'use server'

import { cookies } from 'next/headers'

export async function deleteCookie(key: string) {
  const cookieStore = await cookies()

  cookieStore.delete(key)
}
