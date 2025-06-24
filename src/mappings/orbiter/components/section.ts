import type { ComponentMapping } from "../../../utils/types.ts";
import { listBoxSectionMappings } from "./listbox.ts";
import { menuSectionMappings } from "./menu.ts";

export const sectionMapping = {
  Section: [
    ...listBoxSectionMappings.Section,
    ...menuSectionMappings.Section
  ]
} satisfies Record<string, ComponentMapping>;