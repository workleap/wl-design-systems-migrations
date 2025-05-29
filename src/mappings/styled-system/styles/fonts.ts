import { createStyleMapper } from "../../helpers.js";

import {
  FontFamilyMapping as HopperFontFamilyMapping,
  FontSizeMapping as HopperFontSizeMapping,
  FontWeightMapping as HopperFontWeightMapping,
} from "@hopper-ui/components";
import {
  FontFamilyMapping as OrbiterFontFamilyMapping,
  FontSizeMapping as OrbiterFontSizeMapping,
  FontWeightMapping as OrbiterFontWeightMapping,
} from "@workleap/orbiter-ui";

export const fontFamilyMapper = createStyleMapper({
  propertyName: "fontFamily",
  unsafePropertyName: "UNSAFE_fontFamily",
  orbiterValidKeys: OrbiterFontFamilyMapping,
  hopperValidKeys: HopperFontFamilyMapping,
});

export const fontSizeMapper = createStyleMapper({
  propertyName: "fontSize",
  unsafePropertyName: "UNSAFE_fontSize",
  extraGlobalValues: [],
  orbiterValidKeys: OrbiterFontSizeMapping,
  hopperValidKeys: HopperFontSizeMapping,
  customMapper: (value, _, { j }) => {
    if (typeof value === "number") {
      return {
        to: "UNSAFE_fontSize",
        value: j.stringLiteral(`${value}px`),
      };
    }
    return null;
  },
});

export const fontStyleMapper = createStyleMapper({
  propertyName: "fontStyle",
  extraGlobalValues: ["normal", "italic", "oblique"],
});

export const fontWeightMapper = createStyleMapper({
  propertyName: "fontWeight",
  unsafePropertyName: "UNSAFE_fontWeight",
  hopperValidKeys: HopperFontWeightMapping,
  orbiterValidKeys: OrbiterFontWeightMapping,
});
