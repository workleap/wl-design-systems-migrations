import type { ComponentMapping } from "../../../utils/types.ts";
import { listBoxSectionMappings } from "./listbox.ts";

export const sectionMapping = {
  Section: [...listBoxSectionMappings.Section]
} satisfies Record<string, ComponentMapping>;