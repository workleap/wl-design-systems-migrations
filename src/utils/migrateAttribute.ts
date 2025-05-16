import { Runtime } from "./types.js";

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
  newAttrName: string,
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
      const targetAttribute = attributes.find(
        (attr: any) => attr.name && attr.name.name === oldAttrName
      );

      if (targetAttribute) {
        j(path).replaceWith(
          j.jsxOpeningElement(
            j.jsxIdentifier(componentName),
            [
              ...attributes.filter(
                (attr: any) => attr.name && attr.name.name !== oldAttrName
              ),
              j.jsxAttribute(
                j.jsxIdentifier(newAttrName),
                targetAttribute.value
              ),
            ],
            path.node.selfClosing
          )
        );
      }
    });
}
