import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { UserRole } from '@/types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtected =
    pathname.startsWith('/manager') || pathname.startsWith('/employee')

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    let role: UserRole | undefined

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role) {
      role = profile.role as UserRole
    } else {
      role = (user.user_metadata?.role as UserRole | undefined) ?? 'employee'
    }

    if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
      const url = request.nextUrl.clone()
      url.pathname = `/${role}/dashboard`
      return NextResponse.redirect(url)
    }

    if (role === 'employee' && pathname.startsWith('/manager')) {
      const url = request.nextUrl.clone()
      url.pathname = '/employee/dashboard'
      return NextResponse.redirect(url)
    }

    if (role === 'manager' && pathname.startsWith('/employee')) {
      const url = request.nextUrl.clone()
      url.pathname = '/manager/dashboard'
      return NextResponse.redirect(url)
    }
  } else if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
