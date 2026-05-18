import type { Metadata } from "next";

import { Plus_Jakarta_Sans } from "next/font/google";

import "../globals.css";

import { Suspense } from "react";

import Image from "next/image";

import { GradientBackground } from "@/components/GradientBackground";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Toaster } from "@/components/ui/sonner";
import { getDictionary, Locale } from "./dictionaries";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://book-meeting-prototype.netlify.app";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const ogTitle = dict.metadata.default_title;
  const ogDescription = dict.metadata.default_description;

  return {
    metadataBase: new URL(siteUrl),
    title: ogTitle,
    description: ogDescription,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: siteUrl,
      siteName: "Meeting.ai",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${dict.metadata.default_title} - Meeting.ai`,
        },
      ],
      locale: lang === "en" ? "en_US" : lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "id" },
    { lang: "ms" },
    { lang: "de" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "pt" },
    { lang: "ko" },
    { lang: "ja" },
  ];
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} relative flex min-h-screen flex-col antialiased`}
      >
        <GradientBackground />
        <main className="relative z-0 flex min-h-dvh w-full flex-col items-center p-3 xl:justify-center">
          <div className="from-background to-secondary flex min-h-0 w-full max-w-6xl grow flex-col overflow-hidden rounded-3xl bg-linear-to-b inset-shadow-2xs inset-shadow-white/15 xl:h-[600px] xl:flex-none">
            <div className="flex min-h-0 grow flex-col overflow-y-auto xl:overflow-hidden">
              {children}
            </div>
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-1.5 pb-3 md:mt-6 md:gap-2 md:pb-4">
            <span className="text-xs text-white md:text-sm">Powered by</span>
            <Image
              src="/meeting.ai-logo-white.svg"
              alt="meeting.ai"
              width={100}
              height={24}
              className="h-4 w-auto md:h-5"
            />
          </div>
        </main>
        <Toaster />
        <Suspense>
          <LanguageSwitcher />
        </Suspense>
      </body>
    </html>
  );
}
