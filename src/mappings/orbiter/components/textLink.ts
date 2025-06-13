import { hasAttribute, tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";
import { linkMapping } from "./link.ts";

export const textLinkMapping = {
  TextLink: {
    to: "Link",
    props: {
      mappings: {
        ...linkMapping.Link.props.mappings,
        size: "size", 
        variant: //accent and negative (not used) is not supported
        (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "negative") {
            return {
              todoComments: "`negative` is not supported anymore. Remove it."
            };
          } else if (value === "accent") {
            return {            
              value: j.stringLiteral("secondary")
            };
          }          
        
          return null;
        },
        underline: () => ({
          todoComments: "`underline` is not supported anymore. Remove it."
        }),
        "onMouseDown":  (originalValue, runtime) => {
          const { j } = runtime;
          if (hasAttribute(runtime.tag.node, "onPress")) {
            return {
              todoComments: "`onMouseDown` is not supported anymore. Use `onPress` instead."
            };
          } else {
            return {
              to: "onPress"
            };
          }
        },
        "onKeyPress": "onKeyDown"
      }
    }
  },
  TextLinkProps: "LinkProps"
} satisfies Record<string, ComponentMapMetaData>;


export const textLinkAsButtonMapping = {
  TextLinkAsButton: {
    ...textLinkMapping.TextLink    
  },
  TextLinkAsButtonProps: "LinkProps"
} satisfies Record<string, ComponentMapMetaData>;
