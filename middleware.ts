import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = token.role as string
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (path.startsWith('/teacher') && role !== 'teacher') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (path.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/teacher/:path*', '/student/:path*'],
}

