import { existsSync, readFileSync, writeFileSync } from "fs";
import type { Options } from "jscodeshift";
import type { Runtime } from "../utils/types.ts";
import type { AnalysisResults } from "./types.ts";
import { performFunctionAnalysis } from "./utils/function-analyzer.ts";
import { customStringify } from "./utils/json-utils.ts";
import { performJSXAnalysis } from "./utils/jsx-analyzer.ts";
import { mergeAnalysisResults } from "./utils/merge-utils.ts";
import { convertToAnalysisResults } from "./utils/results-converter.ts";
import { performTypeAnalysis } from "./utils/type-analyzer.ts";

// Re-export types and utilities for backward compatibility
export type { AnalysisResults, ComponentAnalysisData, FunctionAnalysisData, PropertyUsage, TypeAnalysisData } from "./types.ts";
export { customStringify, getSortedKeys } from "./utils/json-utils.ts";
export { mergeAnalysisResults } from "./utils/merge-utils.ts";

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
    deep?: boolean;
  }
): { analysisResults: AnalysisResults } {
  const { mappings } = runtime;
  const sourcePackage = options?.sourcePackage || mappings.sourcePackage;
  const filterUnmapped = options?.["filter-unmapped"];
  const includeIgnoredList = options?.["include-ignoreList"] || false;
  const project = options?.project;
  const deep = options?.deep || false;

  // Perform JSX analysis to extract component usage data
  const componentUsageData = performJSXAnalysis(runtime, sourcePackage, {
    includeIgnoredList,
    project,
    deep
  });

  // Perform function analysis to extract function usage data
  const functionUsageData = performFunctionAnalysis(runtime, sourcePackage, {
    includeIgnoredList,
    project,
    deep
  });

  // Perform type analysis to extract type usage data
  const typeUsageData = performTypeAnalysis(runtime, sourcePackage, {
    includeIgnoredList,
    project,
    deep
  });

  // Convert to analysis results format and apply filtering
  const analysisResults = convertToAnalysisResults(
    componentUsageData,
    functionUsageData,
    typeUsageData,
    mappings,
    filterUnmapped
  );

  // Save or merge results if output path is provided
  if (outputPath) {
    let finalResults = analysisResults;

    // If file exists, merge with existing results
    if (existsSync(outputPath)) {
      try {
        const existingContent = readFileSync(outputPath, "utf-8");
        const existingResults: AnalysisResults = JSON.parse(existingContent);
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
      customStringify(finalResults),
      "utf-8"
    );

    // Return the merged results when output path is provided
    return {
      
      analysisResults: finalResults
    };
  }

  return {
    
    analysisResults
  };
}
