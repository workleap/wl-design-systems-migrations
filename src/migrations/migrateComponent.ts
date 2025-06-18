import { getComponentPropsMetadata, getTodoComment } from "../utils/migration.ts";
import type { Runtime } from "../utils/types.js";
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
  const { mappings, filePath } = runtime;

  if (!migrateImportResults) {
    return; // No mapping found, exit early
  }

  const { j, root } = runtime;

  // Process each imported alias
  migrateImportResults.forEach(({ oldLocalName, newLocalName }) => {
    const instances = root.find(j.JSXOpeningElement, {
      name: {
        name: oldLocalName
      }
    });

    if (newLocalName !== oldLocalName) {
      // rename all instances of the component with the target name
      // Note: we cannot use instances because it is not including closing tags
      root
        .find(j.JSXIdentifier, {
          name: oldLocalName
        })
        .forEach(path => {
          path.node.name = newLocalName;
        });
    }

    // Migrate attributes for this specific component alias
    const propsMetadata = getComponentPropsMetadata(componentName, mappings);

    Object.entries(propsMetadata?.mappings || {}).forEach(
      ([oldAttrName, newAttrName]) => {
        if (oldAttrName === newAttrName) {return;} // Skip if no change
        migrateAttribute(instances, oldAttrName, newAttrName, componentName, runtime);
      }
    );

    // Add additional attributes for this specific component alias
    Object.entries(propsMetadata?.additions || {}).forEach(
      ([newAttrName, newAttrValue]) => {
        instances.forEach(path => {
          if (typeof newAttrValue === "function") {
            const newValue = newAttrValue(path, runtime);
            if (newValue !== null) {
              addAttribute(
                path,
                newAttrName,
                newAttrValue(path, runtime),
                runtime
              );
            }
          } else {addAttribute(path, newAttrName, newAttrValue, runtime);}
        });
      }
    );

    // Handle component-level migration notes
    const componentMapData = mappings.components[componentName];
    if (typeof componentMapData === "object" && componentMapData.migrationNotes) {
      try {
        runtime.getMigrationNotesManager().addMigrationNotes(componentName, componentMapData.migrationNotes, filePath);
      } catch (error) {
        runtime.log(String(error));
      }
    }

    // Add todoComments if any
    if (
      typeof componentMapData === "object" &&
      componentMapData.todoComments !== undefined
    ) {
      const todoComment = componentMapData.todoComments;

      instances.forEach(path => {
        let comments : string | string[] | undefined = [];
        if (typeof todoComment === "function") {
          comments = todoComment(path, runtime);
        } else {
          comments = todoComment;
        }

        if (typeof comments === "string") {
          comments = [comments];
        } else if (comments === undefined) {
          comments = [];
        }           

        path.node.comments = [
          ...path.node.comments || [],
          ...comments.map(msg => getTodoComment(msg, runtime, true))
        ];
      });
    }
  });
}
