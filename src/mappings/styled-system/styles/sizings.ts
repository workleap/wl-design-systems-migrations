import {
  createHopperCssPropertyMapper,
  isPercentageValue
} from "../../helpers.js";

import {
  LineHeightMapping as HopperLineHeightMapping,
  SizingMapping as HopperSizingMapping
} from "@hopper-ui/components";
import {
  LineHeightMapping as OrbiterLineHeightMapping,
  SizingMapping as OrbiterSizingMapping
} from "@workleap/orbiter-ui";

export const widthMapper = createHopperCssPropertyMapper({
  propertyName: "width",
  unsafePropertyName: "UNSAFE_width",
  validGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "width",
        value: originalValue
      };
    }

    return null;
  }
});

export const heightMapper = createHopperCssPropertyMapper({
  propertyName: "height",
  unsafePropertyName: "UNSAFE_height",
  validGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "height",
        value: originalValue
      };
    }

    return null;
  }
});

export const minWidthMapper = createHopperCssPropertyMapper({
  propertyName: "minWidth",
  unsafePropertyName: "UNSAFE_minWidth",
  validGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "minWidth",
        value: originalValue
      };
    }

    return null;
  }
});

export const minHeightMapper = createHopperCssPropertyMapper({
  propertyName: "minHeight",
  unsafePropertyName: "UNSAFE_minHeight",
  validGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "minHeight",
        value: originalValue
      };
    }

    return null;
  }
});

export const maxWidthMapper = createHopperCssPropertyMapper({
  propertyName: "maxWidth",
  unsafePropertyName: "UNSAFE_maxWidth",
  validGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "maxWidth",
        value: originalValue
      };
    }

    return null;
  }
});

export const maxHeightMapper = createHopperCssPropertyMapper({
  propertyName: "maxHeight",
  unsafePropertyName: "UNSAFE_maxHeight",
  validGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "maxHeight",
        value: originalValue
      };
    }

    return null;
  }
});

export const lineHeightMapper = createHopperCssPropertyMapper({
  propertyName: "lineHeight",
  unsafePropertyName: "UNSAFE_lineHeight",
  sourceValidKeys: OrbiterLineHeightMapping,
  targetValidKeys: HopperLineHeightMapping
});
