import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getMigrationNote, getTodoComment } from "../message-utils.ts";

export const lozengeMapping = {
  Lozenge: {
    to: "Tag",
    props: {
      mappings: {    
        highlight: (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (!originalValue || Boolean(value) != false) {
            return {
              to: "textTransform",
              value: j.stringLiteral("uppercase")
            };
          }

          return {
            todoComments: getTodoComment("lozenge_highlight_not_supported")
          };
        },
       
        variant: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          const map: Record<string, string> = {
            negative: "negative",
            positive: "positive",
            warning: "caution",
            informative: "progress"
          } ;

          if (typeof value === "string" && map[value]) {
            return {
              value: runtime.j.stringLiteral(map[value])
            };
          } else {
            return {
              todoComments: getTodoComment("lozenge_variant_manual_map")
            };
          }
        },
        
        size: () => ({
          migrationNotes: getMigrationNote("lozenge_tag_height_difference")
        })

      }
       
    }
  },
  LozengeProps: "TagProps"
} satisfies Record<string, ComponentMapping>;
