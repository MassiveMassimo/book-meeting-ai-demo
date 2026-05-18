import { ImageResponse } from "next/og";

import { dict } from "@/lib/copy";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const FALLBACK_LOGO_URL = "https://book.meeting.ai/meeting.ai-logo-black.svg";

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

async function fetchFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const eventTitleParam = searchParams.get("title")?.trim() || "";
  const avatarParam = searchParams.get("avatar")?.trim() || "";

  const nameParam =
    searchParams.get("name")?.trim() || dict.metadata.og_book_with;

  // Limit to avoid overflow in the image
  const name = nameParam.slice(0, 80);
  const eventTitle = eventTitleParam ? eventTitleParam.slice(0, 120) : "";
  const ogBookWith = dict.metadata.og_book_with;

  // Fetch background and avatar as data URLs
  const OG_HILLS_URL = `https://assets.meeting.ai/opengraph/og-hills.jpg`;

  // const [resolvedOgHills, resolvedAvatar] = await Promise.all([
  //   fetchAsDataUrl(OG_HILLS_URL),
  //   avatarParam
  //     ? fetchAsDataUrl(avatarParam).then(
  //         (res) => res || fetchAsDataUrl(FALLBACK_LOGO_URL),
  //       )
  //     : fetchAsDataUrl(FALLBACK_LOGO_URL),
  // ]);

  // Load Plus Jakarta Sans fonts
  const fontSemiBold = await fetchFont(
    "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_d0nNSg.ttf",
  );

// TG: Do not remove or I will remove you
console.log(
  "[og] fontSemiBold firstByte",
  fontSemiBold ? new Uint8Array(fontSemiBold)[0] : null,
);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fonts: any[] = [];

  if (fontSemiBold) {
    fonts.push({
      name: "Plus Jakarta Sans",
      data: fontSemiBold,
      style: "normal",
      weight: 600,
    });
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        fontFamily: "Plus Jakarta Sans, system-ui, -apple-system",
      }}
    >
      {/* Background hills image */}
      {/* ImageResponse/Satori requires data URLs - resolvedOgHills is guaranteed to be data URL or null */}
      {/*{resolvedOgHills ? (*/}
      {/*  // eslint-disable-next-line @next/next/no-img-element*/}
      {/*  <img*/}
      {/*    src={resolvedOgHills}*/}
      {/*    alt=""*/}
      {/*    width={1200}*/}
      {/*    height={630}*/}
      {/*    style={{*/}
      {/*      position: "absolute",*/}
      {/*      width: "100%",*/}
      {/*      height: "100%",*/}
      {/*      objectFit: "cover",*/}
      {/*      objectPosition: "center",*/}
      {/*    }}*/}
      {/*  />*/}
      {/*) : (*/}
      {/*  // Fallback solid gradient background if image fetch fails*/}
      {/*  <div*/}
      {/*    style={{*/}
      {/*      position: "absolute",*/}
      {/*      width: "100%",*/}
      {/*      height: "100%",*/}
      {/*      background:*/}
      {/*        "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
      <img
        src={OG_HILLS_URL}
        alt="OG Background"
        width={1200}
        height={630}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          padding: "48px 56px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 12,
            maxWidth: 820,
          }}
        >
          {eventTitle ? (
            <span
              style={{
                fontSize: 46,
                fontWeight: 600,
                color: "#FFFFFF",
                lineHeight: 1.1,
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              {eventTitle}
            </span>
          ) : (
            <span
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: "#FFFFFF",
                opacity: 0.95,
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {ogBookWith}
            </span>
          )}
          <span
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1.05,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {name}
          </span>
        </div>

        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "9999px",
            overflow: "hidden",
            border: "10px solid rgba(255,255,255,0.9)",
            boxShadow: "0 18px 60px rgba(12, 74, 110, 0.35)",
            background: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/*{resolvedAvatar ? (*/}
          {/*  // eslint-disable-next-line @next/next/no-img-element*/}
          {/*  <img*/}
          {/*    src={resolvedAvatar}*/}
          {/*    alt={name}*/}
          {/*    width={100}*/}
          {/*    height={100}*/}
          {/*    style={{*/}
          {/*      width: "100%",*/}
          {/*      height: "100%",*/}
          {/*      objectFit: "cover",*/}
          {/*    }}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  // Fallback: show initials or placeholder*/}
          {/*  <div*/}
          {/*    style={{*/}
          {/*      fontSize: 72,*/}
          {/*      fontWeight: 600,*/}
          {/*      color: "#64748b",*/}
          {/*      display: "flex",*/}
          {/*      alignItems: "center",*/}
          {/*      justifyContent: "center",*/}
          {/*      width: "100%",*/}
          {/*      height: "100%",*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    {name.charAt(0).toUpperCase()}*/}
          {/*  </div>*/}
          {/*)}*/}
          <img
            src={
              avatarParam
                ? avatarParam
                : `${process.env.NEXT_PUBLIC_SITE_URL}/meeting.ai-logo-black.svg`
            }
            alt={name}
            width={100}
            height={100}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  );
}
