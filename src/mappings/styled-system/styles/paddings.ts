import { createHopperCssPropertyMapper } from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper
} from "../types.js";

import {
  ComplexPaddingMapping as HopperComplexPaddingMapping,
  SimplePaddingMapping as HopperSimplePaddingMapping
} from "@hopper-ui/components";
import {
  ComplexPaddingMapping as OrbiterComplexPaddingMapping,
  SimplePaddingMapping as OrbiterSimplePaddingMapping
} from "@workleap/orbiter-ui";

export const paddingMapper = createHopperCssPropertyMapper({
  propertyName: "padding",
  unsafePropertyName: "UNSAFE_padding",
  sourceValidKeys: OrbiterComplexPaddingMapping,
  targetValidKeys: HopperComplexPaddingMapping,
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
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingLeftMapper = createHopperCssPropertyMapper({
  propertyName: "paddingLeft",
  unsafePropertyName: "UNSAFE_paddingLeft",
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingRightMapper = createHopperCssPropertyMapper({
  propertyName: "paddingRight",
  unsafePropertyName: "UNSAFE_paddingRight",
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingTopMapper = createHopperCssPropertyMapper({
  propertyName: "paddingTop",
  unsafePropertyName: "UNSAFE_paddingTop",
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingXMapper = createHopperCssPropertyMapper({
  propertyName: "paddingX",
  unsafePropertyName: "UNSAFE_paddingX",
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});

export const paddingYMapper = createHopperCssPropertyMapper({
  propertyName: "paddingY",
  unsafePropertyName: "UNSAFE_paddingY",
  sourceValidKeys: OrbiterSimplePaddingMapping,
  targetValidKeys: HopperSimplePaddingMapping
});
