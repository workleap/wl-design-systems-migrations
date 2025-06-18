import type { Options } from "jscodeshift";
import { isMappingCategoryKey, type Runtime } from "../utils/types.js";
import { migrateComponent } from "./migrateComponent.js";

export function migrate(
  runtime: Runtime,
  options?: Options
): string | undefined {
  // Easily migrate individual components by name
  const { mappings } = runtime;
  const components = (options?.c ?? "all") as string;

  if (components === "all") {
    // Migrate all components in the map
    Object.keys(mappings.components).forEach(sourceComponentName => {
      migrateComponent(sourceComponentName, runtime);
    });
  } else if (mappings.categories && isMappingCategoryKey(components, mappings.categories)) {
    mappings.categories[components].forEach(sourceComponentName => {
      if (mappings.components[sourceComponentName]) {
        migrateComponent(sourceComponentName, runtime);
      }
    });
  } else {
    components.split(",").forEach(name => {
      // eslint-disable-next-line no-param-reassign
      name = name.trim();
      if (mappings.components[name]) {
        migrateComponent(name, runtime);
      } else {
        runtime.log(`Component ${name} not found in mappings.`);
      }
    });
  }

  // Automatically generate migration notes and cleanup
  runtime.getMigrationNotesManager().generateMigrationNotesFile()    
    .catch(error => runtime.log(`Migration notes error: ${error}`, "error"));

  // The following is not working as expected: 
  // For some components, it ignores the previous formatting and put everything in one line.
  //return runtime.root.toSource({ wrapColumn:Number.MAX_SAFE_INTEGER });
  return runtime.root.toSource();
}
