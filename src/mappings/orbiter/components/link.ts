import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const linkMapping = {
  Link: {
    props: {
      mappings: {
        external: "isExternal",
        "onClick": "onPress",
        "onMouseEnter": "onHoverStart",
        "onMouseLeave": "onHoverEnd",
        "onAuxClick": () => ({
          todoComments: "`onAuxClick` is not supported anymore. Probably `onPress` could be used instead. https://hopper.workleap.design/components/Link#migration-notes"
        }),
        "shape": () => ({ 
          todoComments: "`shape` is not supported anymore. Remove it. https://hopper.workleap.design/components/Link#migration-notes"            
        })

      }
    }
  },
  LinkProps: "LinkProps"
} satisfies Record<string, ComponentMapMetaData>;