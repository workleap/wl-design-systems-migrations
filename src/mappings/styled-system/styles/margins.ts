import { createStyleMapper } from "../../helpers.js";

import {
  ComplexMarginMapping as HopperComplexMarginMapping,
  SimpleMarginMapping as HopperSimpleMarginMapping,
} from "@hopper-ui/components";
import {
  ComplexMarginMapping as OrbiterComplexMarginMapping,
  SimpleMarginMapping as OrbiterSimpleMarginMapping,
} from "@workleap/orbiter-ui";

export const marginMapper = createStyleMapper({
  propertyName: "margin",
  unsafePropertyName: "UNSAFE_margin",
  orbiterValidKeys: OrbiterComplexMarginMapping,
  hopperValidKeys: HopperComplexMarginMapping,
});

export const marginBottomMapper = createStyleMapper({
  propertyName: "marginBottom",
  unsafePropertyName: "UNSAFE_marginBottom",
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});

export const marginLeftMapper = createStyleMapper({
  propertyName: "marginLeft",
  unsafePropertyName: "UNSAFE_marginLeft",
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});

export const marginRightMapper = createStyleMapper({
  propertyName: "marginRight",
  unsafePropertyName: "UNSAFE_marginRight",
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});

export const marginTopMapper = createStyleMapper({
  propertyName: "marginTop",
  unsafePropertyName: "UNSAFE_marginTop",
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});

export const marginXMapper = createStyleMapper({
  propertyName: "marginX",
  unsafePropertyName: "UNSAFE_marginX",
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});

export const marginYMapper = createStyleMapper({
  propertyName: "marginY",
  unsafePropertyName: "UNSAFE_marginY",
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});
