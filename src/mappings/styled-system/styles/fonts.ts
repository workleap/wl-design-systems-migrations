import { createHopperCssPropertyMapper } from "../../helpers.js";

import {
  FontFamilyMapping as HopperFontFamilyMapping,
  FontSizeMapping as HopperFontSizeMapping,
  FontWeightMapping as HopperFontWeightMapping
} from "@hopper-ui/components";
import {
  FontFamilyMapping as OrbiterFontFamilyMapping,
  FontSizeMapping as OrbiterFontSizeMapping,
  FontWeightMapping as OrbiterFontWeightMapping
} from "@workleap/orbiter-ui";

export const fontFamilyMapper = createHopperCssPropertyMapper({
  propertyName: "fontFamily",
  unsafePropertyName: "UNSAFE_fontFamily",
  sourceValidKeys: OrbiterFontFamilyMapping,
  targetValidKeys: HopperFontFamilyMapping
});

export const fontSizeMapper = createHopperCssPropertyMapper({
  propertyName: "fontSize",
  unsafePropertyName: "UNSAFE_fontSize",
  validGlobalValues: [],
  sourceValidKeys: OrbiterFontSizeMapping,
  targetValidKeys: HopperFontSizeMapping,
  customMapper: (value, _, { j }) => {
    if (typeof value === "number") {
      return {
        to: "UNSAFE_fontSize",
        value: j.stringLiteral(`${value}px`)
      };
    }

    return null;
  }
});

export const fontStyleMapper = createHopperCssPropertyMapper({
  propertyName: "fontStyle",
  validGlobalValues: ["normal", "italic", "oblique"]
});

export const fontWeightMapper = createHopperCssPropertyMapper({
  propertyName: "fontWeight",
  unsafePropertyName: "UNSAFE_fontWeight",
  targetValidKeys: HopperFontWeightMapping,
  sourceValidKeys: OrbiterFontWeightMapping
});
