import { MapMetaData } from "./utils/types.js";

export const mappings: MapMetaData = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  components: {
    Div: {
      targetName: "Div",
      props: {
        width: "UNSAFE_width",
        height: "UNSAFE_height",
      },
    },
    Text: {
      targetName: "Text",
    },
  },
};
