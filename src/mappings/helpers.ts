import { JSXAttribute } from "jscodeshift";

export function tryGettingLiteralValue(
  value: JSXAttribute["value"]
): string | number | boolean | RegExp | null {
  if (value == null) {
    return null;
  } else if (value.type === "Literal") {
    return value.value;
  } else if (value.type === "JSXExpressionContainer") {
    if (value.expression.type === "Identifier") {
      return value.expression.name;
    } else if (value.expression.type === "Literal") {
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
