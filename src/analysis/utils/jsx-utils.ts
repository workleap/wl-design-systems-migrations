import { getLocalNameFromImport } from "../../utils/mapping.js";
import type { Runtime } from "../../utils/types.js";
import type { ComponentUsageData } from "../types.js";
import { shouldIgnoreProperty } from "./mapping-utils.js";

/**
 * Extracts imported components from source imports
 */
export function extractImportedComponents(
  j: Runtime["j"],
  root: Runtime["root"],
  sourcePackage: string
): { importedComponents: Record<string, string>; potentialComponents: Set<string> } {
  // Find all import declarations from the source package
  const sourceImports = root.find(j.ImportDeclaration, {
    source: { value: sourcePackage }
  });

  // Extract locally imported component names
  const importedComponents: Record<string, string> = {};
  // Keep track of potential components (will be confirmed by JSX usage)
  const potentialComponents: Set<string> = new Set();

  // Process all import declarations
  sourceImports.forEach(path => {
    const specifiers = path.value.specifiers;
    if (specifiers) {
      specifiers.forEach(spec => {
        if (spec.type === "ImportDefaultSpecifier") {
          const localName = getLocalNameFromImport(spec);
          importedComponents[localName] = localName;
          potentialComponents.add(localName);
        } else if (spec.type === "ImportSpecifier") {
          const importedName = typeof spec.imported.name === "string" ? spec.imported.name : "";
          const localName = getLocalNameFromImport(spec);
          importedComponents[localName] = importedName;
          potentialComponents.add(localName);
        }
      });
    }
  });

  return { importedComponents, potentialComponents };
}

/**
 * Extracts property value from JSX attribute
 */
export function extractPropertyValue(
  attr: any,
  j: Runtime["j"]
): string {
  let propValue = "true"; // Default for boolean props
  if (attr.value) {
    if (attr.value.type === "Literal") {
      propValue = String(attr.value.value);
    } else if (attr.value.type === "JSXExpressionContainer") {
      const expression = attr.value.expression;
      propValue = j(expression).toSource();
    }
  }

  return propValue;
}

/**
 * Processes JSX attributes and updates component usage data
 */
export function processJSXAttributes(
  attributes: any[],
  componentData: ComponentUsageData,
  options: {
    j: Runtime["j"];
    includeIgnoredList: boolean;
    project?: string;
    deep: boolean;
    filePath: string;
  }
): void {
  const { j, includeIgnoredList, project, deep, filePath } = options;

  attributes.forEach(attr => {
    if (attr.type === "JSXAttribute" && attr.name.type === "JSXIdentifier") {
      const propName = attr.name.name;

      // Skip ignored properties if not including ignore list
      if (!includeIgnoredList && shouldIgnoreProperty(propName)) {
        return;
      }

      // Initialize prop data if not exists
      if (!componentData.props[propName]) {
        componentData.props[propName] = {
          usage: 0,
          values: {}
        };
      }

      const propData = componentData.props[propName];
      
      // Increment prop usage count
      propData.usage++;

      // Collect prop value
      const propValue = extractPropertyValue(attr, j);

      // Track value with project-specific counts
      const valuesObj = propData.values;
      if (!valuesObj[propValue]) {
        valuesObj[propValue] = { total: 0 };
      }

      const valueData = valuesObj[propValue];
      if (valueData) {
        // Increment total count
        valueData.total++;

        // If project is specified, also track project-specific count
        if (project) {
          if (!valueData.projects) {
            valueData.projects = {};
          }
          valueData.projects[project] = (valueData.projects[project] || 0) + 1;
        }

        // If deep analysis is enabled, track file information
        if (deep) {
          if (!valueData.files) {
            valueData.files = [];
          }
          // Use Set to avoid duplicates, then convert back to array
          const fileSet = new Set(valueData.files);
          fileSet.add(filePath);
          valueData.files = Array.from(fileSet);
        }
      }
    }
  });
}
