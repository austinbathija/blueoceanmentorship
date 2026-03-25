import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let user = null;
  let supabaseResponse = NextResponse.next({ request });

  try {
    const session = await updateSession(request);
    user = session.user;
    supabaseResponse = session.supabaseResponse;
  } catch (error) {
    console.error("Middleware auth error:", error);
    // If auth fails, allow public routes to proceed; redirect others to login
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next({ request });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If logged in, redirect away from auth pages
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return supabaseResponse;
  }

  // Not logged in → redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For role-based routing, we need to check the user's role from the database.
  // We'll use a lightweight approach: fetch role via an API cookie or header.
  // Since middleware can't use Prisma directly in edge runtime, we'll use
  // a fetch to our own API route for role checking.
  //
  // Alternative: Store role in Supabase user metadata and read it here.
  // For simplicity, let's redirect based on a cookie that gets set on login.

  const role = request.cookies.get("user-role")?.value;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    if (role === "COACH") {
      return NextResponse.redirect(new URL("/coach", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/coach") && role !== "COACH" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Root redirect
  if (pathname === "/") {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "COACH") {
      return NextResponse.redirect(new URL("/coach", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
