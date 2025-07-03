import { createHopperCssPropertyMapper } from "../../../../utils/mapping.ts";

import {
  BackgroundColorMapping as HopperBackgroundColorMapping,
  TextColorMapping as HopperTextColorMapping
} from "@hopper-ui/components";
import {
  BackgroundColorMapping as OrbiterBackgroundColorMapping,
  TextColorMapping as OrbiterTextColorMapping
} from "@workleap/orbiter-ui";

// Text color mappers
export const colorMapper = createHopperCssPropertyMapper({
  propertyName: "color",
  unsafePropertyName: "UNSAFE_color",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping
});

export const colorActiveMapper = createHopperCssPropertyMapper({
  propertyName: "colorActive",
  unsafePropertyName: "UNSAFE_colorActive",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping
});

export const colorFocusMapper = createHopperCssPropertyMapper({
  propertyName: "colorFocus",
  unsafePropertyName: "UNSAFE_colorFocus",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping
});

export const colorHoverMapper = createHopperCssPropertyMapper({
  propertyName: "colorHover",
  unsafePropertyName: "UNSAFE_colorHover",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping
});

// Background color mappers
export const backgroundColorMapper = createHopperCssPropertyMapper({
  propertyName: "backgroundColor",
  unsafePropertyName: "UNSAFE_backgroundColor",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping
});

export const backgroundColorActiveMapper = createHopperCssPropertyMapper({
  propertyName: "backgroundColorActive",
  unsafePropertyName: "UNSAFE_backgroundColorActive",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping
});

export const backgroundColorFocusMapper = createHopperCssPropertyMapper({
  propertyName: "backgroundColorFocus",
  unsafePropertyName: "UNSAFE_backgroundColorFocus",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping
});

export const backgroundColorHoverMapper = createHopperCssPropertyMapper({
  propertyName: "backgroundColorHover",
  unsafePropertyName: "UNSAFE_backgroundColorHover",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping
});
