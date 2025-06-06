import type { ComponentMapMetaData } from "../utils/types.ts";
import { buttonMapping } from "./components/button.ts";
import { buttonAsLinkMapping } from "./components/buttonAsLink..ts";
import { buttonGroupMapping } from "./components/buttonGroup.ts";
import { crossButtonMapping } from "./components/crossButton.ts";
import { iconButtonMapping } from "./components/iconButton.ts";
import { iconButtonAsLinkMapping } from "./components/iconButtonAsLink.ts";
import { tileMapping } from "./components/tile.ts";
import { tileGroupMapping } from "./components/tileGroup.ts";
import { tileLinkMapping } from "./components/tileLink.ts";

export const buttonComponentsMappings: Record<string, ComponentMapMetaData> = {
  Counter: {
    todoComments:
      "`Counter` is not supported anymore. You need to find an alternative."
  },
  ...buttonMapping,
  ...buttonAsLinkMapping,
  ...buttonGroupMapping,
  ...tileMapping,
  ...tileLinkMapping,
  ...tileGroupMapping,
  ...iconButtonMapping,
  ...iconButtonAsLinkMapping,
  ...crossButtonMapping,
  // ToggleButton: "Button",
  // ToggleButtonProps: "ButtonProps",
  // ToggleIconButton: "Button",
  // ToggleIconButtonProps: "ButtonProps",
};
