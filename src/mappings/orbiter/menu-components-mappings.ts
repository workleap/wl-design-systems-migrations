import type { ComponentMapping } from "../../utils/types.ts";
import { listboxMapping } from "./components/listbox.ts";
import { menuMapping, menuTriggerMapping } from "./components/menu.ts";


export const menuComponentsMappings: Record<string, ComponentMapping> = {
  ...menuTriggerMapping,
  ...menuMapping,
  ...listboxMapping
};
