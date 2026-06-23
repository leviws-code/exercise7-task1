import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // First update the session (refresh tokens)
  const sessionResponse = await updateSession(request)

  // Protect /admin/* routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Use anon client to get the authenticated user
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Use service role to bypass RLS for profile check
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    if (!profile || profile.status !== 'approved') {
      return NextResponse.redirect(new URL('/pending', request.url))
    }

    if (!['admin', 'manager'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // /admin/orders and /admin/users — admin only
    const adminOnlyPaths = ['/admin/orders', '/admin/users']
    if (adminOnlyPaths.some(p => pathname.startsWith(p)) && profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/products', request.url))
    }
  }

  return sessionResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
