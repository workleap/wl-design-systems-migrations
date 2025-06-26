import { createHopperCssPropertyMapper } from "../../../../utils/mapping.ts";

import {
  ComplexPaddingMapping as HopperComplexPaddingMapping,
  SimplePaddingMapping as HopperSimplePaddingMapping
} from "@hopper-ui/components";
import {
  ComplexPaddingMapping as OrbiterComplexPaddingMapping,
  SimplePaddingMapping as OrbiterSimplePaddingMapping
} from "@workleap/orbiter-ui";

const validGlobalValues = [0];

export const paddingMapper = createHopperCssPropertyMapper({
  propertyName: "padding",
  unsafePropertyName: "UNSAFE_padding",
  sourceValidKeys: OrbiterComplexPaddingMapping,
  targetValidKeys: HopperComplexPaddingMapping,
  validGlobalValues,
  customMapper: (value, originalValue, runtime) => {
    const { j } = runtime;
    if (typeof value === "number") {
      return {
        to: "padding",
        value: j.stringLiteral(`core_${value}`)
      };
    }

    return null;
  }
});

export const paddingBottomMapper = createHopperCssPropertyMapper({
  propertyName: "paddingBottom",
  unsafePropertyName: "UNSAFE_paddingBottom",
  validGlobalValues,
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingLeftMapper = createHopperCssPropertyMapper({
  propertyName: "paddingLeft",
  unsafePropertyName: "UNSAFE_paddingLeft",
  validGlobalValues,
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingRightMapper = createHopperCssPropertyMapper({
  propertyName: "paddingRight",
  unsafePropertyName: "UNSAFE_paddingRight",
  validGlobalValues,
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingTopMapper = createHopperCssPropertyMapper({
  propertyName: "paddingTop",
  unsafePropertyName: "UNSAFE_paddingTop",
  validGlobalValues,
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingXMapper = createHopperCssPropertyMapper({
  propertyName: "paddingX",
  unsafePropertyName: "UNSAFE_paddingX",
  validGlobalValues,
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingYMapper = createHopperCssPropertyMapper({
  propertyName: "paddingY",
  unsafePropertyName: "UNSAFE_paddingY",
  validGlobalValues,
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});
