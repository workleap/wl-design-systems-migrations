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
    usage: {
      total: number;
      projects?: {
        [project: string]: number;
      };
    };
    files?: string[];
  };
}

/**
 * Analysis results for a single component
 * Components are sorted by usage count (most used first)
 */
export interface ComponentAnalysisData {
  usage: {
    total: number;
    projects?: {
      [project: string]: number;
    };
  };
  props: PropertyUsage;
}

/**
 * Analysis results for a single function
 * Functions are sorted by usage count (most used first)
 */
export interface FunctionAnalysisData {
  usage: {
    total: number;
    projects?: {
      [project: string]: number;
    };
  };
  values: Values;
}

/**
 * Analysis results for a single type
 * Types are sorted by usage count (most used first)
 */
export interface TypeAnalysisData {
  usage: {
    total: number;
    projects?: {
      [project: string]: number;
    };
  };
  files?: string[];
}

/**
 * Complete analysis results containing all components and their usage data
 */
export interface AnalysisResults {
  overall: {
    usage: {
      components: number;
      componentProps: number;
      functions: number;
      types: number;
    };
  };
  components: Record<string, ComponentAnalysisData>;
  functions: Record<string, FunctionAnalysisData>;
  types: Record<string, TypeAnalysisData>;
}

/**
 * Internal data structure used during analysis before converting to final format
 */
export interface ComponentUsageData {
  count: {
    total: number;
    projects?: {
      [project: string]: number;
    };
  };
  props: Record<
    string,
    {
      usage: number;
      values: {
        [value: string]: {
          usage: {
            total: number;
            projects?: { [project: string]: number };
          };
          files?: string[];
        };
      };
    }
  >;
}

/**
 * Internal data structure for function usage during analysis
 */
export interface FunctionUsageData {
  count: {
    total: number;
    projects?: {
      [project: string]: number;
    };
  };
  values: {
    [callSignature: string]: {
      usage: {
        total: number;
        projects?: {
          [project: string]: number;
        };
      };
      files?: string[];
    };
  };
}

/**
 * Internal data structure for type usage during analysis
 */
export interface TypeUsageData {
  count: {
    total: number;
    projects?: {
      [project: string]: number;
    };
  };
  files?: string[];
}
