import { isArray } from "@hopper-ui/components";
import {
  JSXAttribute,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXOpeningElement,
  JSXSpreadAttribute,
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

export function hasAttribute(
  tag: JSXOpeningElement,
  keys: string[] | string
): boolean {
  return (
    tag.attributes?.find(
      (attr) =>
        attr.type == "JSXAttribute" &&
        typeof attr.name.name == "string" &&
        (isArray(keys)
          ? keys.includes(attr.name.name)
          : attr.name.name === keys)
    ) !== undefined
  );
}

export function getAttributeLiteralValue(
  tag: JSXOpeningElement,
  attributeName: string,
  runtime: Runtime
) {
  const attribute = tag.attributes?.find(
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name.name === attributeName &&
      attr.value != null
  );

  if (attribute && attribute.type == "JSXAttribute") {
    return tryGettingLiteralValue(attribute.value, runtime);
  }
  return null;
}

export function tryGettingLiteralValue(
  value: JSXAttribute["value"] | ObjectProperty["value"] | JSXEmptyExpression,
  runtime: Runtime
): string | number | boolean | RegExp | null {
  const { j } = runtime;

  if (j.Literal.check(value, true)) {
    return value.value;
  } else if (j.JSXExpressionContainer.check(value)) {
    return tryGettingLiteralValue(value.expression, runtime);
  }

  return null;
}

function isGlobalValue(
  value: string | boolean | number | RegExp,
  validValues?: (string | number)[]
): boolean {
  return (
    validValues !== undefined &&
    (typeof value === "string" || typeof value === "number") &&
    validValues.includes(value)
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

function hasSameKey(key: string, enumMapping: EnumMapping) {
  const { sourceValidKeys, targetValidKeys } = enumMapping;
  enumMapping || {};

  return (
    Object.keys(sourceValidKeys).includes(key) &&
    Object.keys(targetValidKeys).includes(key)
  );
}

function hasTransformedKey(key: string, enumMapping: EnumMapping) {
  const { sourceValidKeys, targetValidKeys, getValidTransform } = enumMapping;

  return (
    Object.keys(sourceValidKeys).includes(key) &&
    Object.keys(targetValidKeys).includes(getValidTransform(key))
  );
}

export function getReviewMePropertyName<T extends string>(
  propertyName: T
): ReviewMe<T> {
  return `${REVIEWME_PREFIX}${propertyName}`;
}

function parseLiteralValue<T extends string>(
  value: string | number | boolean | RegExp,
  originalValue: JSXAttribute["value"] | ObjectProperty["value"],
  options: PropertyMapperOptions<T>,
  runtime: Runtime
): PropertyMapResult<T> {
  const {
    propertyName,
    unsafePropertyName,
    validGlobalValues,
    enumMapping,
    customMapper,
  } = options;
  const { j } = runtime;

  if (isGlobalValue(value, validGlobalValues)) {
    return {
      to: propertyName,
      value: originalValue,
    };
  } else if (
    enumMapping &&
    (typeof value === "string" || typeof value === "number") &&
    hasSameKey(value.toString(), enumMapping)
  ) {
    return {
      to: propertyName,
      value: originalValue,
    };
  } else if (
    enumMapping &&
    (typeof value === "string" || typeof value === "number") &&
    hasTransformedKey(value.toString(), enumMapping)
  ) {
    return {
      to: propertyName,
      value: j.stringLiteral(enumMapping.getValidTransform(value)),
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

function parseResponsiveObjectValue<T extends string>(
  originalValue: JSXExpressionContainer,
  options: PropertyMapperOptions<T>,
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
      const literalValue = tryGettingLiteralValue(property.value, runtime);

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
        offeredTargetPropertyNames.push(
          mappedResult.to ?? options.propertyName
        );

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
type EnumMapping = {
  sourceValidKeys: Object;
  targetValidKeys: Object;
  getValidTransform: (sourceKey: string | number) => string;
};

type PropertyMapperOptions<T extends string = string> = {
  propertyName: T;
  unsafePropertyName?: T | null;
  validGlobalValues?: (string | number)[];
  enumMapping?: EnumMapping;
  customMapper?: (
    value: string | number | boolean | RegExp,
    originalValue: JSXAttribute["value"] | ObjectProperty["value"],
    runtime: Runtime
  ) => ReturnType<PropertyMapperFunction<T>>;
};

function createPropertyMapper<T extends string = string>(
  options: PropertyMapperOptions<T>
): PropertyMapperFunction<T> {
  return (originalValue, runtime) => {
    const { log } = runtime;
    const value = tryGettingLiteralValue(originalValue, runtime);

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

export const createHopperCssPropertyMapper = (
  options: CssPropertyMapperOptions<HopperStyledSystemPropsKeys>
) => createCssPropertyMapper<HopperStyledSystemPropsKeys>(options);

type CssPropertyMapperOptions<T extends string = string> = Omit<
  PropertyMapperOptions<T>,
  "enumMapping"
> & {
  sourceValidKeys?: EnumMapping["sourceValidKeys"];
  targetValidKeys?: EnumMapping["targetValidKeys"];
};

export const createCssPropertyMapper = <T extends string>(
  options: CssPropertyMapperOptions<T>
) =>
  createPropertyMapper<T>({
    ...options,
    validGlobalValues: [
      "-moz-initial",
      "inherit",
      "initial",
      "revert",
      "revert-layer",
      "unset",
      ...(options.validGlobalValues ?? []),
    ],
    enumMapping:
      options.sourceValidKeys && options.targetValidKeys
        ? {
            sourceValidKeys: options.sourceValidKeys,
            targetValidKeys: options.targetValidKeys,
            getValidTransform: (sourceKey) => {
              return `core_${sourceKey}`;
            },
          }
        : undefined,
  });
