import {
  createCssPropertyMapper,
  isFrValue,
  isPercentageValue,
} from "../../helpers.js";

import { SizingMapping as HopperSizingMapping } from "@hopper-ui/components";
import { SizingMapping as OrbiterSizingMapping } from "@workleap/orbiter-ui";

export const gridAutoColumnsMapper = createCssPropertyMapper({
  propertyName: "gridAutoColumns",
  unsafePropertyName: "UNSAFE_gridAutoColumns",
  validGlobalValues: ["auto", "min-content", "max-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value) || isFrValue(value)) {
      return {
        to: "gridAutoColumns",
        value: originalValue,
      };
    }
    return null;
  },
});

export const gridAutoRowsMapper = createCssPropertyMapper({
  propertyName: "gridAutoRows",
  unsafePropertyName: "UNSAFE_gridAutoRows",
  validGlobalValues: ["auto", "min-content", "max-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value) || isFrValue(value)) {
      return {
        to: "gridAutoRows",
        value: originalValue,
      };
    }
    return null;
  },
});

export const gridTemplateColumnsMapper = createCssPropertyMapper({
  propertyName: "gridTemplateColumns",
  unsafePropertyName: "UNSAFE_gridTemplateColumns",
  validGlobalValues: ["none", "subgrid", "auto", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value) || isFrValue(value)) {
      return {
        to: "gridTemplateColumns",
        value: originalValue,
      };
    }
    return null;
  },
});
export const gridTemplateRowsMapper = createCssPropertyMapper({
  propertyName: "gridTemplateRows",
  unsafePropertyName: "UNSAFE_gridTemplateRows",
  validGlobalValues: ["none", "subgrid", "auto", "max-content", "min-content"],
  sourceValidKeys: OrbiterSizingMapping,
  targetValidKeys: HopperSizingMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value) || isFrValue(value)) {
      return {
        to: "gridTemplateRows",
        value: originalValue,
      };
    }
    return null;
  },
});
