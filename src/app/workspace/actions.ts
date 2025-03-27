'use server'

import { revalidatePath } from 'next/cache'

export async function refreshData(pathname: string, type?: 'layout' | 'page') {
  revalidatePath(pathname, type)
}
