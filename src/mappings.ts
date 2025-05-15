export type ComponentMapMetaData = {
  targetName: string;
  props?: {
    [key: string]: string;
  };
};

export type MapMetaData = {
  sourcePackage: string;
  targetPackage: string;
  components: Record<string, ComponentMapMetaData>;
};

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
