import type { ComponentMapping } from "../../../utils/types.ts";
import { getMigrationNote, getTodoComment } from "../message-utils.ts";

export const overlayMapping = {
  Overlay: {
    skipImport: true, 
    todoComments: getTodoComment("overlay_not_supported"),
    migrationNotes: getMigrationNote("overlay_not_supported")
  },
  OverlayProps: "OverlayProps"
} satisfies Record<string, ComponentMapping>;