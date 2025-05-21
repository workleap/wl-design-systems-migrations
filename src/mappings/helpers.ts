import { JSXAttribute } from "jscodeshift";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "./styled-system/types.js";

export function tryGettingLiteralValue(
  value: JSXAttribute["value"]
): string | number | boolean | RegExp | null {
  if (value == null) {
    return null;
  } else if (value.type === "Literal") {
    return value.value;
  } else if (value.type === "StringLiteral") {
    // Add support for StringLiteral type
    return value.value;
  } else if (value.type === "JSXExpressionContainer") {
    if (value.expression.type === "Identifier") {
      return value.expression.name;
    } else if (value.expression.type === "Literal") {
      return value.expression.value;
    } else if (value.expression.type === "StringLiteral") {
      // Add support for StringLiteral in expressions
      return value.expression.value;
    }
  }
  return null;
}

export function isGlobalValue(value: string | boolean | RegExp): boolean {
  return (
    typeof value === "string" &&
    [
      "auto",
      "fit-content",
      "max-content",
      "min-content",
      "-moz-initial",
      "inherit",
      "initial",
      "revert",
      "revert-layer",
      "unset",
    ].includes(value)
  );
}

export function isPercentageValue(value: string | boolean | RegExp): boolean {
  return typeof value === "string" && /^-?\d+(\.\d+)?%$/.test(value);
}

export const getSizingPropertyMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    unsafePropertyName: HopperStyledSystemPropsKeys
  ): StyledSystemPropertyMapper =>
  (oldValue, { j }) => {
    const value = tryGettingLiteralValue(oldValue);
    if (value !== null) {
      if (typeof value === "number") {
        return {
          to: propertyName,
          value: j.literal(`core_${value}`),
        };
      } else if (isGlobalValue(value)) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (isPercentageValue(value)) {
        return {
          to: propertyName,
          value: oldValue,
        };
      }

      return {
        to: unsafePropertyName,
        value: oldValue,
      };
    }
    return null;
  };
