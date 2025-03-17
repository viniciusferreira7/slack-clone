import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'
import { cookies } from 'next/headers'

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
    const pathname = request.nextUrl.pathname

    if (pathname.startsWith('/workspace')) {
      const [, _workspace, workspaceId] = pathname.split('/')

      cookieStore.set('workspace-id', workspaceId, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // 3 days,
      })
    }

    const workspaceIdFromCookies = request.cookies.get('workspace-id')?.value

    const isHomePage = pathname === '/'
    const isJoinPage = pathname.includes('/join')

    if (!workspaceIdFromCookies && !isHomePage && !isJoinPage) {
      return nextjsMiddlewareRedirect(request, `/`)
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
