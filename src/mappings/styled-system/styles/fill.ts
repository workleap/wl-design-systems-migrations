import { createStyleMapper } from "../../helpers.ts";

import { IconColorMapping as HopperIconColorMapping } from "@hopper-ui/components";
import { IconColorMapping as OrbiterIconColorMapping } from "@workleap/orbiter-ui";

export const fillMapper = createStyleMapper({
  propertyName: "fill",
  unsafePropertyName: "UNSAFE_fill",
  extraGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  orbiterValidKeys: OrbiterIconColorMapping,
  hopperValidKeys: HopperIconColorMapping,
});

export const fillHoverMapper = createStyleMapper({
  propertyName: "fillHover",
  unsafePropertyName: "UNSAFE_fillHover",
  extraGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  orbiterValidKeys: OrbiterIconColorMapping,
  hopperValidKeys: HopperIconColorMapping,
});

export const fillFocusMapper = createStyleMapper({
  propertyName: "fillFocus",
  unsafePropertyName: "UNSAFE_fillFocus",
  extraGlobalValues: ["child", "context-fill", "context-stroke", "none"],
  orbiterValidKeys: OrbiterIconColorMapping,
  hopperValidKeys: HopperIconColorMapping,
});

export const strokeFocusMapper = createStyleMapper({
  propertyName: "stroke",
  unsafePropertyName: "UNSAFE_stroke",
  extraGlobalValues: [
    "child",
    "context-fill",
    "context-stroke",
    "none",
    "currentcolor",
    "transparent",
  ],
  orbiterValidKeys: OrbiterIconColorMapping,
  hopperValidKeys: HopperIconColorMapping,
});
