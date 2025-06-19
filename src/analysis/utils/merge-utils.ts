import type { AnalysisResults, ComponentAnalysisData, PropertyUsage } from "../types.js";

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
 * Applies sorting to analysis results based on usage counts
 */
function sortAnalysisResults(combinedData: Record<string, ComponentAnalysisData>): Record<string, ComponentAnalysisData> {
  const sortedCombinedData: Record<string, ComponentAnalysisData> = {};

  // Sort components by usage count (descending)
  const sortedComponents = Object.entries(combinedData).sort(
    ([, a], [, b]) => b.usage - a.usage
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
 * Calculates total usage statistics from analysis results
 */
function calculateTotals(components: Record<string, ComponentAnalysisData>): { components: number; props: number } {
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

  return {
    components: totalComponentUsage,
    props: totalPropUsage
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

  // Apply sorting to the merged results
  const sortedCombinedData = sortAnalysisResults(combinedData);

  // Calculate combined totals
  const totals = calculateTotals(sortedCombinedData);

  return {
    overall: {
      usage: totals
    },
    components: sortedCombinedData
  };
}
