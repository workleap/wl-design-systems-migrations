import { createMapper, isPercentageValue } from "../../helpers.js";

import { SizingMapping as HopperSizingMapping } from "@hopper-ui/components";
import { SizingMapping as OrbiterSizingMapping } from "@workleap/orbiter-ui";

export const widthMapper = createMapper({
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

export const heightMapper = createMapper({
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

export const minWidthMapper = createMapper({
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

export const minHeightMapper = createMapper({
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

export const maxWidthMapper = createMapper({
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

export const maxHeightMapper = createMapper({
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
