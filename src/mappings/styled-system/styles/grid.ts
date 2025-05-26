import { createMapper, isFrValue, isPercentageValue } from "../../helpers.js";

import { SizingMapping as HopperSizingMapping } from "@hopper-ui/components";
import { SizingMapping as OrbiterSizingMapping } from "@workleap/orbiter-ui";

// Grid property mappers
export const gridMapper = "grid";
export const gridAreaMapper = "gridArea";
export const gridColumnMapper = "gridColumn";
export const gridColumnStartMapper = "gridColumnStart";
export const gridColumnEndMapper = "gridColumnEnd";
export const gridRowMapper = "gridRow";
export const gridRowStartMapper = "gridRowStart";
export const gridRowEndMapper = "gridRowEnd";
export const gridTemplateMapper = "gridTemplate";
export const gridTemplateAreasMapper = "gridTemplateAreas";
export const gridAutoFlowMapper = "gridAutoFlow";
export const gridColumnSpanMapper = "gridColumnSpan"; //although it has UNSAFE_gridColumnSpan version too, their types are always number. so the unsafe version is not required
export const gridRowSpanMapper = "gridRowSpan"; //although it has UNSAFE_gridRowSpan version too, their types are always number. so the unsafe version is not required

export const gridAutoColumnsMapper = createMapper({
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

export const gridAutoRowsMapper = createMapper({
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

export const gridTemplateColumnsMapper = createMapper({
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
export const gridTemplateRowsMapper = createMapper({
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
