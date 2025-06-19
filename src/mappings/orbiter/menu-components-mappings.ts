import type { ComponentMapMetaData } from "../../utils/types.ts";
import { listboxMapping } from "./components/listbox.ts";


export const menuComponentsMappings: Record<string, ComponentMapMetaData> = {
 
  //menus & lists - total usage: 74
  Menu: "Menu", //usage: 31
  MenuProps: "MenuProps",
  MenuItem: "MenuItem", //usage: 0 (Item: 326)
  MenuItemProps: "MenuItemProps",
  MenuSection: "MenuSection", //usage: 0 (Section: 9)
  MenuSectionProps: "MenuSectionProps",
  MenuTrigger: "MenuTrigger", //usage: 32
  MenuTriggerProps: "MenuTriggerProps",

  ...listboxMapping,
  // ListboxSection: "ListBoxSection", // usage: 0
  // ListboxSectionProps: "ListBoxSectionProps",
  // ListboxOption: "ListBoxItem",// usage: 0
  // ListboxOptionProps: "ListBoxItemProps",

  item: [() => ({
    component: "MenuItem",
    props: {
      role: "menuitem",
      tabIndex: 0
    }
  })]

};
