import type { Collection, JSXOpeningElement } from "jscodeshift";
import { getTodoComment } from "../utils/mapping.ts";
import type { PropertyMapperFunction, Runtime } from "../utils/types.js";

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
  instances.forEach(path => {
    const attributes = path.node.attributes || [];
    const sourceAttribute = attributes.find(
      (attr: any) => attr.name && attr.name.name === oldAttrName
    );

    if (sourceAttribute && sourceAttribute.type === "JSXAttribute") {
      const newAttribute: { name: string; value: any; todoComments?: string } =
        {
          name: "",
          value: null
        };

      if (typeof newAttributeMap === "function") {
        const mapResult = newAttributeMap(sourceAttribute.value, {
          ...runtime,
          tag: path
        });
        if (mapResult) {
          const { to, value, todoComments } = mapResult;
          newAttribute.name = to ?? oldAttrName;
          newAttribute.value = value === undefined ? sourceAttribute.value : value;
          newAttribute.todoComments = todoComments;
        } else {
          return; // Skip if there is no mapping
        }
      } else {
        newAttribute.name = newAttributeMap;
        newAttribute.value = sourceAttribute.value;
      }

      // Check if the new attribute name already exists
      const existingNewAttribute = attributes.find(
        (attr: any) =>
          attr != sourceAttribute &&
          attr.name &&
          attr.name.name === newAttribute.name
      );

      if (existingNewAttribute) {
        log(
          `WARNING: Attribute '${newAttribute.name}' already exists, skipping migration of '${oldAttrName}'`
        );

        return;
      }

      // Replace just the source attribute in place
      const sourceAttributeIndex = attributes.indexOf(sourceAttribute);

      attributes[sourceAttributeIndex] = j.jsxAttribute(
        j.jsxIdentifier(newAttribute.name),
        newAttribute.value
      );

      // Add comments if provided
      if (newAttribute.todoComments) {
        attributes[sourceAttributeIndex].comments = [
          ...attributes[sourceAttributeIndex].comments || [],
          getTodoComment(newAttribute.todoComments, runtime)
        ];
      }
    }
  });
}
