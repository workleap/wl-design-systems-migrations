import type { ComponentMapping } from "../../../utils/types.ts";
import { listItemMappings } from "./listbox.ts";

export const itemMapping = {
  Item: [...listItemMappings.Item]
} satisfies Record<string, ComponentMapping>;