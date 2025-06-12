import type { ComponentMapMetaData } from "../../utils/types.ts";
import { buttonMapping } from "./components/button.ts";
import { buttonAsLinkMapping } from "./components/buttonAsLink..ts";
import { buttonGroupMapping } from "./components/buttonGroup.ts";
import { crossButtonMapping } from "./components/crossButton.ts";
import { iconButtonMapping } from "./components/iconButton.ts";
import { iconButtonAsLinkMapping } from "./components/iconButtonAsLink.ts";
import { tileMapping } from "./components/tile.ts";
import { tileGroupMapping } from "./components/tileGroup.ts";
import { tileLinkMapping } from "./components/tileLink.ts";
import { toggleButtonMapping } from "./components/toggleButton.ts";
import { toggleIconButtonMapping } from "./components/toggleIconButton.ts";

export const buttonComponentsMappings: Record<string, ComponentMapMetaData> = {
  Counter: {
    todoComments:
      // eslint-disable-next-line max-len
      "`Counter` is not supported anymore. You need to find an alternative. You can see this as an example:https://dev.azure.com/sharegate/ShareGate.Protect.Web/_git/ShareGate.Protect.Web/commit/8c969df4da52b1a0208d54e295762f36aa364ce4?path=/apps/tenant-assessment/src/pages/sharing-links.%5BworkspaceId%5D.tsx&version=GBmain&line=83&lineEnd=89&lineStartColumn=1&lineEndColumn=1&type=2&lineStyle=plain&_a=files"
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
  ...toggleButtonMapping,
  ...toggleIconButtonMapping
};
