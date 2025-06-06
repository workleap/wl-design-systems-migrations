import type { ComponentMapMetaData } from "../../utils/types.ts";
import { tileMapping } from "./tile.ts";

export const tileLinkMapping = {
  TileLink: {
    //...tileMapping.Tile,
    todoComments:
      "`TileLink` is not supported yet. You can follow this to implement one: https://dev.azure.com/sharegate/ShareGate.One/_git/ShareGate.One?path=/src/frontend/client/src/components/TileLink/TileLink.tsx&version=GBmain&_a=contents "
  },
  TileLinkProps: "TileLinkProps"
} satisfies Record<string, ComponentMapMetaData>;
