// filepath: /Users/mahmoud.moravej/workleap/orbiter-to-hopper-codemods/src/utils/analyze.ts
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Options } from "jscodeshift";
import { setReplacer, setReviver } from "../utils/serialization.js";
import { ComponentMapMetaData, Runtime } from "../utils/types.js";

/**
 * Checks if a component has a mapping in the mappings configuration
 */
function isComponentMapped(
  componentName: string,
  mappings: Runtime["mappings"]
): boolean {
  return componentName in mappings.components;
}

/**
 * Checks if a property has a mapping for a given component
 */
function isPropertyMapped(
  componentName: string,
  propName: string,
  mappings: Runtime["mappings"]
): boolean {
  const componentMapping = mappings.components[componentName];

  // If component doesn't exist in mappings, property is not mapped
  if (!componentMapping) {
    return false;
  }

  // Check if it's a string mapping (simple component mapping)
  if (typeof componentMapping === "string") {
    // Check in default props mappings
    return propName in (mappings.propsDefaults?.mappings || {});
  }

  // Check component-specific prop mappings
  if (
    componentMapping.props?.mappings &&
    propName in componentMapping.props.mappings
  ) {
    return true;
  }

  // Check in default props mappings
  return propName in (mappings.propsDefaults?.mappings || {});
}

/**
 * Checks if a property should be ignored during analysis
 * This includes aria-* attributes, data-* attributes, and known ignored props
 */
function shouldIgnoreProperty(
  propName: string,
  mappings: Runtime["mappings"]
): boolean {
  // Check for aria-* attributes
  if (propName.startsWith("aria-")) {
    return true;
  }

  // Check for data-* attributes
  if (propName.startsWith("data-")) {
    return true;
  }

  // List of known ignored props that should be filtered out during analysis
  // These are standard React/DOM props that don't need migration analysis
  const knownIgnoredProps = [
    "className",
    "style",
    "key",
    "ref",
    "slot",
    "id",
    "role",
    "dangerouslySetInnerHTML",
  ];

  return knownIgnoredProps.includes(propName);
}

// Define the new structure for analysis results
/**
 * Maps property names to their usage data including count and actual values used
 * Properties are sorted by usage count (most used first)
 */
export interface PropertyUsage {
  [propName: string]: { usage: number; values: Set<string> };
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
  overall: {
    usage: {
      components: number;
      props: number;
    };
  };
  components: {
    [componentName: string]: ComponentAnalysisResult;
  };
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
      props: Record<string, { usage: number; values: Set<string> }>;
    }
  > = {};

  // Process existing results
  Object.entries(existingResults.components).forEach(
    ([componentName, componentData]) => {
      combinedData[componentName] = {
        usage: componentData.usage,
        props: { ...componentData.props },
      };
    }
  );

  // Merge new results
  Object.entries(newResults.components).forEach(
    ([componentName, componentData]) => {
      const combinedComponentData = combinedData[componentName];
      if (combinedComponentData) {
        // Add component usage count
        combinedComponentData.usage += componentData.usage;

        // Merge property usage counts and values
        Object.entries(componentData.props).forEach(([propName, propData]) => {
          if (combinedComponentData.props[propName]) {
            // Update usage count
            const existingProp = combinedComponentData.props[propName];
            if (existingProp) {
              existingProp.usage += propData.usage;

              // Merge values sets
              propData.values.forEach((value) => {
                existingProp.values.add(value);
              });
            }
          } else {
            // Copy the property data with a new Set instance
            combinedComponentData.props[propName] = {
              usage: propData.usage,
              values: new Set([...propData.values]),
            };
          }
        });
      } else {
        // Create a deep copy with new Set instances for each property
        const propsCopy: Record<
          string,
          { usage: number; values: Set<string> }
        > = {};

        Object.entries(componentData.props).forEach(([propName, propData]) => {
          propsCopy[propName] = {
            usage: propData.usage,
            values: new Set([...propData.values]),
          };
        });

        combinedData[componentName] = {
          usage: componentData.usage,
          props: propsCopy,
        };
      }
    }
  );

  // Sort components by usage count
  const orderedComponents = new Map<string, ComponentAnalysisResult>();

  Object.entries(combinedData)
    .sort(([, dataA], [, dataB]) => dataB.usage - dataA.usage)
    .forEach(([componentName, data]) => {
      // Sort props by usage count
      const sortedProps: PropertyUsage = {};

      Object.entries(data.props)
        .sort(
          ([, propDataA], [, propDataB]) => propDataB.usage - propDataA.usage
        )
        .forEach(([propName, propData]) => {
          sortedProps[propName] = {
            usage: propData.usage,
            values: new Set([...propData.values]),
          };
        });

      orderedComponents.set(componentName, {
        usage: data.usage,
        props: sortedProps,
      });
    });

  // Convert to regular object to maintain API compatibility
  const components: { [componentName: string]: ComponentAnalysisResult } = {};
  orderedComponents.forEach((value, key) => {
    components[key] = value;
  });

  // Calculate overall statistics
  let totalComponentUsage = 0;
  let totalPropUsage = 0;

  Object.values(components).forEach((component) => {
    totalComponentUsage += component.usage;
    Object.values(component.props).forEach((prop) => {
      totalPropUsage += prop.usage;
    });
  });

  return {
    overall: {
      usage: {
        components: totalComponentUsage,
        props: totalPropUsage,
      },
    },
    components,
  };
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
  options?: Options & {
    sourcePackage?: string;
    "filter-unmapped"?: "components" | "props";
    "include-ignoreList"?: boolean;
  }
): { source: string | undefined; analysisResults: AnalysisResults } {
  const { j, root, mappings } = runtime;
  const sourcePackage = options?.sourcePackage || mappings.sourcePackage;
  const filterUnmapped = options?.["filter-unmapped"];
  const includeignoredList = options?.["include-ignoreList"] || false;

  // Store component usage with counts
  const componentUsageData: Record<
    string,
    {
      count: number;
      props: Record<string, { usage: number; values: Set<string> }>;
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
      // Apply component filtering if specified
      if (
        filterUnmapped === "components" &&
        isComponentMapped(originalName, mappings)
      ) {
        // Skip mapped components when filtering for unmapped components only
        return;
      }

      // Apply property filtering - only include mapped components for props mode
      if (
        filterUnmapped === "props" &&
        !isComponentMapped(originalName, mappings)
      ) {
        // Skip unmapped components when filtering for unmapped props only
        return;
      }

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

        // Collect attribute names for this component and their counts and values
        attributes.forEach((attr) => {
          if (
            attr.type === "JSXAttribute" &&
            attr.name &&
            attr.name.type === "JSXIdentifier"
          ) {
            const propName = attr.name.name;

            // Apply property filtering if specified (but only for non-ignored props)
            if (
              filterUnmapped === "props" &&
              !shouldIgnoreProperty(propName, mappings) &&
              isPropertyMapped(originalName, propName, mappings)
            ) {
              // Skip mapped properties when filtering for unmapped props only
              // But allow ignored properties through if include-ignoreList is true
              return;
            }

            // Skip ignored properties unless explicitly included
            if (
              !includeignoredList &&
              shouldIgnoreProperty(propName, mappings)
            ) {
              return;
            }

            // Initialize property data if not exists
            if (!componentUsage.props[propName]) {
              componentUsage.props[propName] = {
                usage: 0,
                values: new Set<string>(),
              };
            }

            // Increment usage count
            componentUsage.props[propName].usage++;

            // Extract and store value as string
            if (attr.value) {
              let valueStr = "";

              // Handle different types of JSX attribute values
              if (attr.value.type === "StringLiteral") {
                valueStr = attr.value.value;
              } else if (attr.value.type === "JSXExpressionContainer") {
                // Convert the expression to string by getting its source code
                valueStr = j(attr.value.expression).toSource();
              } else {
                // For other types, convert to string representation
                valueStr = j(attr.value).toSource();
              }

              // Add to values Set
              if (valueStr) {
                componentUsage.props[propName].values.add(valueStr);
              }
            }
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
      .sort(([, propDataA], [, propDataB]) => propDataB.usage - propDataA.usage)
      .forEach(([propName, propData]) => {
        sortedProps[propName] = {
          usage: propData.usage,
          values: new Set([...propData.values]),
        };
      });

    // When filtering for unmapped props only, exclude components that have no unmapped props
    if (filterUnmapped === "props" && Object.keys(sortedProps).length === 0) {
      // Skip this component entirely if it has no unmapped props
      return;
    }

    orderedComponents.set(componentName, {
      usage: data.count,
      props: sortedProps,
    });
  });

  // Convert to regular object for API compatibility, but now the insertion order matches the usage order
  const components: { [componentName: string]: ComponentAnalysisResult } = {};
  orderedComponents.forEach((value, key) => {
    components[key] = value;
  });

  // Calculate overall statistics
  let totalComponentUsage = 0;
  let totalPropUsage = 0;

  Object.values(components).forEach((component) => {
    totalComponentUsage += component.usage;
    Object.values(component.props).forEach((prop) => {
      totalPropUsage += prop.usage;
    });
  });

  const analysisResults: AnalysisResults = {
    overall: {
      usage: {
        components: totalComponentUsage,
        props: totalPropUsage,
      },
    },
    components,
  };

  // Write the output to a file
  if (
    Object.keys(analysisResults.components).length > 0 &&
    outputPath !== null
  ) {
    let finalResults = analysisResults;

    // Check if the file already exists and read its content
    if (existsSync(outputPath)) {
      try {
        const existingContent = readFileSync(outputPath, "utf8");

        // Parse existing results, reconstructing Sets from serialized format
        const existingResults = JSON.parse(
          existingContent,
          setReviver
        ) as AnalysisResults;

        // Merge existing results with new results
        finalResults = mergeAnalysisResults(existingResults, analysisResults);
      } catch (readError) {
        runtime.log(
          `Could not read or parse existing file: ${readError}. Creating a new file.`
        );
      }
    }

    try {
      // Write the combined results with custom serialization for Sets
      writeFileSync(outputPath, JSON.stringify(finalResults, setReplacer, 2));
    } catch (error) {
      runtime.log(`Error writing analysis to file: ${error}`);
    }
  } else if (Object.keys(analysisResults.components).length === 0) {
    //console.log(`No component usage found in: ` + runtime.filePath);
  }

  return {
    source: root.toSource(),
    analysisResults: analysisResults,
  };
}
