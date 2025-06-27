import type { ComponentMapping } from "../../../utils/types.ts";
import { getMigrationNote, getTodoComment } from "../message-utils.ts";

export const tileLinkMapping = {
  TileLink: {
    skipImport: true,
    todoComments: getTodoComment("tilelink_not_supported"),
    migrationNotes: getMigrationNote("tilelink_not_supported")
  },
  TileLinkProps: {
    skipImport: true,
    todoComments: getTodoComment("tilelinkprops_not_supported"),
    migrationNotes: getMigrationNote("tilelinkprops_not_supported")
  }
} satisfies Record<string, ComponentMapping>;
