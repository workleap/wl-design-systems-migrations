import type { ComponentMapping } from "../../../utils/types.ts";

export const tileLinkMapping = {
  TileLink: {
    skipImport: true,
    todoComments:
      "`TileLink` is not supported yet. You can follow this to implement one: https://dev.azure.com/sharegate/ShareGate.One/_git/ShareGate.One?path=/src/frontend/client/src/components/TileLink/TileLink.tsx&version=GBmain&_a=contents "
  },
  TileLinkProps: "TileLinkProps"
} satisfies Record<string, ComponentMapping>;
