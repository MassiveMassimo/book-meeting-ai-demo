import { Suspense } from "react";

import { dict } from "@/lib/copy";
import { SuccessContent } from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground flex grow items-center justify-center p-8 text-sm">
          {dict.common.loading}
        </div>
      }
    >
      <SuccessContent dict={dict} />
    </Suspense>
  );
}
