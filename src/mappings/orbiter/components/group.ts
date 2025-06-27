import type { ComponentMapping } from "../../../utils/types.ts";
import { getMigrationNote, getTodoComment } from "../message-utils.ts";

export const groupMapping = {
  Group: {
    skipImport: true,
    todoComments: getTodoComment("group_not_supported"),
    migrationNotes: getMigrationNote("group_migration_path")
  },
  GroupProps:{
    skipImport: true
  }
} satisfies Record<string, ComponentMapping>;