"use client";

import * as React from "react";

import { Check } from "lucide-react";
import { Img } from "@/components/ui/img";

import {
  BACKGROUND_IMAGES,
  BackgroundImageId,
  TAILWIND_COLORS_500,
  TAILWIND_COLORS_900,
  TailwindColorName,
  useThemeCustomizer,
} from "@/contexts/ThemeCustomizerContext";
import { cn } from "@/lib/utils";

const colorNames = Object.keys(TAILWIND_COLORS_500) as TailwindColorName[];
const backgroundImageIds = Object.keys(
  BACKGROUND_IMAGES,
) as BackgroundImageId[];

interface ColorSwatchProps {
  color: TailwindColorName;
  isSelected: boolean;
  onClick: () => void;
  shade: "500" | "900";
}

function ColorSwatch({ color, isSelected, onClick, shade }: ColorSwatchProps) {
  const colorHex =
    shade === "500" ? TAILWIND_COLORS_500[color] : TAILWIND_COLORS_900[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative size-8 rounded-md border-2 transition hover:scale-110",
        isSelected ? "border-foreground" : "border-transparent",
      )}
      style={{ backgroundColor: colorHex }}
      title={color}
    >
      {isSelected && (
        <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow-md" />
      )}
    </button>
  );
}

interface BackgroundImageSwatchProps {
  imageId: BackgroundImageId;
  isSelected: boolean;
  onClick: () => void;
}

function BackgroundImageSwatch({
  imageId,
  isSelected,
  onClick,
}: BackgroundImageSwatchProps) {
  const image = BACKGROUND_IMAGES[imageId];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-lg transition",
        isSelected
          ? "ring-brand ring-2 ring-offset-2"
          : "ring-muted hover:ring-muted-foreground ring-1 hover:ring-2",
      )}
      title={image.name}
    >
      {imageId === "hills" ? (
        <Img
          src={image.thumbnail}
          alt={image.name}
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
      ) : (
        <div
          className="bg-muted absolute inset-0"
          style={{
            backgroundImage: `url(${image.thumbnail})`,
            backgroundRepeat: "repeat",
            backgroundSize: "100px",
          }}
        />
      )}
      {isSelected && (
        <div className="bg-brand absolute right-1 bottom-1 rounded-full p-0.5">
          <Check className="size-3 text-white" />
        </div>
      )}
    </button>
  );
}

export function GradientColorPicker() {
  const {
    lightGradientColor,
    darkGradientColor,
    setLightGradientColor,
    setDarkGradientColor,
    backgroundImage,
    setBackgroundImage,
  } = useThemeCustomizer();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="mb-2 text-sm font-medium">Light Mode Gradient (500)</h4>
        <div className="grid grid-cols-7 gap-1.5">
          {colorNames.map((color) => (
            <ColorSwatch
              key={`light-${color}`}
              color={color}
              isSelected={lightGradientColor === color}
              onClick={() => setLightGradientColor(color)}
              shade="500"
            />
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Dark Mode Gradient (900)</h4>
        <div className="grid grid-cols-7 gap-1.5">
          {colorNames.map((color) => (
            <ColorSwatch
              key={`dark-${color}`}
              color={color}
              isSelected={darkGradientColor === color}
              onClick={() => setDarkGradientColor(color)}
              shade="900"
            />
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Background Image</h4>
        <div className="grid grid-cols-2 gap-2">
          {backgroundImageIds.map((imageId) => (
            <BackgroundImageSwatch
              key={imageId}
              imageId={imageId}
              isSelected={backgroundImage === imageId}
              onClick={() => setBackgroundImage(imageId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
