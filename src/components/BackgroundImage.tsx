"use client";

import Image from "next/image";

import hillsDarkImage from "@/public/bg/hills-dark.png";
import hillsLightImage from "@/public/bg/hills-light.png";

export function BackgroundImage() {
  return (
    <>
      <Image
        src={hillsLightImage}
        alt=""
        fill
        placeholder="blur"
        className="object-cover object-bottom dark:hidden"
        sizes="100vw"
        priority
      />
      <Image
        src={hillsDarkImage}
        alt=""
        fill
        placeholder="blur"
        className="hidden object-cover object-bottom dark:block"
        sizes="100vw"
        priority
      />
    </>
  );
}
