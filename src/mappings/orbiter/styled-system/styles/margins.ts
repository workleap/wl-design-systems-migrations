import { createHopperCssPropertyMapper } from "../../../../utils/mapping.ts";

import {
  ComplexMarginMapping as HopperComplexMarginMapping,
  SimpleMarginMapping as HopperSimpleMarginMapping
} from "@hopper-ui/components";
import {
  ComplexMarginMapping as OrbiterComplexMarginMapping,
  SimpleMarginMapping as OrbiterSimpleMarginMapping
} from "@workleap/orbiter-ui";

const validGlobalValues = ["auto", 0];

export const marginMapper = createHopperCssPropertyMapper({
  propertyName: "margin",
  unsafePropertyName: "UNSAFE_margin",
  validGlobalValues,
  sourceValidKeys: OrbiterComplexMarginMapping,
  targetValidKeys: HopperComplexMarginMapping
});

export const marginBottomMapper = createHopperCssPropertyMapper({
  propertyName: "marginBottom",
  unsafePropertyName: "UNSAFE_marginBottom",
  validGlobalValues,
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});

export const marginLeftMapper = createHopperCssPropertyMapper({
  propertyName: "marginLeft",
  unsafePropertyName: "UNSAFE_marginLeft",
  validGlobalValues,
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});

export const marginRightMapper = createHopperCssPropertyMapper({
  propertyName: "marginRight",
  unsafePropertyName: "UNSAFE_marginRight",
  validGlobalValues,
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});

export const marginTopMapper = createHopperCssPropertyMapper({
  propertyName: "marginTop",
  unsafePropertyName: "UNSAFE_marginTop",
  validGlobalValues,
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});

export const marginXMapper = createHopperCssPropertyMapper({
  propertyName: "marginX",
  unsafePropertyName: "UNSAFE_marginX",
  validGlobalValues,
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});

export const marginYMapper = createHopperCssPropertyMapper({
  propertyName: "marginY",
  unsafePropertyName: "UNSAFE_marginY",
  validGlobalValues,
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});
