import { Collection, JSXOpeningElement } from "jscodeshift";
import { PropertyMapperFunction, Runtime } from "../utils/types.js";

/**
 * Renames JSX attributes for a specific component
 * @param j - jscodeshift API
 * @param root - AST root
 * @param componentName - Component name to modify
 * @param oldAttrName - Old attribute name
 * @param newAttrName - New attribute name
 */
export function migrateAttribute(
  instances: Collection<JSXOpeningElement>,
  oldAttrName: string,
  newAttributeMap: string | PropertyMapperFunction,
  runtime: Runtime
): void {
  const { j, log } = runtime;
  instances.forEach((path) => {
    const attributes = path.node.attributes || [];
    const sourceAttribute = attributes.find(
      (attr: any) => attr.name && attr.name.name === oldAttrName
    );

    if (sourceAttribute && sourceAttribute.type === "JSXAttribute") {
      const newAttribute: { name: string; value: any } = {
        name: "",
        value: null,
      };

      if (typeof newAttributeMap === "function") {
        const mapResult = newAttributeMap(sourceAttribute.value, runtime);
        if (mapResult) {
          const { to, value } = mapResult;
          newAttribute.name = to;
          newAttribute.value = value;
        } else {
          return; // Skip if there is no mapping
        }
      } else {
        newAttribute.name = newAttributeMap;
        newAttribute.value = sourceAttribute.value;
      }

      // Replace just the source attribute in place
      const sourceAttrIndex = attributes.indexOf(sourceAttribute);

      if (sourceAttrIndex !== -1 && path.node.attributes) {
        path.node.attributes[sourceAttrIndex] = j.jsxAttribute(
          j.jsxIdentifier(newAttribute.name),
          newAttribute.value
        );
      }
    }
  });
}
