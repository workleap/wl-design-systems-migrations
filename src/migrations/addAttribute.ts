import type { ASTPath, JSXAttribute, JSXOpeningElement } from "jscodeshift";
import { createObjectExpression, isAttributeValueType } from "../utils/mapping.ts";
import type { Runtime } from "../utils/types.js";


export function addAttribute(
  openingElement: ASTPath<JSXOpeningElement>,
  newAttrName: string,
  newAttrValue: string | number | boolean | object | JSXAttribute["value"],
  runtime: Runtime
): void {
  const { j } = runtime;

  const attributes = openingElement.node.attributes || [];
  const sourceAttribute = attributes.find(
    (attr: any) => attr.name && attr.name.name === newAttrName
  );

  if (sourceAttribute) {return;} // Skip if the attribute already exists

  const createAttributeValue = (value: string | number | boolean | object | null) => {
    if (value === null) {return null;}
    if (typeof value === "string") {return j.stringLiteral(value);}
    if (typeof value === "number") {return j.jsxExpressionContainer(j.literal(value));}
    if (typeof value === "boolean") {return j.jsxExpressionContainer(j.literal(value));}
    if (typeof value === "object") {return createObjectExpression(value, runtime);}

    return null;
  };

  let value: JSXAttribute["value"] | null = null;

  if (
    typeof newAttrValue === "string" ||
    typeof newAttrValue === "number" ||
    typeof newAttrValue === "boolean" ||
    (typeof newAttrValue === "object" && !isAttributeValueType(newAttrValue))
  ) {
    value = createAttributeValue(newAttrValue);
  } else {
    value = newAttrValue;
  }

 
  const newAttributeNode = j.jsxAttribute(j.jsxIdentifier(newAttrName), value);

  attributes.push(newAttributeNode);
  openingElement.node.attributes = attributes;
}
