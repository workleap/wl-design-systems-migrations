import { existsSync, readFileSync, writeFileSync } from "fs";
import type { Options } from "jscodeshift";
import type { Runtime } from "../utils/types.js";
import type { AnalysisResults } from "./types.js";
import { customStringify } from "./utils/json-utils.js";
import { performJSXAnalysis } from "./utils/jsx-analyzer.js";
import { mergeAnalysisResults } from "./utils/merge-utils.js";
import { convertToAnalysisResults } from "./utils/results-converter.js";

// Re-export types and utilities for backward compatibility
export type { AnalysisResults, ComponentAnalysisData, PropertyUsage } from "./types.js";
export { customStringify, getSortedKeys } from "./utils/json-utils.js";
export { mergeAnalysisResults } from "./utils/merge-utils.js";

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
): { source: string | undefined; analysisResults: AnalysisResults } {
  const { root, mappings } = runtime;
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

  // Convert to analysis results format and apply filtering
  const analysisResults = convertToAnalysisResults(
    componentUsageData,
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
      source: root.toSource(),
      analysisResults: finalResults
    };
  }

  return {
    source: root.toSource(),
    analysisResults
  };
}
