import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

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
            todoComments: "`highlight` is not supported anymore. Use textTransform=uppercase instead. More details: https://hopper.workleap.design/components/Tag"
          };
        },
       
        variant: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          const map: Record<string, string> = {
            "negative": "negative",
            "positive": "positive",
            "warning": "caution",
            "informative": "progress"
          } ;

          if (typeof value === "string" && map[value]) {
            return {
              value: runtime.j.stringLiteral(map[value])
            };
          } else {
            return {
              todoComments: "Map `negative`->`Negative`, `warning`->`Caution`, `informative`->`Progress`, and `positive`->`Positive` manually if needed. More details: https://workleap.atlassian.net/wiki/spaces/TL/pages/5529272372/Orbiter+to+Hopper+Migration"
            };
          }
        },
        
        size: () => ({
          migrationNotes: "The alternative `Tag` might be a bit taller(4px) than the old `Lozenge` even with the same size. Make sure you validate the design after the migration."
        })

      }
       
    }
  },
  LozengeProps: "TagProps"
} satisfies Record<string, ComponentMapping>;
