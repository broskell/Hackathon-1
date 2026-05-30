import { type NextRequest, NextResponse } from 'next/server'

/** Demo mode: no auth — portals are open after role selection on /login */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
