import { createCssPropertyMapper } from "../../helpers.js";

import { BorderRadiusMapping as HopperBorderRadiusMapping } from "@hopper-ui/components";
import { BorderRadiusMapping as OrbiterBorderRadiusMapping } from "@workleap/orbiter-ui";

export const borderRadiusMapper = createCssPropertyMapper({
  propertyName: "borderRadius",
  unsafePropertyName: "UNSAFE_borderRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
});

export const borderTopLeftRadiusMapper = createCssPropertyMapper({
  propertyName: "borderTopLeftRadius",
  unsafePropertyName: "UNSAFE_borderTopLeftRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
});

export const borderTopRightRadiusMapper = createCssPropertyMapper({
  propertyName: "borderTopRightRadius",
  unsafePropertyName: "UNSAFE_borderTopRightRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
});

export const borderBottomLeftRadiusMapper = createCssPropertyMapper({
  propertyName: "borderBottomLeftRadius",
  unsafePropertyName: "UNSAFE_borderBottomLeftRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
});

export const borderBottomRightRadiusMapper = createCssPropertyMapper({
  propertyName: "borderBottomRightRadius",
  unsafePropertyName: "UNSAFE_borderBottomRightRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping,
});
