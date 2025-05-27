import { Options, mappings } from "jscodeshift";
import { layoutComponents } from "../utils/layoutComponents.ts";
import { Runtime } from "../utils/types.js";
import { migrateComponent } from "./migrateComponent.js";

export function migrate(
  runtime: Runtime,
  options?: Options
): string | undefined {
  // Easily migrate individual components by name
  const { mappings } = runtime;
  const componentName = options?.c ?? "all";

  if (componentName === "layout") {
    layoutComponents.forEach((sourceComponentName) => {
      if (mappings.components[sourceComponentName]) {
        migrateComponent(sourceComponentName, runtime);
      }
    });
  } else if (componentName !== "all" && mappings.components[componentName]) {
    migrateComponent(componentName, runtime);
  } else if (componentName === "all") {
    // Migrate all components in the map
    Object.keys(mappings.components).forEach((sourceComponentName) => {
      migrateComponent(sourceComponentName, runtime);
    });
  } else {
    console.log(`Component ${componentName} not found in mappings.`);
  }
  return runtime.root.toSource();
}
