import { JSXIdentifier } from "jscodeshift";
import { getComponentPropsMetadata } from "../utils/mapping.js";
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
  const migrateImportResult = migrateImport(componentName, runtime);
  const { mappings } = runtime;

  if (!migrateImportResult) {
    return; // No mapping found, exit early
  }

  const { j, root } = runtime;

  const { oldLocalName, newLocalName } = migrateImportResult;
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

  // Migrate attributes for the component
  const propsMetadata = getComponentPropsMetadata(componentName, mappings);

  Object.entries(propsMetadata?.mappings || {}).forEach(
    ([oldAttrName, newAttrName]) => {
      migrateAttribute(instances, oldAttrName, newAttrName, runtime);
    }
  );

  // Add additional attributes for the component
  Object.entries(propsMetadata?.additions || {}).forEach(
    ([newAttrName, newAttrValue]) => {
      instances.forEach((path) => {
        addAttribute(path, newAttrName, newAttrValue, runtime);
      });
    }
  );
}
