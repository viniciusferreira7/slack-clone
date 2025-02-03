import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'

const isPublicPage = createRouteMatcher(['/auth'])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
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

      request.cookies.set('workspace-id', workspaceId)
    }

    const workspaceIdFromCookies = request.cookies.get('workspace-id')?.value

    if (!workspaceIdFromCookies) {
      return nextjsMiddlewareRedirect(request, `/`)
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
