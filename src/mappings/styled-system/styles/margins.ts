import { createCssPropertyMapper } from "../../helpers.js";

import {
  ComplexMarginMapping as HopperComplexMarginMapping,
  SimpleMarginMapping as HopperSimpleMarginMapping,
} from "@hopper-ui/components";
import {
  ComplexMarginMapping as OrbiterComplexMarginMapping,
  SimpleMarginMapping as OrbiterSimpleMarginMapping,
} from "@workleap/orbiter-ui";

export const marginMapper = createCssPropertyMapper({
  propertyName: "margin",
  unsafePropertyName: "UNSAFE_margin",
  sourceValidKeys: OrbiterComplexMarginMapping,
  targetValidKeys: HopperComplexMarginMapping,
});

export const marginBottomMapper = createCssPropertyMapper({
  propertyName: "marginBottom",
  unsafePropertyName: "UNSAFE_marginBottom",
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});

export const marginLeftMapper = createCssPropertyMapper({
  propertyName: "marginLeft",
  unsafePropertyName: "UNSAFE_marginLeft",
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});

export const marginRightMapper = createCssPropertyMapper({
  propertyName: "marginRight",
  unsafePropertyName: "UNSAFE_marginRight",
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});

export const marginTopMapper = createCssPropertyMapper({
  propertyName: "marginTop",
  unsafePropertyName: "UNSAFE_marginTop",
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});

export const marginXMapper = createCssPropertyMapper({
  propertyName: "marginX",
  unsafePropertyName: "UNSAFE_marginX",
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});

export const marginYMapper = createCssPropertyMapper({
  propertyName: "marginY",
  unsafePropertyName: "UNSAFE_marginY",
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});
