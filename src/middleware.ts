import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'
import { fetchQuery } from 'convex/nextjs'

import { api } from '../convex/_generated/api'
import type { Id } from '../convex/_generated/dataModel'

const isPublicPage = createRouteMatcher(['/auth'])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // const cookieStore = await cookies()

  if (!isPublicPage(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, '/auth')
  }
  if (isPublicPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, '/')
  }

  if (!isPublicPage(request) && (await convexAuth.isAuthenticated())) {
    request.cookies.delete('workspace-id')

    const pathname = request.nextUrl.pathname

    if (pathname.startsWith('workspace')) {
      const [, _workspace, workspaceId] = pathname.split('/')

      const workspace = await fetchQuery(api.workspaces.getById, {
        id: workspaceId as Id<'workspaces'>,
      })

      if (workspace?._id) {
        request.cookies.set('workspace-id', workspace?._id)
      }
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
