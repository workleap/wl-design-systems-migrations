import { createHopperCssPropertyMapper } from "../../helpers.ts";

import { IconColorMapping as HopperIconColorMapping } from "@hopper-ui/components";
import { IconColorMapping as OrbiterIconColorMapping } from "@workleap/orbiter-ui";

export const fillMapper = createHopperCssPropertyMapper({
  propertyName: "fill",
  unsafePropertyName: "UNSAFE_fill",
  validGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping
});

export const fillHoverMapper = createHopperCssPropertyMapper({
  propertyName: "fillHover",
  unsafePropertyName: "UNSAFE_fillHover",
  validGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping
});

export const fillFocusMapper = createHopperCssPropertyMapper({
  propertyName: "fillFocus",
  unsafePropertyName: "UNSAFE_fillFocus",
  validGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping
});

export const strokeFocusMapper = createHopperCssPropertyMapper({
  propertyName: "stroke",
  unsafePropertyName: "UNSAFE_stroke",
  validGlobalValues: [
    "child",
    "context-fill",
    "context-stroke",
    "none",
    "currentcolor",
    "transparent"
  ],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping
});
