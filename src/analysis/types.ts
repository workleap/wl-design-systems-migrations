/**
 * Maps property names to their usage data including count and actual values used
 * Properties are sorted by usage count (most used first)
 */
export interface PropertyUsage {
  [propName: string]: {
    usage: number;
    values: Values;
  };
}

export interface Values {
  [value: string]: {
    total: number;
    projects?: {
      [project: string]: number;
    };
    files?: string[];
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
 * Internal data structure used during analysis before converting to final format
 */
export interface ComponentUsageData {
  count: number;
  props: Record<
    string,
    {
      usage: number;
      values: {
        [value: string]: { total: number; projects?: { [project: string]: number }; files?: string[] };
      };
    }
  >;
}
