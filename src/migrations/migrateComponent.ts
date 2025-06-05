import { JSXIdentifier } from "jscodeshift";
import { getComponentPropsMetadata, getTodoComment } from "../utils/mapping.js";
import { Runtime } from "../utils/types.js";
import { addAttribute } from "./addAttribute.js";
import { migrateAttribute } from "./migrateAttribute.js";
import { migrateImport } from "./migrateImport.js";

/**
 * Creates a function that migrates a component from one package to another
 * @param j - jscodeshift API
 * @param root - AST root
 * @param sourcePackage - Package to migrate from
 * @param targetPackage - Package to migrate to
 * @returns A function that takes a component name and migrates it
 */
export function migrateComponent(
  componentName: string,
  runtime: Runtime
): void {
  const migrateImportResults = migrateImport(componentName, runtime);
  const { mappings } = runtime;

  if (!migrateImportResults) {
    return; // No mapping found, exit early
  }

  const { j, root } = runtime;

  // Process each imported alias
  migrateImportResults.forEach(({ oldLocalName, newLocalName }) => {
    const instances = root.find(j.JSXOpeningElement, {
      name: {
        name: oldLocalName,
      },
    });

    if (newLocalName !== oldLocalName) {
      // rename all instances of the component with the target name
      // Note: we cannot use instances because it is not including closing tags
      root
        .find(j.JSXIdentifier, {
          name: oldLocalName,
        })
        .forEach((path) => {
          path.node.name = newLocalName;
        });
    }

    // Migrate attributes for this specific component alias
    const propsMetadata = getComponentPropsMetadata(componentName, mappings);

    Object.entries(propsMetadata?.mappings || {}).forEach(
      ([oldAttrName, newAttrName]) => {
        if (oldAttrName === newAttrName) return; // Skip if no change
        migrateAttribute(instances, oldAttrName, newAttrName, runtime);
      }
    );

    // Add additional attributes for this specific component alias
    Object.entries(propsMetadata?.additions || {}).forEach(
      ([newAttrName, newAttrValue]) => {
        instances.forEach((path) => {
          if (typeof newAttrValue === "function") {
            const newValue = newAttrValue(path, runtime);
            if (newValue !== null)
              addAttribute(
                path,
                newAttrName,
                newAttrValue(path, runtime),
                runtime
              );
          } else addAttribute(path, newAttrName, newAttrValue, runtime);
        });
      }
    );

    // Add todoComments if any
    const componentMapData = mappings.components[componentName];

    if (
      typeof componentMapData === "object" &&
      componentMapData.todoComments !== undefined
    ) {
      const comment = componentMapData.todoComments;

      instances.forEach((path) => {
        path.node.comments = [
          ...(path.node.comments || []),
          getTodoComment(comment, runtime, true),
        ];
      });
    }
  });
}
