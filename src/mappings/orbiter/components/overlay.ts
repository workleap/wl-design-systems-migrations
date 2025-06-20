import type { ComponentMapping } from "../../../utils/types.ts";

export const overlayMapping = {
  Overlay: {
    skipImport: true, 
    todoComments: "`Overlay` is not supported anymore. Remove it and move its props to `Modal` instead and use `isOpen` prop instead of `show`.",
    migrationNotes: "`Overlay` is not supported anymore. Remove it and move its props to `Modal` instead and use `isOpen` prop instead of `show`."
  },
  OverlayProps: "OverlayProps"
} satisfies Record<string, ComponentMapping>;