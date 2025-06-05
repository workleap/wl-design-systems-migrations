import { ComponentMapMetaData } from "../utils/types.ts";
import { buttonMapping } from "./components/button.ts";
import { buttonAsLinkMapping } from "./components/buttonAsLink..ts";
import { buttonGroupMapping } from "./components/buttonGroup.ts";
import { tileMapping } from "./components/tile.ts";
import { tileGroupMapping } from "./components/tileGroup.ts";
import { tileLinkMapping } from "./components/tileLink.ts";

export const buttonComponentsMappings: Record<string, ComponentMapMetaData> = {
  Counter: {
    todoComments:
      "`Counter` is not supported anymore. You need to find an alternative.",
  },
  ...buttonMapping,
  ...buttonAsLinkMapping,
  ...buttonGroupMapping,
  ...tileMapping,
  ...tileLinkMapping,
  ...tileGroupMapping,

  // TileGroup: "TileGroup",
  // TileGroupProps: "TileGroupProps",
  //TODO: Not direct map. Find appropriate component/type

  // IconButton: "Button",
  // IconButtonProps: "ButtonProps",
  // IconButtonAsLink: "LinkButton",
  // IconButtonAsLinkProps: "LinkButtonProps",

  // ToggleButton: "Button",
  // ToggleButtonProps: "ButtonProps",
  // ToggleIconButton: "Button",
  // ToggleIconButtonProps: "ButtonProps",

  // CrossButton: "CloseButton",
  // CrossButtonProps: "CloseButtonProps",
};
