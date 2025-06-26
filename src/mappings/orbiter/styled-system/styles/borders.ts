import { createHopperCssPropertyMapper } from "../../../../utils/mapping.ts";

import { BorderMapping as HopperBorderMapping } from "@hopper-ui/components";
import { BorderMapping as OrbiterBorderMapping } from "@workleap/orbiter-ui";

const validGlobalValues = [
  "currentcolor",
  "transparent",
  0,
  "none", 
  "dashed",
  "dotted",
  "double",
  "groove",
  "hidden",
  "inset",
  "outset",
  "ridge",
  "solid"
];

export const borderMapper = createHopperCssPropertyMapper({
  propertyName: "border",
  unsafePropertyName: "UNSAFE_border",
  validGlobalValues: ["currentcolor", "transparent", 0],
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderActiveMapper = createHopperCssPropertyMapper({
  propertyName: "borderActive",
  unsafePropertyName: "UNSAFE_borderActive",
  validGlobalValues: ["currentcolor", "transparent", 0],
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderFocusMapper = createHopperCssPropertyMapper({
  propertyName: "borderFocus",
  unsafePropertyName: "UNSAFE_borderFocus",
  validGlobalValues: ["currentcolor", "transparent", 0],
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderHoverMapper = createHopperCssPropertyMapper({
  propertyName: "borderHover",
  unsafePropertyName: "UNSAFE_borderHover",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderBottomMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottom",
  unsafePropertyName: "UNSAFE_borderBottom",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderBottomActiveMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottomActive",
  unsafePropertyName: "UNSAFE_borderBottomActive",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderBottomFocusMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottomFocus",
  unsafePropertyName: "UNSAFE_borderBottomFocus",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderBottomHoverMapper = createHopperCssPropertyMapper({
  propertyName: "borderBottomHover",
  unsafePropertyName: "UNSAFE_borderBottomHover",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderLeftMapper = createHopperCssPropertyMapper({
  propertyName: "borderLeft",
  unsafePropertyName: "UNSAFE_borderLeft",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderLeftActiveMapper = createHopperCssPropertyMapper({
  propertyName: "borderLeftActive",
  unsafePropertyName: "UNSAFE_borderLeftActive",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderLeftFocusMapper = createHopperCssPropertyMapper({
  propertyName: "borderLeftFocus",
  unsafePropertyName: "UNSAFE_borderLeftFocus",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderLeftHoverMapper = createHopperCssPropertyMapper({
  propertyName: "borderLeftHover",
  unsafePropertyName: "UNSAFE_borderLeftHover",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderRightMapper = createHopperCssPropertyMapper({
  propertyName: "borderRight",
  unsafePropertyName: "UNSAFE_borderRight",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderRightActiveMapper = createHopperCssPropertyMapper({
  propertyName: "borderRightActive",
  unsafePropertyName: "UNSAFE_borderRightActive",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderRightFocusMapper = createHopperCssPropertyMapper({
  propertyName: "borderRightFocus",
  unsafePropertyName: "UNSAFE_borderRightFocus",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderRightHoverMapper = createHopperCssPropertyMapper({
  propertyName: "borderRightHover",
  unsafePropertyName: "UNSAFE_borderRightHover",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderTopMapper = createHopperCssPropertyMapper({
  propertyName: "borderTop",
  unsafePropertyName: "UNSAFE_borderTop",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderTopActiveMapper = createHopperCssPropertyMapper({
  propertyName: "borderTopActive",
  unsafePropertyName: "UNSAFE_borderTopActive",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderTopFocusMapper = createHopperCssPropertyMapper({
  propertyName: "borderTopFocus",
  unsafePropertyName: "UNSAFE_borderTopFocus",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});

export const borderTopHoverMapper = createHopperCssPropertyMapper({
  propertyName: "borderTopHover",
  unsafePropertyName: "UNSAFE_borderTopHover",
  validGlobalValues,
  sourceValidKeys: OrbiterBorderMapping,
  targetValidKeys: HopperBorderMapping
});
