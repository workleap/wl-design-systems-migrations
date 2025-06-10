import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze, mergeAnalysisResults } from "../analyze.ts";

describe("analyze - basic functionality", () => {
  test("analyze basic component usage with new values structure", () => {
    const INPUT = "import { Div, Text } from \"@workleap/orbiter-ui\"; export function App() { return <><Div border=\"1px\" width=\"120px\" /><Text fontSize=\"14px\" /></>; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check that components exist
    expect(analysisResults.components.Div).toBeDefined();
    expect(analysisResults.components.Text).toBeDefined();

    // Check component usage counts
    expect(analysisResults.components.Div!.usage).toBe(1);
    expect(analysisResults.components.Text!.usage).toBe(1);

    // Check that values are objects, not Sets
    expect(typeof analysisResults.components.Div!.props.border?.values).toBe("object");
    expect(Array.isArray(analysisResults.components.Div!.props.border?.values)).toBe(false);

    // Check specific values
    expect(analysisResults.components.Div!.props.border?.values["1px"]).toBeDefined();
    expect(analysisResults.components.Div!.props.border?.values["1px"]?.total).toBe(1);
    expect(analysisResults.components.Div!.props.width?.values["120px"]?.total).toBe(1);
    expect(analysisResults.components.Text!.props.fontSize?.values["14px"]?.total).toBe(1);
  });

  test("multiple components same type different props", () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <><Div border=\"1px\" /><Div width=\"120px\" /></>; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    expect(analysisResults.components.Div!.usage).toBe(2);
    expect(analysisResults.components.Div!.props.border?.usage).toBe(1);
    expect(analysisResults.components.Div!.props.width?.usage).toBe(1);
  });

  test("multiple components same prop different values", () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <><Div border=\"1px\" /><Div border=\"2px\" /></>; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    expect(analysisResults.components.Div!.usage).toBe(2);
    expect(analysisResults.components.Div!.props.border?.usage).toBe(2);
    expect(analysisResults.components.Div!.props.border?.values["1px"]?.total).toBe(1);
    expect(analysisResults.components.Div!.props.border?.values["2px"]?.total).toBe(1);
  });

  test("multiple components same prop same value", () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <><Div border=\"1px\" /><Div border=\"1px\" /></>; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    expect(analysisResults.components.Div!.usage).toBe(2);
    expect(analysisResults.components.Div!.props.border?.usage).toBe(2);
    expect(analysisResults.components.Div!.props.border?.values["1px"]?.total).toBe(2);
  });

  test("analyze overall usage counts", () => {
    const INPUT = "import { Div, Text, Button } from \"@workleap/orbiter-ui\"; export function App() { return <><Div border=\"1px\" /><Text fontSize=\"14px\" /><Button variant=\"primary\" /></>; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    expect(analysisResults.overall.usage.components).toBe(3);
    expect(analysisResults.overall.usage.props).toBe(3);
  });

  test("analyze with project parameter", () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null, { project: "test-project" });

    expect(analysisResults.components.Div!.props.border?.values["1px"]?.projects).toBeDefined();
    expect(analysisResults.components.Div!.props.border?.values["1px"]?.projects!["test-project"]).toBe(1);
  });

  test("handles components not in mapping gracefully", () => {
    const INPUT = "import { UnknownComponent } from \"@workleap/orbiter-ui\"; export function App() { return <UnknownComponent someProp=\"value\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    expect(analysisResults.components.UnknownComponent).toBeDefined();
  });

  test("ignores non-orbiter imports", () => {
    const INPUT = "import { SomeComponent } from \"other-library\"; export function App() { return <SomeComponent prop=\"value\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    expect(Object.keys(analysisResults.components)).toHaveLength(0);
  });
});

describe("analyze - merging results", () => {
  test("mergeAnalysisResults combines multiple results correctly", () => {
    const INPUT1 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";
    const INPUT2 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"2px\" />; }";

    const result1 = analyze(getRuntime(INPUT1), null);
    const result2 = analyze(getRuntime(INPUT2), null);

    const merged = mergeAnalysisResults(result1.analysisResults, result2.analysisResults);

    expect(merged.components.Div!.usage).toBe(2);
    expect(merged.components.Div!.props.border?.usage).toBe(2);
    expect(merged.components.Div!.props.border?.values["1px"]?.total).toBe(1);
    expect(merged.components.Div!.props.border?.values["2px"]?.total).toBe(1);
    expect(merged.overall.usage.components).toBe(2);
    expect(merged.overall.usage.props).toBe(2);
  });

  test("mergeAnalysisResults handles duplicate values", () => {
    const INPUT1 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";
    const INPUT2 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";

    const result1 = analyze(getRuntime(INPUT1), null);
    const result2 = analyze(getRuntime(INPUT2), null);

    const merged = mergeAnalysisResults(result1.analysisResults, result2.analysisResults);

    expect(merged.components.Div!.usage).toBe(2);
    expect(merged.components.Div!.props.border?.usage).toBe(2);
    expect(merged.components.Div!.props.border?.values["1px"]?.total).toBe(2);
  });

  test("mergeAnalysisResults with project parameters", () => {
    const INPUT1 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";
    const INPUT2 = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div border=\"1px\" />; }";

    const result1 = analyze(getRuntime(INPUT1), null, { project: "project1" });
    const result2 = analyze(getRuntime(INPUT2), null, { project: "project2" });

    const merged = mergeAnalysisResults(result1.analysisResults, result2.analysisResults);

    expect(merged.components.Div!.props.border?.values["1px"]?.projects!["project1"]).toBe(1);
    expect(merged.components.Div!.props.border?.values["1px"]?.projects!["project2"]).toBe(1);
    expect(merged.components.Div!.props.border?.values["1px"]?.total).toBe(2);
  });

  test("analyze component with alias", () => {
    const INPUT = "import { Div as CustomDiv } from \"@workleap/orbiter-ui\"; export function App() { return <CustomDiv border=\"1px\" width=\"120px\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check expected component is present
    expect(analysisResults.components.Div).toBeDefined();
    expect(analysisResults.components.Div!.usage).toBe(1);
    expect(analysisResults.components.Div!.props.border?.usage).toBe(1);
    expect(analysisResults.components.Div!.props.width?.usage).toBe(1);
  });

  test("analyze includes non-mapped components", () => {
    const INPUT = "import { UnknownComponent } from \"@workleap/orbiter-ui\"; export function App() { return <UnknownComponent prop1=\"value\" prop2=\"value\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Should include the unknown component and its props
    expect(analysisResults.components.UnknownComponent).toBeDefined();
    expect(analysisResults.components.UnknownComponent!.usage).toBe(1);
    expect(Object.keys(analysisResults.components.UnknownComponent!.props)).toHaveLength(2);
    expect(analysisResults.components.UnknownComponent!.props.prop1?.usage).toBe(1);
    expect(analysisResults.components.UnknownComponent!.props.prop2?.usage).toBe(1);
  });

  test("analyze complex component with multiple usages", () => {
    const INPUT = `
      import { Div, Text } from "@workleap/orbiter-ui";
      export function App() {
        return (
          <>
            <Div width="100px" height="200px">
              <Text fontSize="14px" />
            </Div>
            <Div height="50px" maxWidth="300px" />
            <Text fontWeight="bold" />
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check component names
    const expectedComponents = ["Div", "Text"];
    expect(Object.keys(analysisResults.components).sort()).toEqual(expectedComponents.sort());

    // Check Div component
    expect(analysisResults.components.Div).toBeDefined();
    expect(analysisResults.components.Div!.usage).toBe(2);

    // Check Div props
    const divProps = Object.keys(analysisResults.components.Div!.props);
    expect(divProps).toHaveLength(3);
    expect(divProps.includes("width")).toBe(true);
    expect(divProps.includes("height")).toBe(true);
    expect(divProps.includes("maxWidth")).toBe(true);

    expect(analysisResults.components.Div!.props.width?.usage).toBe(1);
    expect(analysisResults.components.Div!.props.height?.usage).toBe(2);
    expect(analysisResults.components.Div!.props.maxWidth?.usage).toBe(1);

    // Check Text component
    expect(analysisResults.components.Text).toBeDefined();
    expect(analysisResults.components.Text!.usage).toBe(2);

    // Check Text props
    const textProps = Object.keys(analysisResults.components.Text!.props);
    expect(textProps).toHaveLength(2);
    expect(textProps.includes("fontSize")).toBe(true);
    expect(textProps.includes("fontWeight")).toBe(true);

    expect(analysisResults.components.Text!.props.fontSize?.usage).toBe(1);
    expect(analysisResults.components.Text!.props.fontWeight?.usage).toBe(1);
  });

  test("analyze with custom source package", () => {
    const INPUT = `
      import { CustomComponent } from "@custom/package";
      export function App() {
        return <CustomComponent prop1="value1" prop2="value2" />;
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      sourcePackage: "@custom/package"
    });

    expect(analysisResults.components.CustomComponent).toBeDefined();
    expect(analysisResults.components.CustomComponent!.usage).toBe(1);
    expect(Object.keys(analysisResults.components.CustomComponent!.props)).toHaveLength(2);
    expect(analysisResults.components.CustomComponent!.props.prop1?.usage).toBe(1);
    expect(analysisResults.components.CustomComponent!.props.prop2?.usage).toBe(1);
  });

  test("analyze ignores hooks and utility functions that aren't used as components", () => {
    const INPUT = `
      import { Button, Text, useHook, utilFunction } from "@workleap/orbiter-ui";
      export function App() {
        const value = useHook();
        utilFunction();
        return (
          <>
            <Button onClick={() => {}} size="lg" />
            <Text>Content</Text>
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Should only include components used with JSX, not hooks or utility functions
    expect(Object.keys(analysisResults.components).sort()).toEqual(["Button", "Text"]);

    // Check Button component
    expect(analysisResults.components.Button).toBeDefined();
    expect(analysisResults.components.Button!.usage).toBe(1);
    expect(Object.keys(analysisResults.components.Button!.props)).toHaveLength(2);
    expect(analysisResults.components.Button!.props.onClick?.usage).toBe(1);
    expect(analysisResults.components.Button!.props.size?.usage).toBe(1);

    // Check Text component
    expect(analysisResults.components.Text).toBeDefined();
    expect(analysisResults.components.Text!.usage).toBe(1);

    // Verify hooks and utility functions are not included
    expect(analysisResults.components.useHook).toBeUndefined();
    expect(analysisResults.components.utilFunction).toBeUndefined();
  });

  test("analyze correctly stores multiple values for the same prop", () => {
    const INPUT = `
      import { Button } from "@workleap/orbiter-ui";
      export function App() {
        return (
          <>
            <Button variant="primary" size="sm">Primary Small</Button>
            <Button variant="secondary" size="md">Secondary Medium</Button>
            <Button variant="tertiary" size="lg">Tertiary Large</Button>
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check button component exists
    expect(analysisResults.components.Button).toBeDefined();
    expect(analysisResults.components.Button!.usage).toBe(3);

    // Check variant values
    expect(analysisResults.components.Button!.props.variant?.usage).toBe(3);

    const variantValues = Object.keys(
      analysisResults.components.Button!.props.variant?.values || {}
    ).sort();
    expect(variantValues).toEqual(["primary", "secondary", "tertiary"]);

    // Check size values
    expect(analysisResults.components.Button!.props.size?.usage).toBe(3);

    const sizeValues = Object.keys(
      analysisResults.components.Button!.props.size?.values || {}
    ).sort();
    expect(sizeValues).toEqual(["lg", "md", "sm"]);
  });

  test("analyze correctly captures different types of prop values", () => {
    const INPUT = `
      import { Button, Text, Div } from "@workleap/orbiter-ui";
      export function App() {
        const dynamicValue = "dynamic";
        return (
          <>
            <Button 
              variant="primary" 
              onClick={() => console.log("clicked")} 
              disabled={true} 
              data-testid="test-button"
              aria-label={\`Button \${dynamicValue}\`}
            >
              Click me
            </Button>
            <Div 
              width="100px"
              height={200} 
              margin={{ top: 10, bottom: 20 }}
              padding={["10px", "20px"]}
            />
            <Text fontSize={dynamicValue}>Text content</Text>
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      "include-ignoreList": true
    });

    // Check Button prop values
    expect(analysisResults.components.Button).toBeDefined();

    // String literal value
    expect(Object.keys(
      analysisResults.components.Button!.props.variant?.values || {}
    )).toEqual(["primary"]);

    // Function expression (partial match since it might include whitespace differences)
    const onClickValues = Object.keys(
      analysisResults.components.Button!.props.onClick?.values || {}
    );
    expect(onClickValues.some(value => value.includes("console.log"))).toBe(true);

    // Boolean expression
    const disabledValues = Object.keys(
      analysisResults.components.Button!.props.disabled?.values || {}
    );
    expect(disabledValues.some(value => value.includes("true"))).toBe(true);

    // String literal with hyphen
    expect(Object.keys(
      analysisResults.components.Button!.props["data-testid"]?.values || {}
    )).toEqual(["test-button"]);

    // Template literal
    const ariaLabelValues = Object.keys(
      analysisResults.components.Button!.props["aria-label"]?.values || {}
    );
    expect(ariaLabelValues.some(value => value.includes("dynamicValue"))).toBe(true);

    // Check Div prop values
    expect(analysisResults.components.Div).toBeDefined();

    // String literal (width)
    expect(Object.keys(analysisResults.components.Div!.props.width?.values || {})).toEqual(["100px"]);

    // Numeric literal
    const heightValues = Object.keys(
      analysisResults.components.Div!.props.height?.values || {}
    );
    expect(heightValues.some(value => value.includes("200"))).toBe(true);

    // Object expression
    const marginValues = Object.keys(
      analysisResults.components.Div!.props.margin?.values || {}
    );
    expect(marginValues.some(
      value => value.includes("top") && value.includes("bottom")
    )).toBe(true);

    // Array expression
    const paddingValues = Object.keys(
      analysisResults.components.Div!.props.padding?.values || {}
    );
    expect(paddingValues.some(value => value.includes("[") && value.includes("]"))).toBe(true);

    // Variable reference
    expect(analysisResults.components.Text).toBeDefined();
    const fontSizeValues = Object.keys(
      analysisResults.components.Text!.props.fontSize?.values || {}
    );
    expect(fontSizeValues.some(value => value.includes("dynamicValue"))).toBe(true);
  });

  test("analyze with project parameter tracks project-specific counts", () => {
    const INPUT = "import { Button } from \"@workleap/orbiter-ui\"; export function App() { return <Button variant=\"primary\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      project: "projectA"
    });

    // Check component exists
    expect(analysisResults.components.Button).toBeDefined();

    // Check values structure
    const variantValues =
      analysisResults.components.Button!.props.variant?.values;
    expect(variantValues).toBeDefined();

    // Check project-specific tracking
    const primaryValue = variantValues?.["primary"];
    expect(primaryValue?.total).toBe(1);
    expect(primaryValue?.projects?.projectA).toBe(1);
  });

  test("analyze without project parameter only tracks total counts", () => {
    const INPUT = "import { Button } from \"@workleap/orbiter-ui\"; export function App() { return <Button variant=\"secondary\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check component exists
    expect(analysisResults.components.Button).toBeDefined();

    // Check values structure
    const variantValues =
      analysisResults.components.Button!.props.variant?.values;
    expect(variantValues).toBeDefined();

    // Check only total count is tracked
    const secondaryValue = variantValues?.["secondary"];
    expect(secondaryValue?.total).toBe(1);

    // Should not have project-specific keys (only total)
    const keys = Object.keys(secondaryValue || {});
    expect(keys).toEqual(["total"]);
  });

  test("analyze accumulates values across different project names correctly", () => {
    // Create a temporary file path for accumulating results
    const tempFilePath = "./test_temp_analysis.json";

    // Clean up any existing test file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch {
      // Ignore cleanup errors
    }

    // Test data with same and different values across projects
    const INPUT_PROJECT_A = `import { Button, Div } from "@workleap/orbiter-ui"; 
      export function App() { 
        return (
          <>
            <Button variant="primary" size="large" />
            <Div padding="10px" />
          </>
        ); 
      }`;

    const INPUT_PROJECT_B = `import { Button, Text } from "@workleap/orbiter-ui"; 
      export function App() { 
        return (
          <>
            <Button variant="primary" size="small" />
            <Button variant="secondary" size="large" />
            <Text fontSize="14px" />
          </>
        ); 
      }`;

    const INPUT_PROJECT_C = `import { Button } from "@workleap/orbiter-ui"; 
      export function App() { 
        return <Button variant="primary" size="medium" />; 
      }`;

    try {
      // Run analysis for projectA
      analyze(getRuntime(INPUT_PROJECT_A), tempFilePath, {
        project: "projectA"
      });

      // Run analysis for projectB - this should accumulate with projectA results
      analyze(getRuntime(INPUT_PROJECT_B), tempFilePath, {
        project: "projectB"
      });

      // Run analysis for projectC - this should accumulate with projectA + projectB results
      const { analysisResults: finalResults } = analyze(
        getRuntime(INPUT_PROJECT_C),
        tempFilePath,
        { project: "projectC" }
      );

      // Check Button component accumulation
      const buttonComponent = finalResults.components.Button;
      expect(buttonComponent).toBeDefined();
      expect(buttonComponent!.usage).toBe(4); // 1 from A + 2 from B + 1 from C

      // Check variant prop accumulation
      const variantValues = buttonComponent!.props.variant?.values;
      expect(variantValues).toBeDefined();

      // Check "primary" variant (appears in all projects)
      const primaryValue = variantValues?.["primary"];
      expect(primaryValue?.total).toBe(3); // 1 from A + 1 from B + 1 from C
      expect(primaryValue?.projects?.projectA).toBe(1);
      expect(primaryValue?.projects?.projectB).toBe(1);
      expect(primaryValue?.projects?.projectC).toBe(1);

      // Check "secondary" variant (only in projectB)
      const secondaryValue = variantValues?.["secondary"];
      expect(secondaryValue?.total).toBe(1); // Only from B
      expect(secondaryValue?.projects?.projectB).toBe(1);
      expect(secondaryValue?.projects?.projectA).toBeUndefined();
      expect(secondaryValue?.projects?.projectC).toBeUndefined();

      // Check size prop accumulation
      const sizeValues = buttonComponent!.props.size?.values;
      expect(sizeValues).toBeDefined();

      // Check "large" size (appears in projectA and projectB)
      const largeValue = sizeValues?.["large"];
      expect(largeValue?.total).toBe(2); // 1 from A + 1 from B
      expect(largeValue?.projects?.projectA).toBe(1);
      expect(largeValue?.projects?.projectB).toBe(1);
      expect(largeValue?.projects?.projectC).toBeUndefined();

      // Check "small" size (only in projectB)
      const smallValue = sizeValues?.["small"];
      expect(smallValue?.total).toBe(1);
      expect(smallValue?.projects?.projectB).toBe(1);
      expect(smallValue?.projects?.projectA).toBeUndefined();

      // Check "medium" size (only in projectC)
      const mediumValue = sizeValues?.["medium"];
      expect(mediumValue?.total).toBe(1);
      expect(mediumValue?.projects?.projectC).toBe(1);
      expect(mediumValue?.projects?.projectA).toBeUndefined();
      expect(mediumValue?.projects?.projectB).toBeUndefined();

      // Check that other components are also tracked correctly
      expect(finalResults.components.Div).toBeDefined();
      expect(finalResults.components.Div!.usage).toBe(1); // Only from projectA

      expect(finalResults.components.Text).toBeDefined();
      expect(finalResults.components.Text!.usage).toBe(1); // Only from projectB

      // Check overall statistics
      expect(finalResults.overall.usage.components).toBe(6); // Total component instances
      expect(finalResults.overall.usage.props).toBe(10); // All prop instances: Button(8) + Div(1) + Text(1) = 10

      // Verify values are sorted by total count (primary should come first with total=3)
      const variantKeys = Object.keys(variantValues || {});
      expect(variantKeys[0]).toBe("primary"); // Should be first due to highest total count (3)
    } finally {
      // Clean up test file
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  test("properties are correctly sorted by usage frequency", () => {
    const INPUT = `
      import { Div } from "@workleap/orbiter-ui";
      
      export function App() {
        return (
          <>
            <Div width="100px" height="100px" padding="5px" />
            <Div width="200px" padding="10px" />
            <Div width="300px" />
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check that the Div component exists with correct usage count
    expect(analysisResults.components.Div).toBeDefined();
    expect(analysisResults.components.Div!.usage).toBe(3);

    // Check that properties have correct counts
    expect(analysisResults.components.Div!.props.width?.usage).toBe(3);
    expect(analysisResults.components.Div!.props.padding?.usage).toBe(2);
    expect(analysisResults.components.Div!.props.height?.usage).toBe(1);

    // Get properties sorted by usage count
    const propEntries = Object.entries(analysisResults.components.Div!.props);
    const sortedProps = propEntries
      .sort(([, a], [, b]) => b.usage - a.usage)
      .map(([name]) => name);

    // Properties should be sorted in order of frequency (width > padding > height)
    expect(sortedProps[0]).toBe("width");
    expect(sortedProps[1]).toBe("padding");
    expect(sortedProps[2]).toBe("height");
  });
});
