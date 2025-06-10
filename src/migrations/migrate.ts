import type { Options } from "jscodeshift";
import { layoutComponentsMappings } from "../mappings/layout-components-mappings.ts";
import { getMappingKeys, type Runtime } from "../utils/types.js";
import { migrateComponent } from "./migrateComponent.js";

export function migrate(
  runtime: Runtime,
  options?: Options
): string | undefined {
  // Easily migrate individual components by name
  const { mappings } = runtime;
  const components = (options?.c ?? "all") as string;

  if (components === "layout") {
    getMappingKeys(layoutComponentsMappings).forEach(sourceComponentName => {
      if (mappings.components[sourceComponentName]) {
        migrateComponent(sourceComponentName, runtime);
      }
    });
  } else if (components === "all") {
    // Migrate all components in the map
    Object.keys(mappings.components).forEach(sourceComponentName => {
      migrateComponent(sourceComponentName, runtime);
    });
  } else {
    components.split(",").forEach(name => {
      // eslint-disable-next-line no-param-reassign
      name = name.trim();
      if (mappings.components[name]) {
        migrateComponent(name, runtime);
      } else {
        console.log(`Component ${name} not found in mappings.`);
      }
    });
  }

  // The following is not working as expected: 
  // For some components, it ignores the previous formatting and put everything in one line.
  //return runtime.root.toSource({ wrapColumn:Number.MAX_SAFE_INTEGER });
  return runtime.root.toSource();
}
