import { existsSync, readFileSync, writeFileSync } from "fs";
import type { Options } from "jscodeshift";
import { setReplacer, setReviver } from "../utils/serialization.js";
import type { Runtime } from "../utils/types.js";

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
  propName: string
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
    "dangerouslySetInnerHTML"
  ];

  return knownIgnoredProps.includes(propName);
}

/**
 * Maps property names to their usage data including count and actual values used
 * Properties are sorted by usage count (most used first)
 */
export interface PropertyUsage {
  [propName: string]: {
    usage: number;
    values: {
      [value: string]: {
        total: number;
        [project: string]: number;
      };
    };
  };
}

/**
 * Analysis results for a single component
 * Components are sorted by usage count (most used first)
 */
export interface ComponentAnalysisData {
  usage: number;
  props: PropertyUsage;
}

/**
 * Complete analysis results containing all components and their usage data
 */
export interface AnalysisResults {
  overall: {
    usage: {
      components: number;
      props: number;
    };
  };
  components: Record<string, ComponentAnalysisData>;
}

/**
 * Helper function to merge project values
 */
function mergeProjectValues(
  target: { [value: string]: { total: number; [project: string]: number } },
  source: { [value: string]: { total: number; [project: string]: number } }
): void {
  Object.entries(source).forEach(([value, counts]) => {
    if (target[value]) {
      // Merge counts
      target[value].total += counts.total;
      Object.entries(counts).forEach(([project, count]) => {
        if (project !== "total" && target[value]) {
          target[value][project] = (target[value][project] || 0) + count;
        }
      });
    } else {
      // Copy the value with all its project counts
      target[value] = { ...counts };
    }
  });
}

/**
 * Merges two analysis results together, combining usage counts and values
 */
export function mergeAnalysisResults(
  existingResults: AnalysisResults,
  newResults: AnalysisResults
): AnalysisResults {
  // Create a deep copy of existing results as the base
  const combinedData: Record<string, ComponentAnalysisData> =
    Object.fromEntries(
      Object.entries(existingResults.components).map(
        ([componentName, componentData]) => {
          const propsCopy: PropertyUsage = {};
          Object.entries(componentData.props).forEach(
            ([propName, propData]) => {
              propsCopy[propName] = {
                usage: propData.usage,
                values: JSON.parse(JSON.stringify(propData.values)) // Deep copy values
              };
            }
          );

          return [
            componentName,
            {
              usage: componentData.usage,
              props: propsCopy
            }
          ];
        }
      )
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
            existingProp.usage += propData.usage;

            // Merge values with project counts
            mergeProjectValues(existingProp.values, propData.values);
          } else {
            // Copy the property data with deep copy of values
            combinedComponentData.props[propName] = {
              usage: propData.usage,
              values: JSON.parse(JSON.stringify(propData.values))
            };
          }
        });
      } else {
        // Create a deep copy for new component
        const propsCopy: PropertyUsage = {};
        Object.entries(componentData.props).forEach(([propName, propData]) => {
          propsCopy[propName] = {
            usage: propData.usage,
            values: JSON.parse(JSON.stringify(propData.values))
          };
        });

        combinedData[componentName] = {
          usage: componentData.usage,
          props: propsCopy
        };
      }
    }
  );

  // Calculate combined totals
  const totalComponentUsage = Object.values(combinedData).reduce(
    (sum, comp) => sum + comp.usage,
    0
  );
  const totalPropUsage = Object.values(combinedData).reduce(
    (sum, comp) =>
      sum +
      Object.values(comp.props).reduce(
        (propSum, prop) => propSum + prop.usage,
        0
      ),
    0
  );

  return {
    overall: {
      usage: {
        components: totalComponentUsage,
        props: totalPropUsage
      }
    },
    components: combinedData
  };
}

/**
 * Analyzes a file to find all component usages from the specified source package
 * and collects all properties used for each component.
 *
 * @param runtime - The runtime context containing jscodeshift and AST
 * @param outputPath - The path to save the analysis output, or null to skip file output
 * @param options - Optional jscodeshift options including project parameter
 * @returns The original source code and the analysis results
 */
export function analyze(
  runtime: Runtime,
  outputPath: string | null,
  options?: Options & {
    sourcePackage?: string;
    "filter-unmapped"?: "components" | "props";
    "include-ignoreList"?: boolean;
    project?: string;
  }
): { source: string | undefined; analysisResults: AnalysisResults } {
  const { j, root, mappings } = runtime;
  const sourcePackage = options?.sourcePackage || mappings.sourcePackage;
  const filterUnmapped = options?.["filter-unmapped"];
  const includeIgnoredList = options?.["include-ignoreList"] || false;
  const project = options?.project;

  // Store component usage with counts
  const componentUsageData: Record<
    string,
    {
      count: number;
      props: Record<
        string,
        {
          usage: number;
          values: {
            [value: string]: { total: number; [project: string]: number };
          };
        }
      >;
    }
  > = {};

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
          const localName = spec.local?.name;
          if (localName) {
            importedComponents[localName] = localName;
            potentialComponents.add(localName);
          }
        } else if (spec.type === "ImportSpecifier") {
          const importedName = spec.imported.name;
          const localName = spec.local?.name || importedName;
          importedComponents[localName] = importedName;
          potentialComponents.add(localName);
        }
      });
    }
  });

  // Find all JSX elements and track component usage
  root.find(j.JSXElement).forEach(path => {
    const elementName = path.value.openingElement.name;
    if (elementName.type === "JSXIdentifier") {
      const componentName = elementName.name;
      const originalComponentName = importedComponents[componentName]; // Only process components that were imported from our source package
      if (originalComponentName && potentialComponents.has(componentName)) {
        // Initialize component data if not exists
        if (!componentUsageData[originalComponentName]) {
          componentUsageData[originalComponentName] = {
            count: 0,
            props: {}
          };
        }

        const componentData = componentUsageData[originalComponentName];

        // Increment component usage count
        componentData.count++;

        // Process props
        const attributes = path.value.openingElement.attributes || [];
        attributes.forEach(attr => {
          if (
            attr.type === "JSXAttribute" &&
            attr.name.type === "JSXIdentifier"
          ) {
            const propName = attr.name.name;

            // Skip ignored properties if not including ignore list
            if (
              !includeIgnoredList &&
              shouldIgnoreProperty(propName)
            ) {
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
            let propValue = "true"; // Default for boolean props
            if (attr.value) {
              if (attr.value.type === "Literal") {
                propValue = String(attr.value.value);
              } else if (attr.value.type === "JSXExpressionContainer") {
                const expression = attr.value.expression;
                if (expression.type === "Literal") {
                  propValue = String(expression.value);
                } else if (expression.type === "Identifier") {
                  propValue = `{${expression.name}}`;
                } else if (expression.type === "MemberExpression") {
                  // Handle member expressions like obj.prop
                  propValue = `{${j(expression).toSource()}}`;
                } else if (
                  expression.type === "ArrowFunctionExpression" ||
                  expression.type === "FunctionExpression"
                ) {
                  // For function expressions, capture the source code
                  propValue = j(expression).toSource();
                } else if (expression.type === "TemplateLiteral") {
                  // For template literals, capture the source code
                  propValue = j(expression).toSource();
                } else if (
                  expression.type === "ObjectExpression" ||
                  expression.type === "ArrayExpression"
                ) {
                  // For object and array expressions, capture the source code
                  propValue = j(expression).toSource();
                } else {
                  // For other complex expressions, use a generic placeholder
                  propValue = `{${expression.type}}`;
                }
              }
            }

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
                valueData[project] = (valueData[project] || 0) + 1;
              }
            }
          }
        });
      }
    }
  });

  // Convert to analysis results format and apply filtering
  const components: Record<string, ComponentAnalysisData> = {};

  Object.entries(componentUsageData).forEach(([componentName, data]) => {
    // Filter components if requested
    if (
      filterUnmapped === "components" &&
      isComponentMapped(componentName, mappings)
    ) {
      return;
    }

    const props: PropertyUsage = {};

    // Sort properties by usage count (descending) and convert to final format
    const sortedProps = Object.entries(data.props).sort(
      ([, a], [, b]) => b.usage - a.usage
    );

    sortedProps.forEach(([propName, propData]) => {
      // Filter props if requested
      if (
        filterUnmapped === "props" &&
        isPropertyMapped(componentName, propName, mappings)
      ) {
        return;
      }

      // Sort values by total count (descending)
      const sortedValues = Object.entries(propData.values).sort(
        ([, a], [, b]) => b.total - a.total
      );

      const sortedValuesObj: {
        [value: string]: { total: number; [project: string]: number };
      } = {};
      sortedValues.forEach(([value, counts]) => {
        sortedValuesObj[value] = counts;
      });

      props[propName] = {
        usage: propData.usage,
        values: sortedValuesObj
      };
    });

    components[componentName] = {
      usage: data.count,
      props
    };
  });

  // Sort components by usage count (descending)
  const sortedComponents = Object.entries(components).sort(
    ([, a], [, b]) => b.usage - a.usage
  );

  const sortedComponentsObj: Record<string, ComponentAnalysisData> = {};
  sortedComponents.forEach(([name, data]) => {
    sortedComponentsObj[name] = data;
  });

  // Calculate totals
  const totalComponentUsage = Object.values(components).reduce(
    (sum, comp) => sum + comp.usage,
    0
  );
  const totalPropUsage = Object.values(components).reduce(
    (sum, comp) =>
      sum +
      Object.values(comp.props).reduce(
        (propSum, prop) => propSum + prop.usage,
        0
      ),
    0
  );

  const analysisResults: AnalysisResults = {
    overall: {
      usage: {
        components: totalComponentUsage,
        props: totalPropUsage
      }
    },
    components: sortedComponentsObj
  };

  // Save or merge results if output path is provided
  if (outputPath) {
    let finalResults = analysisResults;

    // If file exists, merge with existing results
    if (existsSync(outputPath)) {
      try {
        const existingContent = readFileSync(outputPath, "utf-8");
        const existingResults: AnalysisResults = JSON.parse(
          existingContent,
          setReviver
        );
        finalResults = mergeAnalysisResults(existingResults, analysisResults);
      } catch {
        console.warn(
          `Warning: Could not parse existing analysis file at ${outputPath}. Creating new file.`
        );
      }
    }

    // Write merged results to file
    writeFileSync(
      outputPath,
      JSON.stringify(finalResults, setReplacer, 2),
      "utf-8"
    );

    // Return the merged results when output path is provided
    return {
      source: root.toSource(),
      analysisResults: finalResults
    };
  }

  return {
    source: root.toSource(),
    analysisResults
  };
}
