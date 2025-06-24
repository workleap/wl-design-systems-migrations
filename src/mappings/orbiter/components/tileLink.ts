import type { ComponentMapping } from "../../../utils/types.ts";

export const tileLinkMapping = {
  TileLink: {
    skipImport: true,
    todoComments:  "`TileLink` is not supported anymore. Check the generated migration notes for more details.",    
    migrationNotes:
      "`TileLink` is not supported. You should manually implement a `Link` with a `Tile` inside. You can also follow this to implement one: https://dev.azure.com/sharegate/ShareGate.One/_git/ShareGate.One?path=/src/frontend/client/src/components/TileLink/TileLink.tsx&version=GBmain&_a=contents "
  },
  TileLinkProps: {
    skipImport: true,
    todoComments:  "`TileLinkProps` is not supported anymore. Check the generated migration notes for more details.",    
    migrationNotes:
      // eslint-disable-next-line max-len
      "`TileLinkProps` is not supported. You should manually implement a `Link` with a `Tile` inside. You can also follow this to implement one: https://dev.azure.com/sharegate/ShareGate.One/_git/ShareGate.One?path=/src/frontend/client/src/components/TileLink/TileLink.tsx&version=GBmain&_a=contents "
  }
} satisfies Record<string, ComponentMapping>;
