import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'
import { fetchQuery } from 'convex/nextjs'
import { cookies } from 'next/headers'

import { api } from '../convex/_generated/api'

const isPublicPage = createRouteMatcher(['/auth'])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const cookieStore = await cookies()

  if (!isPublicPage(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, '/auth')
  }
  if (isPublicPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, '/')
  }

  if (!isPublicPage(request) && (await convexAuth.isAuthenticated())) {
    cookieStore.delete('workspace-id')

    const workspace = await fetchQuery(api.workspaces.get)

    const workspaceId = workspace?.[0]?._id

    if (workspaceId) {
      cookieStore.set('workspace-id', workspaceId)
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
