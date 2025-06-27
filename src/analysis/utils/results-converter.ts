import type { Runtime } from "../../utils/types.js";
import type { AnalysisResults, ComponentAnalysisData, ComponentUsageData, FunctionAnalysisData, FunctionUsageData, TypeAnalysisData, TypeUsageData, PropertyUsage } from "../types.js";
import { isComponentMapped, isPropertyMapped } from "./mapping-utils.js";

/**
 * Converts internal component usage data to final analysis results format
 */
export function convertToAnalysisResults(
  componentUsageData: Record<string, ComponentUsageData>,
  functionUsageData: Record<string, FunctionUsageData>,
  typeUsageData: Record<string, TypeUsageData>,
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
        ([, a], [, b]) => b.usage.total - a.usage.total
      );

      const sortedValuesObj: {
        [value: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] };
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
    ([, a], [, b]) => b.usage.total - a.usage.total
  );

  const sortedComponentsObj: Record<string, ComponentAnalysisData> = {};
  sortedComponents.forEach(([name, data]) => {
    sortedComponentsObj[name] = data;
  });

  // Calculate totals
  const totalComponentUsage = Object.values(components).reduce(
    (sum, comp) => sum + comp.usage.total,
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

  // Process functions
  const functions: Record<string, FunctionAnalysisData> = {};

  Object.entries(functionUsageData).forEach(([functionName, data]) => {
    // Sort values by total count (descending)
    const sortedValues = Object.entries(data.values).sort(
      ([, a], [, b]) => b.usage.total - a.usage.total
    );

    const sortedValuesObj: {
      [callSignature: string]: { usage: { total: number; projects?: { [project: string]: number } }; files?: string[] };
    } = {};
    sortedValues.forEach(([callSignature, counts]) => {
      sortedValuesObj[callSignature] = counts;
    });

    functions[functionName] = {
      usage: data.count,
      values: sortedValuesObj
    };
  });

  // Sort functions by usage count (descending)
  const sortedFunctions = Object.entries(functions).sort(
    ([, a], [, b]) => b.usage.total - a.usage.total
  );

  const sortedFunctionsObj: Record<string, FunctionAnalysisData> = {};
  sortedFunctions.forEach(([name, data]) => {
    sortedFunctionsObj[name] = data;
  });

  // Calculate function totals
  const totalFunctionUsage = Object.values(functions).reduce(
    (sum, func) => sum + func.usage.total,
    0
  );

  // Process types
  const types: Record<string, TypeAnalysisData> = {};

  Object.entries(typeUsageData).forEach(([typeName, data]) => {
    types[typeName] = {
      usage: data.count,
      files: data.files
    };
  });

  // Sort types by usage count (descending)
  const sortedTypes = Object.entries(types).sort(
    ([, a], [, b]) => b.usage.total - a.usage.total
  );

  const sortedTypesObj: Record<string, TypeAnalysisData> = {};
  sortedTypes.forEach(([name, data]) => {
    sortedTypesObj[name] = data;
  });

  // Calculate type totals
  const totalTypeUsage = Object.values(types).reduce(
    (sum, type) => sum + type.usage.total,
    0
  );

  return {
    overall: {
      usage: {
        components: totalComponentUsage,
        componentProps: totalPropUsage,
        functions: totalFunctionUsage,
        types: totalTypeUsage
      }
    },
    components: sortedComponentsObj,
    functions: sortedFunctionsObj,
    types: sortedTypesObj
  };
}
