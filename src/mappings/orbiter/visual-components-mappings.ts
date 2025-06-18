/* eslint-disable max-len */
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

  Badge: "Badge", //usage: 0
  BadgeProps: "BadgeProps",
  IconList: "IconList", //usage: 0
  IconListProps: "IconListProps",
  AsyncImage: "Image", //usage: 0
  AsyncImageProps: "ImageProps",

  Dot: {
    skipImport: true,
    todoComments: "`Dot` is not supported anymore. Find an alternative. One possible option: <Badge isIndeterminate />",
    migrationNotes: "`Dot` is not supported anymore. Find an alternative. One possible option: `<Badge isIndeterminate />`"
  },
  DotProps: "DotProps",

  Counter: {
    skipImport: true,
    todoComments: "`Counter` is not supported anymore. You need to find an alternative. You can see this as an example:https://dev.azure.com/sharegate/ShareGate.Protect.Web/_git/ShareGate.Protect.Web/commit/8c969df4da52b1a0208d54e295762f36aa364ce4?path=/apps/tenant-assessment/src/pages/sharing-links.%5BworkspaceId%5D.tsx&version=GBmain&line=83&lineEnd=89&lineStartColumn=1&lineEndColumn=1&type=2&lineStyle=plain&_a=files",
    migrationNotes: "`Counter` is not supported anymore. You need to find an alternative. You can see this as an example:https://dev.azure.com/sharegate/ShareGate.Protect.Web/_git/ShareGate.Protect.Web/commit/8c969df4da52b1a0208d54e295762f36aa364ce4?path=/apps/tenant-assessment/src/pages/sharing-links.%5BworkspaceId%5D.tsx&version=GBmain&line=83&lineEnd=89&lineStartColumn=1&lineEndColumn=1&type=2&lineStyle=plain&_a=files"
  },

  ...spinnerMapping,
  ...avatarTextMapping,
  ...imageMapping,
  ...illustrationMapping

  // Lozenge: "Badge", //usage: 90
  // LozengeProps: "BadgeProps",

};
