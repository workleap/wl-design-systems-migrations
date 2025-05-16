import { migrateAttribute } from "./migrateAttribute.js";
import { migrateImport } from "./migrateImport.js";
import { Runtime } from "./types.js";

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
  const { localName } = migrateImport(componentName, runtime);
  const { mappings } = runtime;

  if (localName) {
    Object.entries(mappings.components[componentName]?.props || {}).forEach(
      ([oldAttrName, newAttrName]) => {
        migrateAttribute(localName, oldAttrName, newAttrName, runtime);
      }
    );
  }
}
