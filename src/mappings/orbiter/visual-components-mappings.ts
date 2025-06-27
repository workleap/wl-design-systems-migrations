/* eslint-disable max-len */
import type { ComponentMapping } from "../../utils/types.ts";
import { avatarMapping } from "./components/avatar.ts";
import { avatarTextMapping } from "./components/avatarText.ts";
import { illustrationMapping } from "./components/illustration.ts";
import { imageMapping } from "./components/image.ts";
import { spinnerMapping } from "./components/spinner.ts";
import { getMigrationNote, getTodoComment } from "./message-utils.ts";

export const visualComponentsMappings: Record<string, ComponentMapping> = {
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
    todoComments: getTodoComment("dot_not_supported"),
    migrationNotes: getMigrationNote("dot_not_supported")
  },
  DotProps: "DotProps",

  Counter: {
    skipImport: true,
    todoComments: getTodoComment("counter_not_supported"),
    migrationNotes: getMigrationNote("counter_not_supported")
  },

  VisuallyHidden: "VisuallyHidden", 
  VisuallyHiddenProps: "VisuallyHiddenProps",

  Transition: {
    skipImport: true,
    todoComments: getTodoComment("transition_not_supported"),
    migrationNotes: getMigrationNote("transition_not_supported")
  },

  ...spinnerMapping,
  ...avatarTextMapping,
  ...imageMapping,
  ...illustrationMapping
};
