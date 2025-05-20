// filepath: /Users/mahmoud.moravej/workleap/orbiter-to-hopper-codemods/src/utils/analyze.ts
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Options } from "jscodeshift";
import { Runtime } from "./types.js";

// Define the new structure for analysis results
/**
 * Maps property names to their usage count
 * Properties are sorted by usage count (most used first)
 */
export interface PropertyUsage {
  [propName: string]: number;
}

/**
 * Represents the analysis result for a single component
 */
export interface ComponentAnalysisResult {
  usage: number;
  props: PropertyUsage;
}

/**
 * Maps component names to their analysis results
 * In modern JavaScript engines, the insertion order is preserved,
 * so components will be ordered by usage count (most used first)
 */
export interface AnalysisResults {
  [componentName: string]: ComponentAnalysisResult;
}

/**
 * Merges two analysis result objects by combining their component and property usage counts
 *
 * @param existingResults - The existing analysis results
 * @param newResults - The new analysis results to merge
 * @returns The merged analysis results
 */
export function mergeAnalysisResults(
  existingResults: AnalysisResults,
  newResults: AnalysisResults
): AnalysisResults {
  // Create a combined data structure to hold all components and their data
  const combinedData: Record<
    string,
    {
      usage: number;
      props: Record<string, number>;
    }
  > = {};

  // Process existing results
  Object.entries(existingResults).forEach(([componentName, componentData]) => {
    combinedData[componentName] = {
      usage: componentData.usage,
      props: { ...componentData.props },
    };
  });

  // Merge new results
  Object.entries(newResults).forEach(([componentName, componentData]) => {
    const combinedComponentData = combinedData[componentName];
    if (combinedComponentData) {
      // Add component usage count
      combinedComponentData.usage += componentData.usage;

      // Merge property usage counts
      Object.entries(componentData.props).forEach(([propName, propCount]) => {
        if (combinedComponentData.props[propName]) {
          combinedComponentData.props[propName] += propCount;
        } else {
          combinedComponentData.props[propName] = propCount;
        }
      });
    } else {
      combinedData[componentName] = {
        usage: componentData.usage,
        props: { ...componentData.props },
      };
    }
  });

  // Sort components by usage count
  const orderedComponents = new Map<string, ComponentAnalysisResult>();

  Object.entries(combinedData)
    .sort(([, dataA], [, dataB]) => dataB.usage - dataA.usage)
    .forEach(([componentName, data]) => {
      // Sort props by usage count
      const sortedProps: PropertyUsage = {};

      Object.entries(data.props)
        .sort(([, countA], [, countB]) => countB - countA)
        .forEach(([propName, count]) => {
          sortedProps[propName] = count;
        });

      orderedComponents.set(componentName, {
        usage: data.usage,
        props: sortedProps,
      });
    });

  // Convert to regular object to maintain API compatibility
  const merged: AnalysisResults = {};
  orderedComponents.forEach((value, key) => {
    merged[key] = value;
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
): { source: string | undefined; analysisResults: AnalysisResults } {
  const { j, root, mappings } = runtime;
  const sourcePackage = options?.sourcePackage || mappings.sourcePackage;

  // Store component usage with counts
  const componentUsageData: Record<
    string,
    {
      count: number;
      props: Record<string, number>;
    }
  > = {};

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

      // Initialize component usage data with count
      if (!componentUsageData[originalName]) {
        componentUsageData[originalName] = {
          count: 0,
          props: {},
        };
      }

      const componentUsage = componentUsageData[originalName];
      // Increment component usage count
      componentUsage.count += jsxUsages.size();

      // Collect all attributes used with this component
      jsxUsages.forEach((path) => {
        const attributes = path.node.attributes || [];

        // Collect attribute names for this component and their counts
        attributes.forEach((attr) => {
          if (
            attr.type === "JSXAttribute" &&
            attr.name &&
            attr.name.type === "JSXIdentifier"
          ) {
            const propName = attr.name.name;
            if (!componentUsage.props[propName]) {
              componentUsage.props[propName] = 0;
            }
            componentUsage.props[propName]++;
          }
        });
      });
    }
  });

  // Generate the output as an OrderedAnalysisResults
  // We're using a Map to ensure component order is preserved by usage count
  const orderedComponents = new Map<string, ComponentAnalysisResult>();

  // Sort components by usage count (descending)
  const sortedComponents = Object.entries(componentUsageData).sort(
    ([, dataA], [, dataB]) => dataB.count - dataA.count
  );

  // Build the ordered components map
  sortedComponents.forEach(([componentName, data]) => {
    // Sort props by usage count (descending)
    const sortedProps: PropertyUsage = {};

    Object.entries(data.props)
      .sort(([, countA], [, countB]) => countB - countA)
      .forEach(([propName, count]) => {
        sortedProps[propName] = count;
      });

    orderedComponents.set(componentName, {
      usage: data.count,
      props: sortedProps,
    });
  });

  // Convert to regular object for API compatibility, but now the insertion order matches the usage order
  const analysisResults: AnalysisResults = {};
  orderedComponents.forEach((value, key) => {
    analysisResults[key] = value;
  });

  // Write the output to a file
  if (Object.keys(analysisResults).length > 0 && outputPath !== null) {
    try {
      let finalResults = analysisResults;

      // Check if the file already exists and read its content
      if (existsSync(outputPath)) {
        try {
          const existingContent = readFileSync(outputPath, "utf8");
          const existingResults = JSON.parse(
            existingContent
          ) as AnalysisResults;

          // Merge existing results with new results
          finalResults = mergeAnalysisResults(existingResults, analysisResults);
        } catch (readError) {
          console.warn(
            `Could not read or parse existing file: ${readError}. Creating a new file.`
          );
        }
      }

      // Write the combined results
      writeFileSync(outputPath, JSON.stringify(finalResults, null, 2));
    } catch (error) {
      console.error(`Error writing analysis to file: ${error}`);
    }
  } else if (Object.keys(analysisResults).length === 0) {
    // console.log(`No component usage found in: ` + runtime.filePath);
  }

  return {
    source: root.toSource(),
    analysisResults: analysisResults,
  };
}
