import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const imageMapping = {
  Image: "Image",
  ImageProps: "ImageProps",

  SvgImage: "SvgImage",
  SvgImageProps: "SvgImageProps"
} satisfies Record<string, ComponentMapMetaData>;
