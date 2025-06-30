import { hasAttribute, tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";
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
              todoComments: getTodoComment("text_link_negative_not_supported")
            };
          } else if (value === "accent") {
            return {            
              value: j.stringLiteral("primary")
            };
          } else if (value === "primary") {
            return {            
              value: j.stringLiteral("secondary")
            };
          }             
        
          return null;
        },
        underline: (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "none") {
            return {
              to: "isQuiet",
              value: j.jsxExpressionContainer(j.booleanLiteral(true))
            };
          } else {
            return {
              todoComments: getTodoComment("text_link_underline_not_supported")
            };
          }
        },
        onMouseDown:  (_, { tag }) => {          
          if (hasAttribute(tag.node, "onPress")) {
            return {
              todoComments: getTodoComment("text_link_on_mouse_down_not_supported")
            };
          } else {
            return {
              to: "onPress"
            };
          }
        },
        onKeyPress: (_, { tag }) => {          
          if (hasAttribute(tag.node, "onPress")) {
            return {
              todoComments: getTodoComment("text_link_on_key_press_not_supported")
            };
          } else {
            return {
              to: "onPress"
            };
          }
        }
      }
    }
  },
  TextLinkProps: "LinkProps"
} satisfies Record<string, ComponentMapping>;


export const textLinkAsButtonMapping = {
  TextLinkAsButton: {
    ...textLinkMapping.TextLink    
  },
  TextLinkAsButtonProps: "LinkProps"
} satisfies Record<string, ComponentMapping>;
