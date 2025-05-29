import {
  JSXAttribute,
  JSXExpressionContainer,
  ObjectProperty,
} from "jscodeshift";
import {
  PropertyMapperFunction,
  PropertyMapResult,
  ReviewMe,
  REVIEWME_PREFIX,
  Runtime,
} from "../utils/types.js";
import { HopperStyledSystemPropsKeys } from "./styled-system/types.ts";

export function tryGettingLiteralValue(
  value: JSXAttribute["value"] | ObjectProperty["value"]
): string | number | boolean | RegExp | null {
  if (value == null) {
    return null;
  } else if (value.type === "Literal") {
    return value.value;
  } else if (
    value.type === "StringLiteral" ||
    value.type === "NumericLiteral"
  ) {
    // Add support for StringLiteral type
    return value.value;
  } else if (value.type === "JSXExpressionContainer") {
    if (value.expression.type === "Literal") {
      return value.expression.value;
    } else if (
      value.expression.type === "StringLiteral" ||
      value.expression.type === "NumericLiteral"
    ) {
      // Add support for StringLiteral in expressions
      return value.expression.value;
    }
  }
  return null;
}

export function isGlobalValue(
  value: string | boolean | number | RegExp,
  extra?: (string | number)[]
): boolean {
  return (
    (typeof value === "string" || typeof value === "number") &&
    [
      "-moz-initial",
      "inherit",
      "initial",
      "revert",
      "revert-layer",
      "unset",
      ...(extra || []),
    ].includes(value)
  );
}

export function isPercentageValue(
  value: string | number | boolean | RegExp
): boolean {
  return typeof value === "string" && /^-?\d+(\.\d+)?%$/.test(value);
}

export function isFrValue(value: string | number | boolean | RegExp): boolean {
  return typeof value === "string" && /^-?\d+(\.\d+)?fr$/.test(value);
}

export function hasSameKey(key: string, source: object, target: object) {
  return Object.keys(source).includes(key) && Object.keys(target).includes(key);
}

export function hasCoreVersionKey(key: string, source: object, target: object) {
  return (
    Object.keys(source).includes(key) &&
    Object.keys(target).includes(`core_${key}`)
  );
}

function parseResponsiveObjectValue<T extends string>(
  originalValue: JSXExpressionContainer,
  options: MapperOptions<T>,
  runtime: Runtime
): PropertyMapResult<T> | null {
  const { j } = runtime;

  if (originalValue.expression.type !== "ObjectExpression") {
    return null;
  }

  const objectExpression = originalValue.expression;
  const transformedProperties: any[] = [];
  let hasChanges = false;

  // each value may offer different property names. we keep track of them and use the one that has the highest priority
  let offeredTargetPropertyNames: (T | ReviewMe<T>)[] = [];

  // Process each property in the responsive object
  for (const property of objectExpression.properties) {
    if (
      //tsx parser returns ObjectProperty, but codemod default parser returns Property
      (property.type === "ObjectProperty" || property.type === "Property") &&
      property.key &&
      property.value
    ) {
      // Extract the literal value from the property value
      const literalValue = tryGettingLiteralValue(property.value);

      if (literalValue !== null) {
        const mappedResult = parseLiteralValue(
          literalValue,
          property.value,
          options,
          runtime
        );

        if (!mappedResult.value) {
          runtime.log(
            `Error in parsing the object expression literal value for property: ${j(
              property.key
            ).toSource()}`,
            property.value,
            "\n",
            "object expression: ",
            j(objectExpression).toSource()
          );

          throw new Error(
            "Mapped value is null or undefined. Check the log file for more details " +
              j(objectExpression).toSource()
          );
        }
        hasChanges = true;
        offeredTargetPropertyNames.push(mappedResult.to);

        transformedProperties.push(
          j.objectProperty(property.key, mappedResult.value)
        );
      } else {
        // Keep original if not a literal value
        transformedProperties.push(property);
      }
    } else {
      // Keep non-object properties as is
      transformedProperties.push(property);
    }
  }

  if (hasChanges) {
    // Create new ObjectExpression with transformed properties
    const newObjectExpression = j.objectExpression(transformedProperties);
    const newJsxExpressionContainer =
      j.jsxExpressionContainer(newObjectExpression);

    // To know which property name we should use, we follow this priorities:
    //1- Unsafe version has the highest priority
    //2- the ReviewMe version is the second priority
    //3- The original property name is the last priority
    let finalPropertyName: T | ReviewMe<T> = options.propertyName;

    if (
      options.unsafePropertyName &&
      offeredTargetPropertyNames.includes(options.unsafePropertyName)
    )
      finalPropertyName = options.unsafePropertyName;
    else if (
      offeredTargetPropertyNames.includes(
        getReviewMePropertyName(options.propertyName)
      )
    )
      finalPropertyName = getReviewMePropertyName(options.propertyName);
    else if (offeredTargetPropertyNames.includes(options.propertyName))
      finalPropertyName = options.propertyName;

    return {
      to: finalPropertyName,
      value: newJsxExpressionContainer,
    };
  }

  return null;
}

type MapperOptions<T extends string = string> = {
  propertyName: T;
  unsafePropertyName?: T | null;
  extraGlobalValues?: (string | number)[];
  orbiterValidKeys?: Object;
  hopperValidKeys?: Object;
  customMapper?: (
    value: string | number | boolean | RegExp,
    originalValue: JSXAttribute["value"] | ObjectProperty["value"],
    runtime: Runtime
  ) => ReturnType<PropertyMapperFunction<T>>;
};

export function createMapper<T extends string = string>(
  options: MapperOptions<T>
): PropertyMapperFunction<T> {
  return (originalValue, runtime) => {
    const { j, log } = runtime;
    const value = tryGettingLiteralValue(originalValue);

    if (value !== null) {
      return parseLiteralValue(value, originalValue, options, runtime);
    } else if (originalValue?.type === "JSXExpressionContainer") {
      return parseResponsiveObjectValue(originalValue, options, runtime);
    }
    log(
      `Skipping property "${options.propertyName}" because its value is not literal or responsive object.`,
      originalValue
    );

    return null;
  };
}

function parseLiteralValue<T extends string>(
  value: string | number | boolean | RegExp,
  originalValue: JSXAttribute["value"] | ObjectProperty["value"],
  options: MapperOptions<T>,
  runtime: Runtime
): PropertyMapResult<T> {
  const {
    propertyName,
    unsafePropertyName,
    extraGlobalValues,
    orbiterValidKeys = {},
    hopperValidKeys = {},
    customMapper,
  } = options;
  const { j } = runtime;

  if (isGlobalValue(value, extraGlobalValues)) {
    return {
      to: propertyName,
      value: originalValue,
    };
  } else if (
    (typeof value === "string" || typeof value === "number") &&
    hasSameKey(value.toString(), orbiterValidKeys, hopperValidKeys)
  ) {
    return {
      to: propertyName,
      value: originalValue,
    };
  } else if (
    (typeof value === "string" || typeof value === "number") &&
    hasCoreVersionKey(value.toString(), orbiterValidKeys, hopperValidKeys)
  ) {
    return {
      to: propertyName,
      value: j.stringLiteral(`core_${value}`),
    };
  }

  const customValue = customMapper?.(value, originalValue, runtime);
  if (customValue) return customValue;

  if (unsafePropertyName != null) {
    return {
      to: unsafePropertyName,
      value: originalValue,
    };
  } else {
    return {
      to: getReviewMePropertyName(propertyName),
      value: originalValue,
    };
  }
}

function getReviewMePropertyName<T extends string>(
  propertyName: T
): ReviewMe<T> {
  return `${REVIEWME_PREFIX}${propertyName}`;
}

export const createStyleMapper = (
  options: MapperOptions<HopperStyledSystemPropsKeys>
) => createMapper<HopperStyledSystemPropsKeys>(options);
