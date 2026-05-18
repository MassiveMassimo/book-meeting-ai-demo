import type { NextRequest } from "next/server";

import Negotiator from "negotiator";
import { NextResponse } from "next/server";

import { match } from "@formatjs/intl-localematcher";

export const runtime = "experimental-edge";

const locales = ["en", "id", "ms", "de", "es", "fr", "pt", "ko", "ja"];
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  // 1. Check for locale cookie first (user manual choice)
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Fall back to Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  try {
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // Keep the original query params
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    "/((?!_next|api|favicon.svg|file.svg|icon.svg|meeting.ai-logo-black.svg|meeting.ai-logo-white.svg|vercel.svg|window.svg|bg|public).*)",
  ],
};
