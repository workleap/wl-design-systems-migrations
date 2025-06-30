import type { ComponentMapping } from "../../../utils/types.ts";
import { accordionItemMappings } from "./accordion.ts";
import { listBoxItemMappings } from "./listbox.ts";
import { menuItemMappings } from "./menu.ts";

export const itemMapping = {
  Item: [
    ...listBoxItemMappings.Item,
    ...menuItemMappings.Item,
    ...accordionItemMappings.Item
  ]
} satisfies Record<string, ComponentMapping>;