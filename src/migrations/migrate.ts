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
  const components = (options?.c ?? "all") as string;

  if (components === "layout") {
    layoutComponents.forEach((sourceComponentName) => {
      if (mappings.components[sourceComponentName]) {
        migrateComponent(sourceComponentName, runtime);
      }
    });
  } else if (components === "all") {
    // Migrate all components in the map
    Object.keys(mappings.components).forEach((sourceComponentName) => {
      migrateComponent(sourceComponentName, runtime);
    });
  } else {
    components.split(",").forEach((name) => {
      name = name.trim();
      if (mappings.components[name]) {
        migrateComponent(name, runtime);
      } else {
        console.log(`Component ${name} not found in mappings.`);
      }
    });
  }
  return runtime.root.toSource();
}
