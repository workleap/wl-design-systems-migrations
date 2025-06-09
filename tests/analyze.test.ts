import assert from "node:assert";
import fs from "node:fs";
import { describe, expect, test } from "vitest";
import {
  analyze,
  mergeAnalysisResults
} from "../src/analysis/analyze.ts";
import { getRuntime } from "./utils.ts";

describe("analyze basic functionality", () => {
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
    expect(typeof analysisResults.components.Div!.props.border?.values).toBe(
      "object"
    );
    expect(
      Array.isArray(analysisResults.components.Div!.props.border?.values)
    ).toBe(false);

    // Check actual values stored
    const borderValues = Object.keys(
      analysisResults.components.Div!.props.border?.values || {}
    );
    expect(borderValues).toEqual(["1px"]);

    const widthValues = Object.keys(
      analysisResults.components.Div!.props.width?.values || {}
    );
    expect(widthValues).toEqual(["120px"]);

    // Check value counts
    const borderValueData =
      analysisResults.components.Div!.props.border?.values["1px"];
    expect(borderValueData?.total).toBe(1);

    // Check overall statistics
    expect(analysisResults.overall.usage.components).toBe(2);
    expect(analysisResults.overall.usage.props).toBe(3); // border + width + fontSize
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
    expect(primaryValue?.projectA).toBe(1);
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
      expect(primaryValue?.projectA).toBe(1);
      expect(primaryValue?.projectB).toBe(1);
      expect(primaryValue?.projectC).toBe(1);

      // Check "secondary" variant (only in projectB)
      const secondaryValue = variantValues?.["secondary"];
      expect(secondaryValue?.total).toBe(1); // Only from B
      expect(secondaryValue?.projectB).toBe(1);
      expect(secondaryValue?.projectA).toBeUndefined();
      expect(secondaryValue?.projectC).toBeUndefined();

      // Check size prop accumulation
      const sizeValues = buttonComponent!.props.size?.values;
      expect(sizeValues).toBeDefined();

      // Check "large" size (appears in projectA and projectB)
      const largeValue = sizeValues?.["large"];
      expect(largeValue?.total).toBe(2); // 1 from A + 1 from B
      expect(largeValue?.projectA).toBe(1);
      expect(largeValue?.projectB).toBe(1);
      expect(largeValue?.projectC).toBeUndefined();

      // Check "small" size (only in projectB)
      const smallValue = sizeValues?.["small"];
      expect(smallValue?.total).toBe(1);
      expect(smallValue?.projectB).toBe(1);
      expect(smallValue?.projectA).toBeUndefined();

      // Check "medium" size (only in projectC)
      const mediumValue = sizeValues?.["medium"];
      expect(mediumValue?.total).toBe(1);
      expect(mediumValue?.projectC).toBe(1);
      expect(mediumValue?.projectA).toBeUndefined();
      expect(mediumValue?.projectB).toBeUndefined();

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
});

describe("component usage analysis", () => {
  test("analyze basic component usage", () => {
    const INPUT = "import { Div, Text } from \"@workleap/orbiter-ui\"; export function App() { return <><Div border=\"1px\" width=\"120px\" /><Text fontSize=\"14px\" /></>; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check that the results are in the expected JSON format with usage counts
    assert.ok(
      analysisResults.components.Div,
      "Div component should be present in results"
    );
    assert.ok(
      analysisResults.components.Text,
      "Text component should be present in results"
    );

    // Check component usage count
    assert.strictEqual(
      analysisResults.components.Div.usage,
      1,
      "Div should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.components.Text.usage,
      1,
      "Text should have usage count of 1"
    );

    // Check prop counts
    assert.strictEqual(
      Object.keys(analysisResults.components.Div.props).length,
      2,
      "Div should have 2 props"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.border?.usage,
      1,
      "Div border prop should have usage count of 1"
    );
    assert.ok(
      typeof analysisResults.components.Div.props.border?.values === "object" &&
        !Array.isArray(analysisResults.components.Div.props.border?.values),
      "Div border prop values should be an object"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.width?.usage,
      1,
      "Div width prop should have usage count of 1"
    );
    assert.ok(
      typeof analysisResults.components.Div.props.width?.values === "object" &&
        !Array.isArray(analysisResults.components.Div.props.width?.values),
      "Div width prop values should be an object"
    );

    // Check actual values stored in the object
    assert.deepStrictEqual(
      Object.keys(analysisResults.components.Div.props.border?.values || {}),
      ["1px"],
      "Div border values should contain '1px'"
    );
    assert.deepStrictEqual(
      Object.keys(analysisResults.components.Div.props.width?.values || {}),
      ["120px"],
      "Div width values should contain '120px'"
    );

    assert.strictEqual(
      Object.keys(analysisResults.components.Text.props).length,
      1,
      "Text should have 1 prop"
    );
    assert.strictEqual(
      analysisResults.components.Text.props.fontSize?.usage,
      1,
      "Text fontSize prop should have usage count of 1"
    );
    assert.ok(
      typeof analysisResults.components.Text.props.fontSize?.values ===
        "object" &&
        !Array.isArray(analysisResults.components.Text.props.fontSize?.values),
      "Text fontSize prop values should be an object"
    );
    assert.deepStrictEqual(
      Object.keys(analysisResults.components.Text.props.fontSize?.values || {}),
      ["14px"],
      "Text fontSize values should contain '14px'"
    );

    // Check overall statistics
    assert.strictEqual(
      analysisResults.overall.usage.components,
      2,
      "Overall component usage should be 2"
    );
    assert.strictEqual(
      analysisResults.overall.usage.props,
      3,
      "Overall prop usage should be 3 (border + width + fontSize)"
    );
  });

  test("analyze component with alias", () => {
    const INPUT = "import { Div as CustomDiv, Text } from \"@workleap/orbiter-ui\"; export function App() { return <CustomDiv border=\"1px\" width=\"120px\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check expected component is present
    assert.ok(
      analysisResults.components.Div,
      "Div component should be present in results"
    );

    // Check component usage count
    assert.strictEqual(
      analysisResults.components.Div.usage,
      1,
      "Div should have usage count of 1"
    );

    // Check prop counts
    assert.strictEqual(
      Object.keys(analysisResults.components.Div.props).length,
      2,
      "Div should have 2 props"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.border?.usage,
      1,
      "Div border prop should have usage count of 1"
    );
    assert.ok(
      typeof analysisResults.components.Div.props.border?.values === "object" &&
        !Array.isArray(analysisResults.components.Div.props.border?.values),
      "Div border prop values should be an object"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.width?.usage,
      1,
      "Div width prop should have usage count of 1"
    );
    assert.ok(
      typeof analysisResults.components.Div.props.width?.values === "object" &&
        !Array.isArray(analysisResults.components.Div.props.width?.values),
      "Div width prop values should be an object"
    );
  });

  test("analyze includes non-mapped components", () => {
    const INPUT = "import { UnknownComponent } from \"@workleap/orbiter-ui\"; export function App() { return <UnknownComponent prop1=\"value\" prop2=\"value\" />; }";

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Should include the unknown component and its props
    assert.ok(
      analysisResults.components.UnknownComponent,
      "UnknownComponent should be present in results"
    );

    // Check component usage count
    assert.strictEqual(
      analysisResults.components.UnknownComponent.usage,
      1,
      "UnknownComponent should have usage count of 1"
    );

    // Check prop counts
    assert.strictEqual(
      Object.keys(analysisResults.components.UnknownComponent.props).length,
      2,
      "UnknownComponent should have 2 props"
    );
    assert.strictEqual(
      analysisResults.components.UnknownComponent.props.prop1?.usage,
      1,
      "UnknownComponent prop1 should have usage count of 1"
    );
    assert.ok(
      typeof analysisResults.components.UnknownComponent.props.prop1?.values ===
        "object" &&
        !Array.isArray(
          analysisResults.components.UnknownComponent.props.prop1?.values
        ),
      "UnknownComponent prop1 values should be an object"
    );
    assert.strictEqual(
      analysisResults.components.UnknownComponent.props.prop2?.usage,
      1,
      "UnknownComponent prop2 should have usage count of 1"
    );
    assert.ok(
      typeof analysisResults.components.UnknownComponent.props.prop2?.values ===
        "object" &&
        !Array.isArray(
          analysisResults.components.UnknownComponent.props.prop2?.values
        ),
      "UnknownComponent prop2 values should be an object"
    );
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
    assert.deepEqual(
      Object.keys(analysisResults.components).sort(),
      expectedComponents.sort()
    );

    // Check Div component
    assert.ok(
      analysisResults.components.Div,
      "Div component should be present in results"
    );
    assert.strictEqual(
      analysisResults.components.Div.usage,
      2,
      "Div should have usage count of 2"
    );

    // Check Div props
    const divProps = Object.keys(analysisResults.components.Div.props);
    assert.strictEqual(divProps.length, 3, "Div should have 3 props");
    assert.ok(divProps.includes("width"), "Div should have width prop");
    assert.ok(divProps.includes("height"), "Div should have height prop");
    assert.ok(divProps.includes("maxWidth"), "Div should have maxWidth prop");

    assert.strictEqual(
      analysisResults.components.Div.props.width?.usage,
      1,
      "width prop should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.height?.usage,
      2,
      "height prop should have usage count of 2"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.maxWidth?.usage,
      1,
      "maxWidth prop should have usage count of 1"
    );

    // Check Text component
    assert.ok(
      analysisResults.components.Text,
      "Text component should be present in results"
    );
    assert.strictEqual(
      analysisResults.components.Text.usage,
      2,
      "Text should have usage count of 2"
    );

    // Check Text props
    const textProps = Object.keys(analysisResults.components.Text.props);
    assert.strictEqual(textProps.length, 2, "Text should have 2 props");
    assert.ok(textProps.includes("fontSize"), "Text should have fontSize prop");
    assert.ok(
      textProps.includes("fontWeight"),
      "Text should have fontWeight prop"
    );

    assert.strictEqual(
      analysisResults.components.Text.props.fontSize?.usage,
      1,
      "fontSize prop should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.components.Text.props.fontWeight?.usage,
      1,
      "fontWeight prop should have usage count of 1"
    );
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

    assert.ok(
      analysisResults.components.CustomComponent,
      "CustomComponent should be present in results"
    );

    // Check usage count
    assert.strictEqual(
      analysisResults.components.CustomComponent.usage,
      1,
      "CustomComponent should have usage count of 1"
    );

    // Check props
    assert.strictEqual(
      Object.keys(analysisResults.components.CustomComponent.props).length,
      2,
      "CustomComponent should have 2 props"
    );
    assert.strictEqual(
      analysisResults.components.CustomComponent.props.prop1?.usage,
      1,
      "prop1 should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.components.CustomComponent.props.prop2?.usage,
      1,
      "prop2 should have usage count of 1"
    );
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
    assert.deepEqual(
      Object.keys(analysisResults.components).sort(),
      ["Button", "Text"].sort(),
      "Only actual components should be included in results"
    );

    // Check Button component
    assert.ok(
      analysisResults.components.Button,
      "Button component should be present in results"
    );
    assert.strictEqual(
      analysisResults.components.Button.usage,
      1,
      "Button should have usage count of 1"
    );
    assert.strictEqual(
      Object.keys(analysisResults.components.Button.props).length,
      2,
      "Button should have 2 props"
    );
    assert.strictEqual(
      analysisResults.components.Button.props.onClick?.usage,
      1,
      "onClick prop should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.components.Button.props.size?.usage,
      1,
      "size prop should have usage count of 1"
    );

    // Check Text component
    assert.ok(
      analysisResults.components.Text,
      "Text component should be present in results"
    );
    assert.strictEqual(
      analysisResults.components.Text.usage,
      1,
      "Text should have usage count of 1"
    );

    // Verify hooks and utility functions are not included
    assert.strictEqual(
      analysisResults.components.useHook,
      undefined,
      "Hook should not be present in results"
    );
    assert.strictEqual(
      analysisResults.components.utilFunction,
      undefined,
      "Utility function should not be present in results"
    );
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
    assert.ok(analysisResults.components.Div, "Div component should exist");
    assert.strictEqual(
      analysisResults.components.Div.usage,
      3,
      "Div should have 3 usages"
    );

    // Check that properties have correct counts
    assert.strictEqual(
      analysisResults.components.Div.props.width?.usage,
      3,
      "width prop should be used 3 times"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.padding?.usage,
      2,
      "padding prop should be used 2 times"
    );
    assert.strictEqual(
      analysisResults.components.Div.props.height?.usage,
      1,
      "height prop should be used 1 time"
    );

    // Get properties sorted by usage count
    const propEntries = Object.entries(analysisResults.components.Div.props);
    const sortedProps = propEntries
      .sort(([, a], [, b]) => b.usage - a.usage)
      .map(([name]) => name);

    // Properties should be sorted in order of frequency (width > padding > height)
    assert.strictEqual(
      sortedProps[0],
      "width",
      "width should be the most frequently used property"
    );
    assert.strictEqual(
      sortedProps[1],
      "padding",
      "padding should be the second most used property"
    );
    assert.strictEqual(
      sortedProps[2],
      "height",
      "height should be the least used property"
    );
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

    console.log(JSON.stringify(analysisResults));

    // Check Button prop values
    assert.ok(
      analysisResults.components.Button,
      "Button should be present in results"
    );

    // String literal value
    assert.deepStrictEqual(
      Object.keys(
        analysisResults.components.Button.props.variant?.values || {}
      ),
      ["primary"],
      "Button variant values should contain 'primary'"
    );

    // Function expression (partial match since it might include whitespace differences)
    const onClickValues = Object.keys(
      analysisResults.components.Button.props.onClick?.values || {}
    );
    assert.ok(
      onClickValues.some(value => value.includes("console.log")),
      "onClick should contain a function with console.log"
    );

    // Boolean expression
    const disabledValues = Object.keys(
      analysisResults.components.Button.props.disabled?.values || {}
    );
    assert.ok(
      disabledValues.some(value => value.includes("true")),
      "disabled prop should contain true value"
    );

    // String literal with hyphen
    assert.deepStrictEqual(
      Object.keys(
        analysisResults.components.Button.props["data-testid"]?.values || {}
      ),
      ["test-button"],
      "data-testid should contain 'test-button'"
    );

    // Template literal
    const ariaLabelValues = Object.keys(
      analysisResults.components.Button.props["aria-label"]?.values || {}
    );
    assert.ok(
      ariaLabelValues.some(value => value.includes("dynamicValue")),
      "aria-label should contain a template literal with dynamicValue"
    );

    // Check Div prop values
    assert.ok(
      analysisResults.components.Div,
      "Div should be present in results"
    );

    // String literal (width)
    assert.deepStrictEqual(
      Object.keys(analysisResults.components.Div.props.width?.values || {}),
      ["100px"],
      "Div width values should contain '100px'"
    );

    // Numeric literal
    const heightValues = Object.keys(
      analysisResults.components.Div.props.height?.values || {}
    );
    assert.ok(
      heightValues.some(value => value.includes("200")),
      "height should contain '200' value"
    );

    // Object expression
    const marginValues = Object.keys(
      analysisResults.components.Div.props.margin?.values || {}
    );
    assert.ok(
      marginValues.some(
        value => value.includes("top") && value.includes("bottom")
      ),
      "margin should contain an object with top and bottom properties"
    );

    // Array expression
    const paddingValues = Object.keys(
      analysisResults.components.Div.props.padding?.values || {}
    );
    assert.ok(
      paddingValues.some(value => value.includes("[") && value.includes("]")),
      "padding should contain an array value"
    );

    // Variable reference
    assert.ok(
      analysisResults.components.Text,
      "Text should be present in results"
    );
    const fontSizeValues = Object.keys(
      analysisResults.components.Text?.props.fontSize?.values || {}
    );
    assert.ok(
      fontSizeValues.some(value => value.includes("dynamicValue")),
      "fontSize should contain value referencing 'dynamicValue'"
    );
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
    assert.ok(
      analysisResults.components.Button,
      "Button should be present in results"
    );

    // Check usage count
    assert.strictEqual(
      analysisResults.components.Button.usage,
      3,
      "Button should have 3 usages"
    );

    // Check variant values
    assert.strictEqual(
      analysisResults.components.Button.props.variant?.usage,
      3,
      "variant prop should have usage count of 3"
    );

    const variantValues = Object.keys(
      analysisResults.components.Button.props.variant?.values || {}
    ).sort();
    assert.deepStrictEqual(
      variantValues,
      ["primary", "secondary", "tertiary"].sort(),
      "variant values should contain all three variants"
    );

    // Check size values
    assert.strictEqual(
      analysisResults.components.Button.props.size?.usage,
      3,
      "size prop should have usage count of 3"
    );

    const sizeValues = Object.keys(
      analysisResults.components.Button.props.size?.values || {}
    ).sort();
    assert.deepStrictEqual(
      sizeValues,
      ["sm", "md", "lg"].sort(),
      "size values should contain all three sizes"
    );
  });
});

describe("analyze file aggregation", () => {
  test("mergeAnalysisResults combines component usage and prop counts correctly", () => {
    const existingResults = {
      overall: {
        usage: {
          components: 13, // 5 + 8
          props: 20 // 3 + 5 + 2 + 6 + 4
        }
      },
      components: {
        Button: {
          usage: 5,
          props: {
            variant: {
              usage: 3,
              values: { primary: { total: 2 }, secondary: { total: 1 } }
            },
            size: { usage: 5, values: { lg: { total: 3 }, sm: { total: 2 } } },
            disabled: { usage: 2, values: { true: { total: 2 } } }
          }
        },
        Text: {
          usage: 8,
          props: {
            fontSize: {
              usage: 6,
              values: { "14px": { total: 3 }, "16px": { total: 3 } }
            },
            color: {
              usage: 4,
              values: { red: { total: 2 }, blue: { total: 2 } }
            }
          }
        }
      }
    };

    const newResults = {
      overall: {
        usage: {
          components: 7, // 3 + 4
          props: 9 // 2 + 3 + 1 + 3
        }
      },
      components: {
        Button: {
          usage: 3,
          props: {
            variant: {
              usage: 2,
              values: { primary: { total: 1 }, tertiary: { total: 1 } }
            },
            onClick: { usage: 3, values: { "() => {}": { total: 3 } } },
            "aria-label": {
              usage: 1,
              values: { "Button label": { total: 1 } }
            }
          }
        },
        Div: {
          usage: 4,
          props: {
            width: {
              usage: 3,
              values: { "100px": { total: 2 }, auto: { total: 1 } }
            },
            padding: { usage: 2, values: { "10px": { total: 2 } } }
          }
        }
      }
    };

    const mergedResults = mergeAnalysisResults(existingResults, newResults);

    // Verify overall statistics are correctly calculated
    assert.strictEqual(
      mergedResults.overall.usage.components,
      20, // 5+3 + 8 + 4
      "Overall component usage should be correctly summed"
    );
    assert.strictEqual(
      mergedResults.overall.usage.props,
      31, // Button: 5+5+2+3+1=16, Text: 6+4=10, Div: 3+2=5, Total: 31
      "Overall prop usage should be correctly summed"
    );

    // Verify components exist in merged results
    assert.ok(
      mergedResults.components.Button,
      "Button should exist in merged results"
    );
    assert.ok(
      mergedResults.components.Text,
      "Text should exist in merged results"
    );
    assert.ok(
      mergedResults.components.Div,
      "Div should exist in merged results"
    );

    // Check that component usage counts are summed
    assert.strictEqual(
      mergedResults.components.Button.usage,
      8,
      "Button usage should be summed to 8"
    );
    assert.strictEqual(
      mergedResults.components.Text.usage,
      8,
      "Text usage should remain 8"
    );
    assert.strictEqual(
      mergedResults.components.Div.usage,
      4,
      "Div usage should be 4"
    );

    // Check Button props are merged correctly
    assert.ok(
      mergedResults.components.Button?.props,
      "Button should have props"
    );

    // Use type assertions to handle TypeScript's possibly undefined warnings
    const buttonProps = mergedResults.components.Button!.props;

    assert.strictEqual(
      buttonProps.variant!.usage,
      5,
      "Button variant prop usage should sum to 5"
    );
    const mergedVariantValues = Object.keys(buttonProps.variant!.values).sort();
    assert.deepEqual(
      mergedVariantValues,
      ["primary", "secondary", "tertiary"].sort(),
      "Button variant values should be merged correctly"
    );
    assert.strictEqual(
      buttonProps.size!.usage,
      5,
      "Button size prop usage should remain 5"
    );
    assert.strictEqual(
      buttonProps.disabled!.usage,
      2,
      "Button disabled prop usage should remain 2"
    );
    assert.strictEqual(
      buttonProps.onClick!.usage,
      3,
      "Button onClick prop usage should be 3"
    );
    assert.strictEqual(
      buttonProps["aria-label"]!.usage,
      1,
      "Button aria-label prop usage should be 1"
    );

    // Check Text props remain unchanged
    assert.ok(mergedResults.components.Text?.props, "Text should have props");

    // Use type assertions for Text props
    const textProps = mergedResults.components.Text!.props;

    assert.strictEqual(
      textProps.fontSize!.usage,
      6,
      "Text fontSize prop usage should remain 6"
    );
    assert.strictEqual(
      textProps.color!.usage,
      4,
      "Text color prop usage should remain 4"
    );

    // Check Div is added correctly
    assert.ok(mergedResults.components.Div?.props, "Div should have props");

    // Use type assertions for Div props
    const divProps = mergedResults.components.Div!.props;

    assert.strictEqual(
      divProps.width!.usage,
      3,
      "Div width prop usage should be 3"
    );
    assert.strictEqual(
      divProps.padding!.usage,
      2,
      "Div padding prop usage should be 2"
    );
  });

  test("props are sorted by usage count", () => {
    const INPUT = `
      import { Button, Text, Div } from "@workleap/orbiter-ui";
      
      export function App() {
        return (
          <>
            <Button variant="primary" size="lg">Button 1</Button>
            <Button variant="primary" size="sm">Button 2</Button>
            <Text fontSize="14px">Text 1</Text>
            <Div width="100px" height="200px" />
            <Div width="200px" />
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check Button component
    assert.ok(
      analysisResults.components.Button,
      "Button component should be present in results"
    );
    assert.strictEqual(
      analysisResults.components.Button.usage,
      2,
      "Button should have usage count of 2"
    );

    // Check Text component
    assert.ok(
      analysisResults.components.Text,
      "Text component should be present in results"
    );
    assert.strictEqual(
      analysisResults.components.Text.usage,
      1,
      "Text should have usage count of 1"
    );

    // Check Div component
    assert.ok(
      analysisResults.components.Div,
      "Div component should be present in results"
    );
    assert.strictEqual(
      analysisResults.components.Div.usage,
      2,
      "Div should have usage count of 2"
    );

    // Check Button props
    const buttonProps = Object.keys(analysisResults.components.Button.props);
    assert.strictEqual(buttonProps.length, 2, "Button should have 2 props");
    assert.ok(
      buttonProps.includes("variant"),
      "Button should have variant prop"
    );
    assert.ok(buttonProps.includes("size"), "Button should have size prop");

    // Check Text props
    const textProps = Object.keys(analysisResults.components.Text.props);
    assert.strictEqual(textProps.length, 1, "Text should have 1 prop");
    assert.ok(textProps.includes("fontSize"), "Text should have fontSize prop");

    // Check Div props
    const divProps = Object.keys(analysisResults.components.Div.props);
    assert.strictEqual(divProps.length, 2, "Div should have 2 props");
    assert.ok(divProps.includes("width"), "Div should have width prop");
    assert.ok(divProps.includes("height"), "Div should have height prop");

    // Get sorted props for Button
    const sortedButtonProps = Object.entries(
      analysisResults.components.Button.props
    )
      .sort(([, a], [, b]) => b.usage - a.usage)
      .map(([name]) => name);

    // Button props should be sorted by usage count (variant > size)
    assert.strictEqual(
      sortedButtonProps[0],
      "variant",
      "variant should be the most frequently used Button prop"
    );
    assert.strictEqual(
      sortedButtonProps[1],
      "size",
      "size should be the second most used Button prop"
    );

    // Get sorted props for Text
    const sortedTextProps = Object.entries(
      analysisResults.components.Text.props
    )
      .sort(([, a], [, b]) => b.usage - a.usage)
      .map(([name]) => name);

    // Text props should be sorted by usage count (fontSize)
    assert.strictEqual(
      sortedTextProps[0],
      "fontSize",
      "fontSize should be the most frequently used Text prop"
    );

    // Get sorted props for Div
    const sortedDivProps = Object.entries(analysisResults.components.Div.props)
      .sort(([, a], [, b]) => b.usage - a.usage)
      .map(([name]) => name);

    // Div props should be sorted by usage count (width > height)
    assert.strictEqual(
      sortedDivProps[0],
      "width",
      "width should be the most frequently used Div prop"
    );
    assert.strictEqual(
      sortedDivProps[1],
      "height",
      "height should be the second most used Div prop"
    );
  });
});

describe("analyze property filtering", () => {
  test("excludes aria-* attributes by default", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          aria-label="Navigation"
          aria-hidden="true"
          aria-describedby="description"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include regular props
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );

    // Should exclude aria-* attributes
    assert.ok(
      !stackProps.includes("aria-label"),
      "aria-label should be excluded"
    );
    assert.ok(
      !stackProps.includes("aria-hidden"),
      "aria-hidden should be excluded"
    );
    assert.ok(
      !stackProps.includes("aria-describedby"),
      "aria-describedby should be excluded"
    );
  });

  test("excludes data-* attributes by default", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          data-testid="my-stack"
          data-custom="value"
          data-public="true"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include regular props
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );

    // Should exclude data-* attributes
    assert.ok(
      !stackProps.includes("data-testid"),
      "data-testid should be excluded"
    );
    assert.ok(
      !stackProps.includes("data-custom"),
      "data-custom should be excluded"
    );
    assert.ok(
      !stackProps.includes("data-public"),
      "data-public should be excluded"
    );
  });

  test("excludes known ignored props by default", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          className="my-class"
          style={{color: 'red'}}
          id="my-id"
          key="my-key"
          ref={myRef}
          role="button"
          slot="content"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include regular props
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );

    // Should exclude known ignored props
    assert.ok(
      !stackProps.includes("className"),
      "className should be excluded"
    );
    assert.ok(!stackProps.includes("style"), "style should be excluded");
    assert.ok(!stackProps.includes("id"), "id should be excluded");
    assert.ok(!stackProps.includes("key"), "key should be excluded");
    assert.ok(!stackProps.includes("ref"), "ref should be excluded");
    assert.ok(!stackProps.includes("role"), "role should be excluded");
    assert.ok(!stackProps.includes("slot"), "slot should be excluded");
  });

  test("includes all props when --include-ignoreList is true", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          aria-label="Navigation"
          data-testid="my-stack"
          className="my-class"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      "include-ignoreList": true
    });

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include all props when include-ignoreList is true
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );
    assert.ok(
      stackProps.includes("aria-label"),
      "aria-label should be included"
    );
    assert.ok(
      stackProps.includes("data-testid"),
      "data-testid should be included"
    );
    assert.ok(stackProps.includes("className"), "className should be included");
  });

  test("combines ignore filtering with filter-unmapped props", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row"
          gap="16px"
          aria-label="Navigation"
          data-testid="my-stack"
          className="my-class"
          unmappedProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      "filter-unmapped": "props"
    });

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should only include unmapped props that are also not in ignore list
    assert.ok(
      !stackProps.includes("direction"),
      "direction should be excluded (mapped)"
    );
    assert.ok(!stackProps.includes("gap"), "gap should be excluded (mapped)");
    assert.ok(
      !stackProps.includes("aria-label"),
      "aria-label should be excluded (ignored)"
    );
    assert.ok(
      !stackProps.includes("data-testid"),
      "data-testid should be excluded (ignored)"
    );
    assert.ok(
      !stackProps.includes("className"),
      "className should be excluded (ignored)"
    );
    assert.ok(
      stackProps.includes("unmappedProp"),
      "unmappedProp should be included"
    );
  });

  test("combines ignore filtering with filter-unmapped props and include-ignoreList", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row"
          gap="16px"
          aria-label="Navigation"
          data-testid="my-stack"
          className="my-class"
          unmappedProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      "filter-unmapped": "props",
      "include-ignoreList": true
    });

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include unmapped props including those in ignore list
    assert.ok(
      !stackProps.includes("direction"),
      "direction should be excluded (mapped)"
    );
    assert.ok(!stackProps.includes("gap"), "gap should be excluded (mapped)");
    assert.ok(
      stackProps.includes("aria-label"),
      "aria-label should be included (unmapped, ignore list included)"
    );
    assert.ok(
      stackProps.includes("data-testid"),
      "data-testid should be included (unmapped, ignore list included)"
    );
    assert.ok(
      stackProps.includes("className"),
      "className should be included (unmapped, ignore list included)"
    );
    assert.ok(
      stackProps.includes("unmappedProp"),
      "unmappedProp should be included"
    );
  });

  test("handles mixed case with multiple components", () => {
    const INPUT = `
    import { Stack, Text } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <>
          <Stack 
            direction="row"
            aria-label="Navigation"
            customStackProp="value"
          />
          <Text 
            fontSize="14px"
            data-testid="my-text"
            customTextProp="value"
          />
        </>
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    assert.ok(
      analysisResults.components.Text,
      "Text should be present in results"
    );

    const stackProps = Object.keys(analysisResults.components.Stack.props);
    const textProps = Object.keys(analysisResults.components.Text.props);

    // Stack props
    assert.ok(
      stackProps.includes("direction"),
      "Stack direction should be present"
    );
    assert.ok(
      stackProps.includes("customStackProp"),
      "Stack customStackProp should be present"
    );
    assert.ok(
      !stackProps.includes("aria-label"),
      "Stack aria-label should be excluded"
    );

    // Text props
    assert.ok(
      textProps.includes("fontSize"),
      "Text fontSize should be present"
    );
    assert.ok(
      textProps.includes("customTextProp"),
      "Text customTextProp should be present"
    );
    assert.ok(
      !textProps.includes("data-testid"),
      "Text data-testid should be excluded"
    );
  });
});
