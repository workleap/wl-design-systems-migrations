import type { ComponentMapping } from "../../utils/types.ts";
import { accordionMapping } from "./components/accordion.ts";
import { disclosureArrowMapping, disclosureMapping } from "./components/disclosure.ts";
import { tabMapping } from "./components/tab.ts";


export const disclosureComponentsMappings: Record<string, ComponentMapping> = {
//disclosure & accordion - total usage: 28
  ...disclosureMapping,
  ...disclosureArrowMapping,
  ...accordionMapping,
  ...tabMapping
};
