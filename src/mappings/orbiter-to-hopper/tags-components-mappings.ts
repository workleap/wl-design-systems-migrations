import type { ComponentMapping } from "../../utils/types.ts";
import { lozengeMapping } from "./components/lozenge.ts";
import { tagListMapping, tagMapping } from "./components/tag.ts";


export const tagComponentsMappings: Record<string, ComponentMapping> = {
  ...tagMapping,
  ...tagListMapping,
  ...lozengeMapping
};
