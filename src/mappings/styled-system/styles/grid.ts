import {
  createStyleMapper,
  isFrValue,
  isPercentageValue,
} from "../../helpers.js";

import { SizingMapping as HopperSizingMapping } from "@hopper-ui/components";
import { SizingMapping as OrbiterSizingMapping } from "@workleap/orbiter-ui";

export const gridAutoColumnsMapper = createStyleMapper({
  propertyName: "gridAutoColumns",
  unsafePropertyName: "UNSAFE_gridAutoColumns",
  extraGlobalValues: ["auto", "min-content", "max-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
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

export const gridAutoRowsMapper = createStyleMapper({
  propertyName: "gridAutoRows",
  unsafePropertyName: "UNSAFE_gridAutoRows",
  extraGlobalValues: ["auto", "min-content", "max-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
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

export const gridTemplateColumnsMapper = createStyleMapper({
  propertyName: "gridTemplateColumns",
  unsafePropertyName: "UNSAFE_gridTemplateColumns",
  extraGlobalValues: ["none", "subgrid", "auto", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
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
export const gridTemplateRowsMapper = createStyleMapper({
  propertyName: "gridTemplateRows",
  unsafePropertyName: "UNSAFE_gridTemplateRows",
  extraGlobalValues: ["none", "subgrid", "auto", "max-content", "min-content"],
  orbiterValidKeys: OrbiterSizingMapping,
  hopperValidKeys: HopperSizingMapping,
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
