/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type {
  ASTPath,
  JSXAttribute,
  JSXElement,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXFragment,
  JSXOpeningElement,
  Literal,
  ObjectProperty
} from "jscodeshift";
import { extractImportedComponents } from "../analysis/utils/jsx-utils.ts";
import { addImportCase } from "../migrations/migrateImport.ts";
import {
  type HopperStyledSystemPropsKeys,
  type LiteralType,
  type PropertyMapperFunction,
  type PropertyMapResult,
  type PropertyRemoveResult,
  type ReviewMe,
  REVIEWME_PREFIX,
  type Runtime
} from "./types.ts";

export function hasAttribute(
  tag: JSXOpeningElement,
  keys: string[] | string
): boolean {
  return (
    tag.attributes?.find(
      attr =>
        attr.type == "JSXAttribute" &&
        typeof attr.name.name == "string" &&
        (Array.isArray(keys)
          ? keys.includes(attr.name.name)
          : attr.name.name === keys)
    ) !== undefined
  );
}

export function isWithinComponent(
  path: ASTPath<JSXOpeningElement>,
  componentNames: string | string[],
  packageName: string,
  { j, root }: Runtime
): boolean {
  // Extract components from the source package that this codemod is working with
  const { importedComponents } = extractImportedComponents(j, root, packageName);      
  let current = path.parentPath;
  
  while (current) {
    if (j.JSXElement.check(current.node)) {
      const openingElement = (current.node as JSXElement).openingElement;
      const tagName = openingElement.name;
     
      if (tagName.type === "JSXIdentifier") {
        const name = tagName.name;
        const original = importedComponents[name] || name;//we should OR as we are not sure the parent component is imported from the same package
        if (Array.isArray(componentNames) ? componentNames.includes(original) : componentNames === original && importedComponents[name] !== undefined) {
          return true;
        }
      }
    }
    current = current.parentPath;
  }

  return false;
}

export function addChildrenTo(to: ASTPath<JSXOpeningElement>, childTagName: string, children: (Exclude<JSXElement["children"], undefined>[number] | null | undefined)[] = [], runtime: Runtime) {
  const { j } = runtime;
  
  //add a Header child to the tag
  const header = j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier(childTagName), [], false),
    j.jsxClosingElement(j.jsxIdentifier(childTagName)),
    children?.filter(child => !(child == null || child === undefined))
  );

  addImportCase({ target: { componentName: childTagName, localName: childTagName } }, runtime);

  //add the header as the first child of the tag
  const jsxElement = to.parent.value;
      
  // Create newline and indentation text nodes
  const newline = j.jsxText("\n");
  const endNewline = j.jsxText("\n");
      
  if (jsxElement.children) {
    jsxElement.children.unshift(newline, header);
    if (jsxElement.children[jsxElement.children.length - 1].type !== "JSXText" || 
            !jsxElement.children[jsxElement.children.length - 1].value.includes("\n")) {
      jsxElement.children.push(endNewline);
    }
  } else {
    jsxElement.children = [newline, header, endNewline];
  }      
}

export function createObjectExpression(obj: Record<string, any>, runtime: Runtime) {
  const { j } = runtime;

  return j.jsxExpressionContainer(
    j.objectExpression(
      Object.entries(obj).map(([key, value]) =>
        j.property("init", j.identifier(key), j.literal(value))
      )
    )
  );
}

export const isAttributeValueType = (
  val: any
): val is Literal | JSXExpressionContainer | JSXElement | JSXFragment | null => {
  if (val === null) {
    return true; // `null` is valid (e.g., for boolean attributes like <button disabled />)
  }
  if (typeof val !== "object" || !val || typeof val.type !== "string") {
    return false; // Must be an object with a 'type' property
  }

  // Valid AST node types for JSXAttribute["value"]
  // (Literal includes StringLiteral, NumericLiteral, BooleanLiteral, NullLiteral)
  const validTypes: string[] = [
    "BigIntLiteral",
    "DecimalLiteral",
    "Literal",
    "StringLiteral",
    "NumericLiteral",
    "RegExpLiteral",
    "BooleanLiteral",
    "NullLiteral",
    "JSXExpressionContainer",
    "JSXElement",
    "JSXFragment",
    "JSXText"
  ];

  return validTypes.includes(val.type);
};

export function getAttributeLiteralValue(
  tag: JSXOpeningElement,
  attributeName: string,
  runtime: Runtime
) {
  return tryGettingLiteralValue(getAttributeValue(tag, attributeName), runtime);
}

export function getAttributeValue(tag: JSXOpeningElement, attributeName: string) {
  const attribute = tag.attributes?.find(
    attr =>
      attr.type === "JSXAttribute" &&
      attr.name.name === attributeName &&
      attr.value != null
  );

  if (attribute && attribute.type == "JSXAttribute") {
    return attribute.value;
  }
}

export function tryGettingLiteralValue(
  value: JSXAttribute["value"] | ObjectProperty["value"] | JSXEmptyExpression,
  runtime: Runtime
): LiteralType | null {
  const { j } = runtime;

  if (j.Literal.check(value, true)) {
    return value.value;
  } else if (j.JSXExpressionContainer.check(value)) {
    return tryGettingLiteralValue(value.expression, runtime);
  }

  return null;
}

function isGlobalValue(
  value: LiteralType,
  validValues?: (string | number)[]
): boolean {
  return (
    validValues !== undefined &&
    (typeof value === "string" || typeof value === "number") &&
    validValues.includes(value)
  );
}

export function isPercentageValue(
  value: LiteralType
): boolean {
  return typeof value === "string" && /^-?\d+(\.\d+)?%$/.test(value);
}

export function isFrValue(value: LiteralType): boolean {
  return typeof value === "string" && /^-?\d+(\.\d+)?fr$/.test(value);
}

function hasSameKey(key: string, enumMapping: EnumMapping) {
  const { sourceValidKeys, targetValidKeys } = enumMapping || {};

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
  value: LiteralType,
  originalValue: JSXAttribute["value"] | ObjectProperty["value"],
  options: PropertyMapperOptions<T>,
  runtime: Runtime
): PropertyMapResult<T> | PropertyRemoveResult {
  const {
    propertyName,
    unsafePropertyName,
    validGlobalValues,
    enumMapping,
    customMapper
  } = options;
  const { j } = runtime;

  if (isGlobalValue(value, validGlobalValues)) {
    return {
      to: propertyName,
      value: originalValue
    };
  } else if (
    enumMapping &&
    (typeof value === "string" || typeof value === "number") &&
    hasSameKey(value.toString(), enumMapping)
  ) {
    return {
      to: propertyName,
      value: originalValue
    };
  } else if (
    enumMapping &&
    (typeof value === "string" || typeof value === "number") &&
    hasTransformedKey(value.toString(), enumMapping)
  ) {
    return {
      to: propertyName,
      value: j.stringLiteral(enumMapping.getValidTransform(value))
    };
  }

  const customValue = customMapper?.(value, originalValue, runtime);
  if (customValue) {return customValue;}

  if (unsafePropertyName != null) {
    return {
      to: unsafePropertyName,
      value: originalValue
    };
  } else {
    return {
      to: getReviewMePropertyName(propertyName),
      value: originalValue
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
  const offeredTargetPropertyNames: (T | ReviewMe<T>)[] = [];

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

        if ("removeIt" in mappedResult) {
          continue;
        }

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
    ) {finalPropertyName = options.unsafePropertyName;} else if (
      offeredTargetPropertyNames.includes(
        getReviewMePropertyName(options.propertyName)
      )
    ) {finalPropertyName = getReviewMePropertyName(options.propertyName);} else if (offeredTargetPropertyNames.includes(options.propertyName)) {finalPropertyName = options.propertyName;}

    return {
      to: finalPropertyName,
      value: newJsxExpressionContainer
    };
  }

  return null;
}
interface EnumMapping {
  sourceValidKeys: object;
  targetValidKeys: object;
  getValidTransform: (sourceKey: string | number) => string;
}

interface PropertyMapperOptions<T extends string = string> {
  propertyName: T;
  unsafePropertyName?: T | null;
  validGlobalValues?: (string | number)[];
  enumMapping?: EnumMapping;
  customMapper?: (
    value: LiteralType,
    originalValue: JSXAttribute["value"] | ObjectProperty["value"],
    runtime: Runtime
  ) => ReturnType<PropertyMapperFunction<T>>;
}

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
      ...options.validGlobalValues ?? []
    ],
    enumMapping:
      options.sourceValidKeys && options.targetValidKeys
        ? {
          sourceValidKeys: options.sourceValidKeys,
          targetValidKeys: options.targetValidKeys,
          getValidTransform: sourceKey => {
            return `core_${sourceKey}`;
          }
        }
        : undefined
  });
