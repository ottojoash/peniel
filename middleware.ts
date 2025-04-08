// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req, res })

//   const {
//     data: { session },
//   } = await supabase.auth.getSession()

//   // If the user is not signed in and the current path is not /admin/login,
//   // redirect the user to /admin/login
//   if (!session && req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
//     const redirectUrl = new URL("/admin/login", req.url)
//     return NextResponse.redirect(redirectUrl)
//   }

//   return res
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// }

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // For now, let's disable all authentication checks and redirects
  // This will allow us to access any page without authentication
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

