import { createCssPropertyMapper } from "../../helpers.ts";

import { IconColorMapping as HopperIconColorMapping } from "@hopper-ui/components";
import { IconColorMapping as OrbiterIconColorMapping } from "@workleap/orbiter-ui";

export const fillMapper = createCssPropertyMapper({
  propertyName: "fill",
  unsafePropertyName: "UNSAFE_fill",
  validGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping,
});

export const fillHoverMapper = createCssPropertyMapper({
  propertyName: "fillHover",
  unsafePropertyName: "UNSAFE_fillHover",
  validGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping,
});

export const fillFocusMapper = createCssPropertyMapper({
  propertyName: "fillFocus",
  unsafePropertyName: "UNSAFE_fillFocus",
  validGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping,
});

export const strokeFocusMapper = createCssPropertyMapper({
  propertyName: "stroke",
  unsafePropertyName: "UNSAFE_stroke",
  validGlobalValues: [
    "child",
    "context-fill",
    "context-stroke",
    "none",
    "currentcolor",
    "transparent",
  ],
  sourceValidKeys: OrbiterIconColorMapping,
  targetValidKeys: HopperIconColorMapping,
});
