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
  componentName: string,
  oldAttrName: string,
  newAttributeMap: string | PropertyMapperFunction,
  runtime: Runtime
): void {
  const { j, root } = runtime;
  root
    .find(j.JSXOpeningElement, {
      name: {
        name: componentName,
      },
    })
    .forEach((path: any) => {
      const attributes = path.node.attributes || [];
      const sourceAttribute = attributes.find(
        (attr: any) => attr.name && attr.name.name === oldAttrName
      );

      if (sourceAttribute) {
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

        j(path).replaceWith(
          j.jsxOpeningElement(
            j.jsxIdentifier(componentName),
            [
              ...attributes.filter(
                (attr: any) => attr.name && attr.name.name !== oldAttrName
              ),
              j.jsxAttribute(
                j.jsxIdentifier(newAttribute.name),
                newAttribute.value
              ),
            ],
            path.node.selfClosing
          )
        );
      }
    });
}
