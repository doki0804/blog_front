// ✅ /middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const PUBLIC_PATHS = ['/login', '/register', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ 로그인/회원가입 페이지는 인증 없이 접근 가능
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  // ✅ 토큰이 없는 경우 로그인으로
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded: { exp: number } = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)

    if (decoded.exp < now) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/tabs/:path*', '/write', '/admin/:path*'], // ✅ 보호할 경로 지정
}
