import { createStyleMapper, isPercentageValue } from "../../helpers.js";

import {
  LineHeightMapping as HopperLineHeightMapping,
  SizingMapping as HopperSizingMapping,
} from "@hopper-ui/components";
import {
  LineHeightMapping as OrbiterLineHeightMapping,
  SizingMapping as OrbiterSizingMapping,
} from "@workleap/orbiter-ui";

export const widthMapper = createStyleMapper({
  propertyName: "width",
  unsafePropertyName: "UNSAFE_width",
  extraGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "width",
        value: originalValue,
      };
    }
    return null;
  },
});

export const heightMapper = createStyleMapper({
  propertyName: "height",
  unsafePropertyName: "UNSAFE_height",
  extraGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "height",
        value: originalValue,
      };
    }
    return null;
  },
});

export const minWidthMapper = createStyleMapper({
  propertyName: "minWidth",
  unsafePropertyName: "UNSAFE_minWidth",
  extraGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "minWidth",
        value: originalValue,
      };
    }
    return null;
  },
});

export const minHeightMapper = createStyleMapper({
  propertyName: "minHeight",
  unsafePropertyName: "UNSAFE_minHeight",
  extraGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "minHeight",
        value: originalValue,
      };
    }
    return null;
  },
});

export const maxWidthMapper = createStyleMapper({
  propertyName: "maxWidth",
  unsafePropertyName: "UNSAFE_maxWidth",
  extraGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "maxWidth",
        value: originalValue,
      };
    }
    return null;
  },
});

export const maxHeightMapper = createStyleMapper({
  propertyName: "maxHeight",
  unsafePropertyName: "UNSAFE_maxHeight",
  extraGlobalValues: ["auto", "fit-content", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "maxHeight",
        value: originalValue,
      };
    }
    return null;
  },
});

export const lineHeightMapper = createStyleMapper({
  propertyName: "lineHeight",
  unsafePropertyName: "UNSAFE_lineHeight",
  orbiterValidKeys: OrbiterLineHeightMapping,
  hopperValidKeys: HopperLineHeightMapping,
});
