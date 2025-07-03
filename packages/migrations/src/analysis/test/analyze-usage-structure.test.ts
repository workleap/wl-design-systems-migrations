import { describe, expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze, mergeAnalysisResults } from "../analyze.ts";

describe("analyze - usage structure", () => {
  test("component usage has new structure with total and projects", () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null, { project: "test-project" });

    // Check component usage structure
    expect(analysisResults.components.Div!.usage).toEqual({
      total: 1,
      projects: {
        "test-project": 1
      }
    });

    // Check that properties values still use project tracking
    expect(analysisResults.components.Div!.props.border?.values["1px"]?.usage).toEqual({
      total: 1,
      projects: {
        "test-project": 1
      }
    });
  });

  test("component usage without project parameter only has total", () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check component usage structure
    expect(analysisResults.components.Div!.usage).toEqual({
      total: 1
    });

    // Check that properties values also don't have projects
    expect(analysisResults.components.Div!.props.border?.values["1px"]?.usage).toEqual({
      total: 1
    });
  });

  test("multiple projects accumulate correctly in component usage", () => {
    const INPUT1 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";
    const INPUT2 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <><Div border=\"1px\" /><Div border=\"2px\" /></>; }";

    const result1 = analyze(getRuntime(INPUT1), null, { project: "projectA" });
    const result2 = analyze(getRuntime(INPUT2), null, { project: "projectB" });

    // Merge the results
    const merged = mergeAnalysisResults(result1.analysisResults, result2.analysisResults);

    // Check merged component usage structure
    expect(merged.components.Div!.usage).toEqual({
      total: 3, // 1 from projectA + 2 from projectB
      projects: {
        projectA: 1,
        projectB: 2
      }
    });

    // Check that border property values are correctly tracked by project
    expect(merged.components.Div!.props.border?.values["1px"]?.usage).toEqual({
      total: 2, // Once from each project
      projects: {
        projectA: 1,
        projectB: 1
      }
    });

    expect(merged.components.Div!.props.border?.values["2px"]?.usage).toEqual({
      total: 1, // Only from projectB
      projects: {
        projectB: 1
      }
    });
  });
});
