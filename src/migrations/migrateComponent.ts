import { Runtime } from "../utils/types.js";
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
  const migrateImportResult = migrateImport(componentName, runtime);
  const { mappings } = runtime;

  if (!migrateImportResult) {
    return; // No mapping found, exit early
  }

  const { oldLocalName, newLocalName } = migrateImportResult;

  if (newLocalName !== oldLocalName) {
    // rename all instances of the component with the target name
    const { j, root } = runtime;
    root
      .find(j.JSXIdentifier, {
        name: oldLocalName,
      })
      .forEach((path) => {
        path.node.name = newLocalName;
      });
  }

  // Migrate attributes for the component
  Object.entries(mappings.components[componentName]?.props || {}).forEach(
    ([oldAttrName, newAttrName]) => {
      migrateAttribute(newLocalName, oldAttrName, newAttrName, runtime);
    }
  );
}
