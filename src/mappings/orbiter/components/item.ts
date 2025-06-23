import type { ComponentMapping } from "../../../utils/types.ts";
import { listBoxItemMappings } from "./listbox.ts";

export const itemMapping = {
  Item: [...listBoxItemMappings.Item]
} satisfies Record<string, ComponentMapping>;