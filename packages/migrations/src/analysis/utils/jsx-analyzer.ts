import type { Runtime } from "../../utils/types.ts";
import type { ComponentUsageData } from "../types.ts";
import { extractImportedComponents, processJSXAttributes } from "./jsx-utils.ts";

/**
 * Performs the core JSX element analysis to extract component usage data
 */
export function performJSXAnalysis(
  runtime: Runtime,
  sourcePackage: string,
  options: {
    includeIgnoredList: boolean;
    project?: string;
    deep: boolean;
  }
): Record<string, ComponentUsageData> {
  const { j, root, filePath } = runtime;
  const { includeIgnoredList, project, deep } = options;

  // Store component usage with counts
  const componentUsageData: Record<string, ComponentUsageData> = {};

  // Extract imported components
  const { importedComponents, potentialComponents } = extractImportedComponents(
    j,
    root,
    sourcePackage
  );

  // Find all JSX elements and track component usage
  root.find(j.JSXElement).forEach(path => {
    const elementName = path.value.openingElement.name;
    if (elementName.type === "JSXIdentifier") {
      const componentName = elementName.name;
      const originalComponentName = importedComponents[componentName];
      
      // Only process components that were imported from our source package
      if (originalComponentName && potentialComponents.has(componentName)) {
        // Initialize component data if not exists
        if (!componentUsageData[originalComponentName]) {
          componentUsageData[originalComponentName] = {
            count: {
              total: 0,
              ...project && { projects: {} }
            },
            props: {}
          };
        }

        const componentData = componentUsageData[originalComponentName];

        // Increment component usage count
        componentData.count.total++;
        if (project) {
          if (!componentData.count.projects) {
            componentData.count.projects = {};
          }
          componentData.count.projects[project] = (componentData.count.projects[project] || 0) + 1;
        }

        // Process props
        const attributes = path.value.openingElement.attributes || [];
        processJSXAttributes(attributes, componentData, {
          j,
          includeIgnoredList,
          project,
          deep,
          filePath,
          getRepoInfo: runtime.getRepoInfo,
          getBranch: runtime.getBranch
        });
      }
    }
  });

  return componentUsageData;
}
