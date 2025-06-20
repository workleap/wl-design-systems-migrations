import type { ComponentMapping } from "../../utils/types.ts";
import { buttonMapping } from "./components/button.ts";
import { buttonAsLinkMapping } from "./components/buttonAsLink..ts";
import { buttonGroupMapping } from "./components/buttonGroup.ts";
import { crossButtonMapping } from "./components/crossButton.ts";
import { iconButtonMapping } from "./components/iconButton.ts";
import { iconButtonAsLinkMapping } from "./components/iconButtonAsLink.ts";
import { iconLinkAsButtonMapping, iconLinkMapping } from "./components/iconLink.ts";
import { linkMapping } from "./components/link.ts";
import { textLinkAsButtonMapping, textLinkMapping } from "./components/textLink.ts";
import { tileMapping } from "./components/tile.ts";
import { tileGroupMapping } from "./components/tileGroup.ts";
import { tileLinkMapping } from "./components/tileLink.ts";
import { toggleButtonMapping } from "./components/toggleButton.ts";
import { toggleIconButtonMapping } from "./components/toggleIconButton.ts";

export const buttonComponentsMappings: Record<string, ComponentMapping> = {
  ...buttonMapping,
  ...buttonAsLinkMapping,
  ...buttonGroupMapping,
  ...tileMapping,
  ...tileLinkMapping,
  ...tileGroupMapping,
  ...iconButtonMapping,
  ...iconButtonAsLinkMapping,
  ...crossButtonMapping,
  ...toggleButtonMapping,
  ...toggleIconButtonMapping,

  ...linkMapping,
  ...textLinkMapping,
  ...textLinkAsButtonMapping,
  ...iconLinkMapping,
  ...iconLinkAsButtonMapping

};
