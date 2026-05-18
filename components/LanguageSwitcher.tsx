"use client";

import * as React from "react";

import { Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
];

function setLocaleCookie(locale: string) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax${secure}`;
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLocale = pathname.split("/")[1];

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const query = searchParams.toString();
    const newPathname = segments.join("/") + (query ? `?${query}` : "");

    // Persist the manual choice for future requests (read in middleware.ts)
    setLocaleCookie(newLocale);

    router.push(newPathname);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            className="border-white/20 bg-white/10 text-slate-900 backdrop-blur-md hover:bg-white/20 xl:text-white"
          >
            <Languages className="size-5" />
            <span className="sr-only">Switch language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={currentLocale === lang.code ? "bg-accent" : ""}
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
