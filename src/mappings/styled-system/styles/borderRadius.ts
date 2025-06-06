import { createHopperCssPropertyMapper } from "../../helpers.js";

import { BorderRadiusMapping as HopperBorderRadiusMapping } from "@hopper-ui/components";
import { BorderRadiusMapping as OrbiterBorderRadiusMapping } from "@workleap/orbiter-ui";

export const borderRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderRadius",
  unsafePropertyName: "UNSAFE_borderRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping
});

export const borderTopLeftRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderTopLeftRadius",
  unsafePropertyName: "UNSAFE_borderTopLeftRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping
});

export const borderTopRightRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderTopRightRadius",
  unsafePropertyName: "UNSAFE_borderTopRightRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping
});

export const borderBottomLeftRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottomLeftRadius",
  unsafePropertyName: "UNSAFE_borderBottomLeftRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping
});

export const borderBottomRightRadiusMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottomRightRadius",
  unsafePropertyName: "UNSAFE_borderBottomRightRadius",
  validGlobalValues: [0],
  sourceValidKeys: OrbiterBorderRadiusMapping,
  targetValidKeys: HopperBorderRadiusMapping
});
