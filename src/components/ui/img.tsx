/** Thin `<img>` wrapper that sets `loading="lazy"` and `decoding="async"`
 *  by default. Pass `priority` for above-the-fold images that should load
 *  immediately and get a `<link rel=preload>`-equivalent fetch hint.
 *
 *  Why a wrapper exists: native lazy-loading and async decoding are a
 *  free LCP / main-thread win, but plain `<img>` defaults to eager + sync.
 *  Centralising the policy here makes the right thing the default for new
 *  code and keeps the policy from decaying over time. */
type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean };

export function Img({ priority, loading, decoding, ...rest }: ImgProps) {
  return (
    <img
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={priority ? "high" : undefined}
      {...rest}
    />
  );
}
