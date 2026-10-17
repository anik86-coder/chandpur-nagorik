
import { NextRequest, NextResponse } from "next/server";

const disabledRoutes = [
  "/sheba/health",
  "/sheba/zilla-info",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isDisabled = disabledRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isDisabled) {
    return new NextResponse(
      "এই সেবাটি আপাতত বন্ধ আছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
      {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "Retry-After": "3600",
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sheba/health/:path*",
    "/sheba/zilla-info/:path*",
  ],
};
