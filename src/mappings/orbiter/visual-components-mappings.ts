import type { ComponentMapMetaData } from "../../utils/types.ts";
import { avatarMapping } from "./components/avatar.ts";
import { spinnerMapping } from "./components/spinner.ts";

export const visualComponentsMappings: Record<string, ComponentMapMetaData> = {
  ...avatarMapping,
  AvatarGroup: "AvatarGroup",
  AvatarGroupProps: "AvatarGroupProps",

  Badge: "Badge", //usage: 0
  BadgeProps: "BadgeProps",

  ...spinnerMapping

  // //TODO: Not direct map. Find appropriate component/type
  // // AvatarText: "AvatarText", //usage: 2

  // // Dot: "Dot", //usage: 1
  // // DotProps: "DotProps",

  // // Lozenge: "Badge", //usage: 90
  // // LozengeProps: "BadgeProps",

  // //media & illustration - total usage: 197
  // Image: "Image", //usage: 15
  // ImageProps: "ImageProps",
  // SvgImage: "SvgImage", //usage: 133
  // SvgImageProps: "SvgImageProps",
  // IllustratedMessage: "IllustratedMessage", //usage: 29
  // IllustratedMessageProps: "IllustratedMessageProps",
  // IconList: "IconList", //usage: 0
  // IconListProps: "IconListProps"
  // //TODO: Not direct map. Find appropriate component/type
  // // AsyncImage: "Image",
  // // AsyncImageProps: "ImageProps",
  // // Illustration: "Illustration", //usage: 49
  // // IllustrationProps: "IllustrationProps",
};
