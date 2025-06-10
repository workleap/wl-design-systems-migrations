import type { Runtime } from "../../utils/types.js";
import type { AnalysisResults, ComponentAnalysisData, ComponentUsageData, PropertyUsage } from "../types.js";
import { isComponentMapped, isPropertyMapped } from "./mapping-utils.js";

/**
 * Converts internal component usage data to final analysis results format
 */
export function convertToAnalysisResults(
  componentUsageData: Record<string, ComponentUsageData>,
  mappings: Runtime["mappings"],
  filterUnmapped?: "components" | "props"
): AnalysisResults {
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
        [value: string]: { total: number; projects?: { [project: string]: number }; files?: string[] };
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

  return {
    overall: {
      usage: {
        components: totalComponentUsage,
        props: totalPropUsage
      }
    },
    components: sortedComponentsObj
  };
}
