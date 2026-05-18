import { Calendar, Globe, Link2 } from "lucide-react";
import { notFound } from "next/navigation";

import HeroIllustration from "@/components/HeroIllustration";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function IndexPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const registerUrl = `https://app.meeting.ai/${lang}/auth/register`;

  return (
    <div
      className={cn("flex grow flex-col overflow-hidden xl:h-full xl:min-h-0")}
    >
      <div
        className={cn(
          "divide-border/50 grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:h-full xl:min-h-0",
        )}
      >
        {/* Left: copy + CTA */}
        <section
          className={cn(
            "flex flex-col justify-center gap-6 p-6 md:p-10 lg:p-16",
          )}
        >
          <div className={cn("space-y-4")}>
            <h1
              className={cn(
                "text-foreground animate-in fade-in slide-in-from-bottom-6 fill-mode-both text-4xl/[1.2] font-bold tracking-tight text-balance duration-1000 md:text-5xl/[1.2] lg:text-6xl/[1.2]",
              )}
            >
              {dict.landing.title}
            </h1>
            <p
              className={cn(
                "text-muted-foreground animate-in fade-in slide-in-from-bottom-6 fill-mode-both max-w-prose leading-relaxed delay-150 duration-1000 md:text-lg",
              )}
            >
              {dict.landing.subtitle}
            </p>
          </div>

          <div
            className={cn("flex flex-col gap-3 sm:flex-row sm:items-center")}
          >
            <Button
              asChild
              className={cn(
                "bg-brand text-primary-foreground hover:bg-brand/90 animate-in fade-in slide-in-from-bottom-6 fill-mode-both h-12 rounded-xl px-8 text-base font-semibold shadow-sm transition-shadow delay-300 duration-1000 hover:shadow-md",
              )}
            >
              <a href={registerUrl}>{dict.landing.cta}</a>
            </Button>
          </div>
        </section>

        {/* Right: preview + highlights */}
        <section
          className={cn(
            "bg-muted/10 flex flex-col justify-between overflow-hidden xl:h-full xl:min-h-0",
          )}
        >
          <div
            className={cn(
              "flex flex-col justify-end px-6 pt-10 pb-6 md:h-auto md:shrink-0 md:px-10 xl:px-16",
            )}
          >
            <p
              className={cn(
                "text-muted-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-[11px] font-semibold tracking-widest uppercase delay-500 duration-1000",
              )}
            >
              {dict.landing.features.tag}
            </p>
            <h2
              className={cn(
                "text-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-2 text-xl font-bold delay-600 duration-1000 md:text-2xl",
              )}
            >
              {dict.landing.features.title}
            </h2>

            <div className={cn("mt-6 grid gap-4 sm:grid-cols-3")}>
              <div
                className={cn(
                  "bg-background ring-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-xl p-4 shadow-xs ring-1 delay-700 duration-1000",
                )}
              >
                <div className={cn("flex flex-col gap-3")}>
                  <span
                    className={cn(
                      "bg-brand/10 text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                    )}
                  >
                    <Link2 className="size-4" />
                  </span>
                  <div>
                    <p className={cn("text-foreground text-sm font-semibold")}>
                      {dict.landing.features.link.title}
                    </p>
                    <p className={cn("text-muted-foreground mt-0.5 text-xs")}>
                      {dict.landing.features.link.description}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "bg-background ring-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-xl p-4 shadow-xs ring-1 delay-800 duration-1000",
                )}
              >
                <div className={cn("flex flex-col gap-3")}>
                  <span
                    className={cn(
                      "bg-brand/10 text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                    )}
                  >
                    <Globe className="size-4" />
                  </span>
                  <div>
                    <p className={cn("text-foreground text-sm font-semibold")}>
                      {dict.landing.features.global.title}
                    </p>
                    <p className={cn("text-muted-foreground mt-0.5 text-xs")}>
                      {dict.landing.features.global.description}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "bg-background ring-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-xl p-4 shadow-xs ring-1 delay-900 duration-1000",
                )}
              >
                <div className={cn("flex flex-col gap-3")}>
                  <span
                    className={cn(
                      "bg-brand/10 text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                    )}
                  >
                    <Calendar className="size-4" />
                  </span>
                  <div>
                    <p className={cn("text-foreground text-sm font-semibold")}>
                      {dict.landing.features.automated.title}
                    </p>
                    <p className={cn("text-muted-foreground mt-0.5 text-xs")}>
                      {dict.landing.features.automated.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "relative flex grow items-end justify-center md:min-h-0 md:flex-1",
            )}
          >
            <div
              className={cn(
                "animate-in fade-in slide-in-from-bottom-8 fill-mode-both w-full max-w-[600px] translate-x-4 translate-y-4 delay-1100 duration-1000 md:translate-x-6 md:translate-y-8",
              )}
            >
              <HeroIllustration dict={dict} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
