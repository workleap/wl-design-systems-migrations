import type { ComponentMapping } from "../../../utils/types.ts";

export const imageMapping = {
  Image: "Image",
  ImageProps: "ImageProps",

  SvgImage: "SvgImage",
  SvgImageProps: "SvgImageProps"
} satisfies Record<string, ComponentMapping>;
