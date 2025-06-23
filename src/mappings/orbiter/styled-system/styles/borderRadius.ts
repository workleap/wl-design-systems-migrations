import { createHopperCssPropertyMapper, isPercentageValue } from "../../../../utils/mapping.ts";

import { BorderRadiusMapping as HopperBorderRadiusMapping } from "@hopper-ui/components";
import { BorderRadiusMapping as OrbiterBorderRadiusMapping } from "@workleap/orbiter-ui";

export const borderRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderRadius",
  unsafePropertyName: "UNSAFE_borderRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "borderRadius",
        value: originalValue
      };
    }
  
    return null;
  }
});

export const borderTopLeftRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderTopLeftRadius",
  unsafePropertyName: "UNSAFE_borderTopLeftRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "borderTopLeftRadius",
        value: originalValue
      };
    }
  
    return null;
  }
});

export const borderTopRightRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderTopRightRadius",
  unsafePropertyName: "UNSAFE_borderTopRightRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "borderTopRightRadius",
        value: originalValue
      };
    }
  
    return null;
  }
});

export const borderBottomLeftRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottomLeftRadius",
  unsafePropertyName: "UNSAFE_borderBottomLeftRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "borderBottomLeftRadius",
        value: originalValue
      };
    }
  
    return null;
  }
});

export const borderBottomRightRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottomRightRadius",
  unsafePropertyName: "UNSAFE_borderBottomRightRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
  customMapper: (value, originalValue) => {
    if (isPercentageValue(value)) {
      return {
        to: "borderBottomRightRadius",
        value: originalValue
      };
    }
  
    return null;
  }
});
