import { ComponentMapMetaData } from "../utils/types.ts";
import { buttonMapping } from "./components/button.ts";

export const buttonComponentsMappings: Record<string, ComponentMapMetaData> = {
  ...buttonMapping,

  // ButtonGroup: "ButtonGroup",
  // ButtonGroupProps: "ButtonGroupProps",
  // Tile: "Tile",
  // TileProps: "TileProps",
  // TileGroup: "TileGroup",
  // TileGroupProps: "TileGroupProps",
  //TODO: Not direct map. Find appropriate component/type
  // ButtonAsLink: "LinkButton",
  // ButtonAsLinkProps: "LinkButtonProps",
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
  // TextLinkAsButton: "LinkButton",
  // TextLinkAsButtonProps: "LinkButtonProps",
  // IconLinkAsButton: "LinkButton",
  // IconLinkAsButtonProps: "LinkButtonProps",
};
