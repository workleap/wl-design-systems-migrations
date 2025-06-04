import { ComponentMapMetaData, PropsMapMetaData } from "../../utils/types.ts";
import { getAttributeLiteralValue, hasAttribute } from "../helpers.ts";

const additions = {
  UNSAFE_marginBottom: (tag) => {
    if (
      hasAttribute(tag.node, [
        "marginBottom",
        "UNSAFE_marginBottom",
        "margin",
        "UNSAFE_margin",
      ])
    ) {
      return null;
    }

    const size = hasAttribute(tag.node, "size")
      ? getAttributeLiteralValue(tag.node, "size")
      : "md";
    switch (size) {
      case "xs":
        return "calc(1.125rem * .5)";
      case "sm":
        return "calc(1.375rem * .5)";
      case "md":
        return "calc(1.75rem * .5)";
      case "lg":
        return "calc(2rem * .5)";
      case "xl":
        return "calc(2.5rem * .5)";
      case "2xl":
        return "calc(1rem * .5)";
      case "3xl":
        return "calc(1rem * .5)";
      default:
        return null;
    }
  },
} satisfies PropsMapMetaData["additions"];

export const headingMappings = {
  Heading: {
    props: {
      additions,
    },
  },
  HeadingProps: "HeadingProps",
  H1: {
    props: {
      additions,
    },
  },
  H2: {
    props: {
      additions,
    },
  },
  H3: {
    props: {
      additions,
    },
  },
  H4: {
    props: {
      additions,
    },
  },
  H5: {
    props: {
      additions,
    },
  },
  H6: {
    props: {
      additions,
    },
  },
} satisfies Record<string, ComponentMapMetaData>;
