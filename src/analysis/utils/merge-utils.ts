import type { AnalysisResults, ComponentAnalysisData, FunctionAnalysisData, PropertyUsage, TypeAnalysisData } from "../types.js";

/**
 * Helper function to deep clone property values (just the count objects)
 */
function clonePropertyValues(values: {
  [value: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] };
}): { [value: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] } } {
  const cloned: { [value: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] } } = {};
  
  Object.entries(values).forEach(([value, counts]) => {
    cloned[value] = { 
      usage: {
        total: counts.usage.total,
        ...counts.usage.projects && { projects: { ...counts.usage.projects } }
      },
      ...counts.files && { files: [...counts.files] }
    };
  });
  
  return cloned;
}

/**
 * Helper function to merge project values
 */
function mergeProjectValues(
  target: { [value: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] } },
  source: { [value: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] } }
): void {
  Object.entries(source).forEach(([value, counts]) => {
    if (target[value]) {
      // Merge counts
      target[value].usage.total += counts.usage.total;
      if (counts.usage.projects) {
        if (!target[value].usage.projects) {
          target[value].usage.projects = {};
        }
        const targetProjects = target[value].usage.projects!;
        Object.entries(counts.usage.projects).forEach(([project, count]) => {
          targetProjects[project] = (targetProjects[project] || 0) + count;
        });
      }
      if (counts.files) {
        if (!target[value].files) {
          target[value].files = [];
        }
        // Merge files using Set to avoid duplicates
        const fileSet = new Set([...target[value].files!, ...counts.files]);
        target[value].files = Array.from(fileSet);
      }
    } else {
      // Copy the value with all its project counts and files
      target[value] = { 
        usage: {
          total: counts.usage.total,
          ...counts.usage.projects && { projects: { ...counts.usage.projects } }
        },
        ...counts.files && { files: [...counts.files] }
      };
    }
  });
}

/**
 * Helper function to merge component usage counts
 */
function mergeComponentUsage(
  target: { total: number; projects?: { [project: string]: number } },
  source: { total: number; projects?: { [project: string]: number } }
): void {
  target.total += source.total;
  if (source.projects) {
    if (!target.projects) {
      target.projects = {};
    }
    Object.entries(source.projects).forEach(([project, count]) => {
      target.projects![project] = (target.projects![project] || 0) + count;
    });
  }
}

/**
 * Applies sorting to analysis results based on usage counts
 */
function sortAnalysisResults(combinedData: Record<string, ComponentAnalysisData>): Record<string, ComponentAnalysisData> {
  const sortedCombinedData: Record<string, ComponentAnalysisData> = {};

  // Sort components by usage count (descending)
  const sortedComponents = Object.entries(combinedData).sort(
    ([, a], [, b]) => b.usage.total - a.usage.total
  );

  sortedComponents.forEach(([componentName, componentData]) => {
    const sortedProps: PropertyUsage = {};

    // Sort properties by usage count (descending)
    const sortedPropsEntries = Object.entries(componentData.props).sort(
      ([, a], [, b]) => b.usage - a.usage
    );

    sortedPropsEntries.forEach(([propName, propData]) => {
      // Sort values by total count (descending)
      const sortedValues = Object.entries(propData.values).sort(
        ([, a], [, b]) => b.usage.total - a.usage.total
      );

      const sortedValuesObj: {
        [value: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] };
      } = {};
      sortedValues.forEach(([value, counts]) => {
        sortedValuesObj[value] = counts;
      });

      sortedProps[propName] = {
        usage: propData.usage,
        values: sortedValuesObj
      };
    });

    sortedCombinedData[componentName] = {
      usage: componentData.usage,
      props: sortedProps
    };
  });

  return sortedCombinedData;
}

/**
 * Applies sorting to type analysis results based on usage counts
 */
function sortTypeResults(combinedTypes: Record<string, TypeAnalysisData>): Record<string, TypeAnalysisData> {
  const sortedCombinedTypes: Record<string, TypeAnalysisData> = {};

  // Sort types by usage count (descending)
  const sortedTypes = Object.entries(combinedTypes).sort(
    ([, a], [, b]) => b.usage.total - a.usage.total
  );

  sortedTypes.forEach(([typeName, typeData]) => {
    sortedCombinedTypes[typeName] = typeData;
  });

  return sortedCombinedTypes;
}
/**
 * Applies sorting to function analysis results based on usage counts
 */
function sortFunctionResults(combinedFunctions: Record<string, FunctionAnalysisData>): Record<string, FunctionAnalysisData> {
  const sortedCombinedFunctions: Record<string, FunctionAnalysisData> = {};

  // Sort functions by usage count (descending)
  const sortedFunctions = Object.entries(combinedFunctions).sort(
    ([, a], [, b]) => b.usage.total - a.usage.total
  );

  sortedFunctions.forEach(([functionName, functionData]) => {
    // Sort function call values by total count (descending)
    const sortedValues = Object.entries(functionData.values).sort(
      ([, a], [, b]) => b.usage.total - a.usage.total
    );

    const sortedValuesObj: {
      [callSignature: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] };
    } = {};
    sortedValues.forEach(([callSignature, counts]) => {
      sortedValuesObj[callSignature] = counts;
    });

    sortedCombinedFunctions[functionName] = {
      usage: functionData.usage,
      values: sortedValuesObj
    };
  });

  return sortedCombinedFunctions;
}

/**
 * Calculates total usage statistics from analysis results
 */
function calculateTotals(
  components: Record<string, ComponentAnalysisData>,
  functions: Record<string, FunctionAnalysisData>,
  types: Record<string, TypeAnalysisData>
): { components: number; componentProps: number; functions: number; types: number } {
  const totalComponentUsage = Object.values(components).reduce(
    (sum, comp) => sum + comp.usage.total,
    0
  );
  const totalComponentPropUsage = Object.values(components).reduce(
    (sum, comp) =>
      sum +
      Object.values(comp.props).reduce(
        (propSum, prop) => propSum + prop.usage,
        0
      ),
    0
  );
  const totalFunctionUsage = Object.values(functions).reduce(
    (sum, func) => sum + func.usage.total,
    0
  );
  const totalTypeUsage = Object.values(types).reduce(
    (sum, type) => sum + type.usage.total,
    0
  );

  return {
    components: totalComponentUsage,
    componentProps: totalComponentPropUsage,
    functions: totalFunctionUsage,
    types: totalTypeUsage
  };
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
                values: clonePropertyValues(propData.values) // Deep clone count objects
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

  // Create a deep copy of existing functions as the base
  const combinedFunctions: Record<string, FunctionAnalysisData> =
    Object.fromEntries(
      Object.entries(existingResults.functions).map(
        ([functionName, functionData]) => {
          return [
            functionName,
            {
              usage: functionData.usage,
              values: clonePropertyValues(functionData.values) // Deep clone count objects
            }
          ];
        }
      )
    );

  // Create a deep copy of existing types as the base
  const combinedTypes: Record<string, TypeAnalysisData> =
    Object.fromEntries(
      Object.entries(existingResults.types).map(
        ([typeName, typeData]) => {
          return [
            typeName,
            {
              usage: { ...typeData.usage, ...typeData.usage.projects && { projects: { ...typeData.usage.projects } } },
              ...typeData.files && { files: [...typeData.files] }
            }
          ];
        }
      )
    );

  // Merge new component results
  Object.entries(newResults.components).forEach(
    ([componentName, componentData]) => {
      const combinedComponentData = combinedData[componentName];
      if (combinedComponentData) {
        // Merge component usage counts
        mergeComponentUsage(combinedComponentData.usage, componentData.usage);

        // Merge property usage counts and values
        Object.entries(componentData.props).forEach(([propName, propData]) => {
          if (combinedComponentData.props[propName]) {
            // Update usage count
            const existingProp = combinedComponentData.props[propName];
            existingProp.usage += propData.usage;

            // Merge values with project counts
            mergeProjectValues(existingProp.values, propData.values);
          } else {
            // Copy the property data with deep clone of count objects
            combinedComponentData.props[propName] = {
              usage: propData.usage,
              values: clonePropertyValues(propData.values)
            };
          }
        });
      } else {
        // Create a deep copy for new component
        const propsCopy: PropertyUsage = {};
        Object.entries(componentData.props).forEach(([propName, propData]) => {
          propsCopy[propName] = {
            usage: propData.usage,
            values: clonePropertyValues(propData.values)
          };
        });

        combinedData[componentName] = {
          usage: componentData.usage,
          props: propsCopy
        };
      }
    }
  );

  // Merge new function results
  Object.entries(newResults.functions).forEach(
    ([functionName, functionData]) => {
      const combinedFunctionData = combinedFunctions[functionName];
      if (combinedFunctionData) {
        // Merge function usage counts
        mergeComponentUsage(combinedFunctionData.usage, functionData.usage);

        // Merge function call values
        mergeProjectValues(combinedFunctionData.values, functionData.values);
      } else {
        // Create a deep copy for new function
        combinedFunctions[functionName] = {
          usage: functionData.usage,
          values: clonePropertyValues(functionData.values)
        };
      }
    }
  );

  // Merge new type results
  Object.entries(newResults.types).forEach(
    ([typeName, typeData]) => {
      const combinedTypeData = combinedTypes[typeName];
      if (combinedTypeData) {
        // Merge type usage counts
        mergeComponentUsage(combinedTypeData.usage, typeData.usage);

        // Merge files
        if (typeData.files) {
          if (!combinedTypeData.files) {
            combinedTypeData.files = [];
          }
          // Merge files using Set to avoid duplicates
          const fileSet = new Set([...combinedTypeData.files, ...typeData.files]);
          combinedTypeData.files = Array.from(fileSet);
        }
      } else {
        // Create a deep copy for new type
        combinedTypes[typeName] = {
          usage: { ...typeData.usage, ...typeData.usage.projects && { projects: { ...typeData.usage.projects } } },
          ...typeData.files && { files: [...typeData.files] }
        };
      }
    }
  );

  // Apply sorting to the merged results
  const sortedCombinedData = sortAnalysisResults(combinedData);
  const sortedCombinedFunctions = sortFunctionResults(combinedFunctions);
  const sortedCombinedTypes = sortTypeResults(combinedTypes);

  // Calculate combined totals
  const totals = calculateTotals(sortedCombinedData, sortedCombinedFunctions, sortedCombinedTypes);

  return {
    overall: {
      usage: totals
    },
    components: sortedCombinedData,
    functions: sortedCombinedFunctions,
    types: sortedCombinedTypes
  };
}
