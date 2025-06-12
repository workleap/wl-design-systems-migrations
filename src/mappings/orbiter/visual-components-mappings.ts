import type { ComponentMapMetaData } from "../../utils/types.ts";
import { avatarMapping } from "./components/avatar.ts";
import { avatarTextMapping } from "./components/avatarText.ts";
import { illustrationMapping } from "./components/illustration.ts";
import { imageMapping } from "./components/image.ts";
import { spinnerMapping } from "./components/spinner.ts";

export const visualComponentsMappings: Record<string, ComponentMapMetaData> = {
  ...avatarMapping,
  AvatarGroup: "AvatarGroup",
  AvatarGroupProps: "AvatarGroupProps",

  Badge: "Badge",
  BadgeProps: "BadgeProps",
  Dot: {
    todoComments: "`Dot` is not supported anymore. Find an alternative. One possible option: <Badge isIndeterminate />"
  },
  DotProps: "DotProps",

  ...spinnerMapping,
  ...avatarTextMapping,
  ...imageMapping,
  ...illustrationMapping


  // // Lozenge: "Badge", //usage: 90
  // // LozengeProps: "BadgeProps",


  // IconList: "IconList", //usage: 0
  // IconListProps: "IconListProps"
  // //TODO: Not direct map. Find appropriate component/type
  // // AsyncImage: "Image",
  // // AsyncImageProps: "ImageProps",

};
