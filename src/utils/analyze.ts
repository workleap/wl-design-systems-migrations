import { existsSync, readFileSync, writeFileSync } from "fs";
import { Options } from "jscodeshift";
import { Runtime } from "./types.js";

/**
 * Merges two analysis result objects by combining their property arrays
 *
 * @param existingResults - The existing analysis results
 * @param newResults - The new analysis results to merge
 * @returns The merged analysis results
 */
export function mergeAnalysisResults(
  existingResults: Record<string, string[]>,
  newResults: Record<string, string[]>
): Record<string, string[]> {
  const merged: Record<string, string[]> = { ...existingResults };

  // Merge the new results into the existing ones
  Object.entries(newResults).forEach(([componentName, props]) => {
    if (merged[componentName]) {
      // Create a Set to deduplicate props
      const uniqueProps = new Set([...merged[componentName], ...props]);
      merged[componentName] = Array.from(uniqueProps);
    } else {
      merged[componentName] = props;
    }
  });

  return merged;
}

/**
 * Analyzes a file to find all component usages from the specified source package
 * and collects all properties used for each component.
 *
 * @param runtime - The runtime context containing jscodeshift and AST
 * @param outputPath - The path to save the analysis output, or null to skip file output
 * @param options - Optional jscodeshift options
 * @returns The original source code and the analysis results
 */
export function analyze(
  runtime: Runtime,
  outputPath: string | null,
  options?: Options & { sourcePackage?: string }
): { source: string | undefined; analysisResults: Record<string, string[]> } {
  const { j, root, mappings } = runtime;
  const sourcePackage = options?.sourcePackage || mappings.sourcePackage;
  const componentUsage: Record<string, Set<string>> = {};

  // Find all import declarations from the source package
  const sourceImports = root.find(j.ImportDeclaration, {
    source: { value: sourcePackage },
  });

  // Extract locally imported component names
  const importedComponents: Record<string, string> = {};
  // Keep track of potential components (will be confirmed by JSX usage)
  const potentialComponents: Set<string> = new Set();

  sourceImports.forEach((path) => {
    const specifiers = path.node.specifiers || [];

    specifiers.forEach((specifier) => {
      if (j.ImportSpecifier.check(specifier) && specifier.imported) {
        const importedName = specifier.imported.name;
        const localName = specifier.local?.name || importedName;

        // Step 1: Consider all imports as potential components initially
        // We'll confirm them later by checking for JSX usage
        importedComponents[localName] = importedName;

        // Step 2: Prioritize components with PascalCase names
        // (following React component naming convention)
        if (importedName.charAt(0) === importedName.charAt(0).toUpperCase()) {
          potentialComponents.add(localName);
        }

        // Note: We'll confirm all components by actual JSX usage,
        // regardless of naming convention
      }
    });
  });

  // Find all JSX elements that use the imported components
  // Confirmed components that are actually used in JSX
  const confirmedComponents: Set<string> = new Set();

  Object.entries(importedComponents).forEach(([localName, originalName]) => {
    // Find all JSX opening elements with the local component name
    const jsxUsages = root.find(j.JSXOpeningElement, {
      name: { name: localName },
    });

    // If this potential component is actually used in JSX, then it's confirmed as a component
    if (jsxUsages.size() > 0) {
      confirmedComponents.add(originalName);
      // Initialize the set to collect props for this confirmed component
      componentUsage[originalName] = new Set<string>();

      // Collect all attributes used with this component
      jsxUsages.forEach((path) => {
        const attributes = path.node.attributes || [];

        // Collect attribute names for this component
        attributes.forEach((attr) => {
          if (
            attr.type === "JSXAttribute" &&
            attr.name &&
            attr.name.type === "JSXIdentifier"
          ) {
            componentUsage[originalName]?.add(attr.name.name);
          }
        });
      });
    }
  });

  // Generate the output as JSON
  const outputJson: Record<string, string[]> = {};
  Object.entries(componentUsage).forEach(([componentName, props]) => {
    outputJson[componentName] = Array.from(props);
  });

  // Write the output to a file
  if (Object.keys(outputJson).length > 0 && outputPath !== null) {
    try {
      let finalResults = outputJson;

      // Check if the file already exists and read its content
      if (existsSync(outputPath)) {
        try {
          const existingContent = readFileSync(outputPath, "utf8");
          const existingResults = JSON.parse(existingContent);

          // Merge existing results with new results
          finalResults = mergeAnalysisResults(existingResults, outputJson);
          // console.log(
          //   `Merged new analysis with existing data in ${outputPath}`
          // );
        } catch (readError) {
          // console.warn(
          //   `Could not read or parse existing file: ${readError}. Creating a new file.`
          // );
        }
      }

      // Write the combined results
      writeFileSync(outputPath, JSON.stringify(finalResults, null, 2));
    } catch (error) {
      console.error(`Error writing analysis to file: ${error}`);
    }
  } else if (Object.keys(outputJson).length === 0) {
    // console.log(
    //   "No component usage found from the source package in: " + runtime.filePath
    // );
  }

  return {
    source: root.toSource(),
    analysisResults: outputJson,
  };
}
