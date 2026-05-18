import { Suspense } from "react";

import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { SuccessContent } from "./SuccessContent";

export default async function SuccessPage({
  params,
}: PageProps<"/[lang]/success">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground flex grow items-center justify-center p-8 text-sm">
          {dict.common.loading}
        </div>
      }
    >
      <SuccessContent dict={dict} lang={lang} />
    </Suspense>
  );
}
