import { createStyleMapper } from "../../helpers.js";

import { BorderRadiusMapping as HopperBorderRadiusMapping } from "@hopper-ui/components";
import { BorderRadiusMapping as OrbiterBorderRadiusMapping } from "@workleap/orbiter-ui";

export const borderRadiusMapper = createStyleMapper({
  propertyName: "borderRadius",
  unsafePropertyName: "UNSAFE_borderRadius",
  extraGlobalValues: [0],
  orbiterValidKeys: OrbiterBorderRadiusMapping,
  hopperValidKeys: HopperBorderRadiusMapping,
});

export const borderTopLeftRadiusMapper = createStyleMapper({
  propertyName: "borderTopLeftRadius",
  unsafePropertyName: "UNSAFE_borderTopLeftRadius",
  extraGlobalValues: [0],
  orbiterValidKeys: OrbiterBorderRadiusMapping,
  hopperValidKeys: HopperBorderRadiusMapping,
});

export const borderTopRightRadiusMapper = createStyleMapper({
  propertyName: "borderTopRightRadius",
  unsafePropertyName: "UNSAFE_borderTopRightRadius",
  extraGlobalValues: [0],
  orbiterValidKeys: OrbiterBorderRadiusMapping,
  hopperValidKeys: HopperBorderRadiusMapping,
});

export const borderBottomLeftRadiusMapper = createStyleMapper({
  propertyName: "borderBottomLeftRadius",
  unsafePropertyName: "UNSAFE_borderBottomLeftRadius",
  extraGlobalValues: [0],
  orbiterValidKeys: OrbiterBorderRadiusMapping,
  hopperValidKeys: HopperBorderRadiusMapping,
});

export const borderBottomRightRadiusMapper = createStyleMapper({
  propertyName: "borderBottomRightRadius",
  unsafePropertyName: "UNSAFE_borderBottomRightRadius",
  extraGlobalValues: [0],
  orbiterValidKeys: OrbiterBorderRadiusMapping,
  hopperValidKeys: HopperBorderRadiusMapping,
});
