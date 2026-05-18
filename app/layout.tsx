import type { Metadata } from "next";

import { Plus_Jakarta_Sans } from "next/font/google";

import "@/styles.css";

import Image from "next/image";

import { GradientBackground } from "@/components/GradientBackground";
import { Toaster } from "@/components/ui/sonner";
import { dict } from "@/lib/copy";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://book-meeting-prototype.netlify.app";

export async function generateMetadata(): Promise<Metadata> {
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
      locale: "en_US",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
