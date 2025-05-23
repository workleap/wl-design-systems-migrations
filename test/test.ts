import jscodeshift, { type API } from "jscodeshift";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { describe, test } from "vitest";
import {
  AnalysisResults,
  analyze,
  mergeAnalysisResults,
} from "../src/analysis/analyze.js";
import { mappings as initialMappings } from "../src/mappings/mappings.js";
import { migrate } from "../src/migrations/migrate.js";
import { setReplacer, setReviver } from "../src/utils/serialization.js";
import { MapMetaData, Runtime } from "../src/utils/types.js";

const buildApi = (parser: string | undefined): API => ({
  j: parser ? jscodeshift.withParser(parser) : jscodeshift,
  jscodeshift: parser ? jscodeshift.withParser(parser) : jscodeshift,
  stats: () => {
    console.error(
      "The stats function was called, which is not supported on purpose"
    );
  },
  report: () => {
    console.error(
      "The report function was called, which is not supported on purpose"
    );
  },
});

const getRuntime = (
  source: string,
  mappingsOverrides?: Partial<MapMetaData>
): Runtime => {
  const api = buildApi("tsx");
  return {
    root: api.jscodeshift(source),
    filePath: "test.tsx",
    j: api.j,
    mappings: {
      ...initialMappings,
      ...mappingsOverrides,
    },
    log: console.log,
  };
};

describe("migrations", () => {
  test("when an Orbiter import got an alter name, keep it with hopper Hopper", async () => {
    const INPUT = `import { Div as Div2, Text } from "@workleap/orbiter-ui";`;
    const OUTPUT = `import { Div as Div2, Text } from "@hopper-ui/components";`;

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when all imports are from Orbiter, change them to Hopper", async () => {
    const INPUT = `import { Div } from "@workleap/orbiter-ui";`;
    const OUTPUT = `import { Div } from "@hopper-ui/components";`;

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when there is unknown import Orbiter, keep it as it", async () => {
    const INPUT = `import { XYZ } from "@workleap/orbiter-ui";`;
    const OUTPUT = `import { XYZ } from "@workleap/orbiter-ui";`;

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when two components map to same component, import them only once", async () => {
    const INPUT = `import { Text, Paragraph } from "@workleap/orbiter-ui";export function App() { return <><Paragraph><Text>Sample</Text></Paragraph></>; }`;
    const OUTPUT = `import { Text } from "@hopper-ui/components";export function App() { return <><Text><Text>Sample</Text></Text></>; }`;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Text: {
            targetName: "Text",
          },
          Paragraph: {
            targetName: "Text",
          },
        },
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when there is already an import for Hopper, add the migrated one to it", async () => {
    const INPUT = `import { Div } from "@workleap/orbiter-ui";import { Span } from "@hopper-ui/components";`;
    const OUTPUT = `import { Span, Div } from "@hopper-ui/components";`;

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when a component has similar name, Don't touch it.", async () => {
    const INPUT = `import { Div as Div2 } from "@workleap/orbiter-ui"; import { Div } from "external"; export function App() { return <><Div width="120px" height="auto" /><Div/></>; }`;
    const OUTPUT = `import { Div } from "external"; import { Div as Div2 } from "@hopper-ui/components"; export function App() { return <><Div width="120px" height="auto" /><Div/></>; }`;

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when an Orbiter component has attributes, use the map table to migrate them.", async () => {
    const INPUT = `import { Div } from "@workleap/orbiter-ui"; export function App() { return <Div width="120px" height="auto" />; }`;
    const OUTPUT = `import { Div } from "@hopper-ui/components"; export function App() { return <Div UNSAFE_width="120px" height="auto" />; }`;

    const actualOutput = migrate(getRuntime(INPUT));
    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when mapping has additional props for a mapping, add them to the result.", async () => {
    const INPUT = `import { Paragraph } from "@workleap/orbiter-ui"; export function App() { return <Paragraph />; }`;
    const OUTPUT = `import { Text } from "@hopper-ui/components"; export function App() { return <Text display="block" />; }`;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Paragraph: {
            targetName: "Text",
            props: {
              additions: {
                display: "block",
              },
            },
          },
        },
      })
    );
    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when the provided function for property map returns null, ignore the prop", async () => {
    const INPUT = `import { Div } from "@workleap/orbiter-ui"; export function App() { return <Div width="120px" />; }`;
    const OUTPUT = `import { Div } from "@hopper-ui/components"; export function App() { return <Div width="120px" />; }`;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: {
            targetName: "Div",
            props: {
              mappings: {
                width: () => null,
              },
            },
          },
        },
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when the provided function for property map returns a custom map, use it", async () => {
    const INPUT = `import { Div } from "@workleap/orbiter-ui"; export function App() { return <Div width="120px" />; }`;
    const OUTPUT = `import { Div } from "@hopper-ui/components"; export function App() { return <Div CUSTOM_width="120px_Custom" />; }`;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: {
            targetName: "Div",
            props: {
              mappings: {
                width: (value) => {
                  if (value?.type == "StringLiteral") {
                    value.value = `${value.value}_Custom`;
                  }

                  return {
                    to: "CUSTOM_width",
                    value: value,
                  };
                },
              },
            },
          },
        },
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("migrates input.tsx to match expected output.txt", () => {
    // Read the input and expected output files
    const INPUT = readFileSync(new URL("input.tsx", import.meta.url), "utf8");
    const EXPECTED_OUTPUT = readFileSync(
      new URL("output.txt", import.meta.url),
      "utf8"
    );

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, EXPECTED_OUTPUT);
  });
});

describe("component usage analysis", () => {
  test("analyze basic component usage", () => {
    const INPUT = `import { Div, Text } from "@workleap/orbiter-ui"; export function App() { return <><Div border="1px" width="120px" /><Text fontSize="14px" /></>; }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check that the results are in the expected JSON format with usage counts
    assert.ok(
      analysisResults.Div,
      "Div component should be present in results"
    );
    assert.ok(
      analysisResults.Text,
      "Text component should be present in results"
    );

    // Check component usage count
    assert.strictEqual(
      analysisResults.Div.usage,
      1,
      "Div should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.Text.usage,
      1,
      "Text should have usage count of 1"
    );

    // Check prop counts
    assert.strictEqual(
      Object.keys(analysisResults.Div.props).length,
      2,
      "Div should have 2 props"
    );
    assert.strictEqual(
      analysisResults.Div.props.border?.usage,
      1,
      "Div border prop should have usage count of 1"
    );
    assert.ok(
      analysisResults.Div.props.border?.values instanceof Set,
      "Div border prop values should be a Set"
    );
    assert.strictEqual(
      analysisResults.Div.props.width?.usage,
      1,
      "Div width prop should have usage count of 1"
    );
    assert.ok(
      analysisResults.Div.props.width?.values instanceof Set,
      "Div width prop values should be a Set"
    );

    // Check actual values stored in the Set
    assert.deepStrictEqual(
      Array.from(analysisResults.Div.props.border?.values || []),
      ["1px"],
      "Div border values should contain '1px'"
    );
    assert.deepStrictEqual(
      Array.from(analysisResults.Div.props.width?.values || []),
      ["120px"],
      "Div width values should contain '120px'"
    );

    assert.strictEqual(
      Object.keys(analysisResults.Text.props).length,
      1,
      "Text should have 1 prop"
    );
    assert.strictEqual(
      analysisResults.Text.props.fontSize?.usage,
      1,
      "Text fontSize prop should have usage count of 1"
    );
    assert.ok(
      analysisResults.Text.props.fontSize?.values instanceof Set,
      "Text fontSize prop values should be a Set"
    );
    assert.deepStrictEqual(
      Array.from(analysisResults.Text.props.fontSize?.values || []),
      ["14px"],
      "Text fontSize values should contain '14px'"
    );
  });

  test("analyze component with alias", () => {
    const INPUT = `import { Div as CustomDiv, Text } from "@workleap/orbiter-ui"; export function App() { return <CustomDiv border="1px" width="120px" />; }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check expected component is present
    assert.ok(
      analysisResults.Div,
      "Div component should be present in results"
    );

    // Check component usage count
    assert.strictEqual(
      analysisResults.Div.usage,
      1,
      "Div should have usage count of 1"
    );

    // Check prop counts
    assert.strictEqual(
      Object.keys(analysisResults.Div.props).length,
      2,
      "Div should have 2 props"
    );
    assert.strictEqual(
      analysisResults.Div.props.border?.usage,
      1,
      "Div border prop should have usage count of 1"
    );
    assert.ok(
      analysisResults.Div.props.border?.values instanceof Set,
      "Div border prop values should be a Set"
    );
    assert.strictEqual(
      analysisResults.Div.props.width?.usage,
      1,
      "Div width prop should have usage count of 1"
    );
    assert.ok(
      analysisResults.Div.props.width?.values instanceof Set,
      "Div width prop values should be a Set"
    );
  });

  test("analyze includes non-mapped components", () => {
    const INPUT = `import { UnknownComponent } from "@workleap/orbiter-ui"; export function App() { return <UnknownComponent prop1="value" prop2="value" />; }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Should include the unknown component and its props
    assert.ok(
      analysisResults.UnknownComponent,
      "UnknownComponent should be present in results"
    );

    // Check component usage count
    assert.strictEqual(
      analysisResults.UnknownComponent.usage,
      1,
      "UnknownComponent should have usage count of 1"
    );

    // Check prop counts
    assert.strictEqual(
      Object.keys(analysisResults.UnknownComponent.props).length,
      2,
      "UnknownComponent should have 2 props"
    );
    assert.strictEqual(
      analysisResults.UnknownComponent.props.prop1?.usage,
      1,
      "UnknownComponent prop1 should have usage count of 1"
    );
    assert.ok(
      analysisResults.UnknownComponent.props.prop1?.values instanceof Set,
      "UnknownComponent prop1 values should be a Set"
    );
    assert.strictEqual(
      analysisResults.UnknownComponent.props.prop2?.usage,
      1,
      "UnknownComponent prop2 should have usage count of 1"
    );
    assert.ok(
      analysisResults.UnknownComponent.props.prop2?.values instanceof Set,
      "UnknownComponent prop2 values should be a Set"
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
      Object.keys(analysisResults).sort(),
      expectedComponents.sort()
    );

    // Check Div component
    assert.ok(
      analysisResults.Div,
      "Div component should be present in results"
    );
    assert.strictEqual(
      analysisResults.Div.usage,
      2,
      "Div should have usage count of 2"
    );

    // Check Div props
    const divProps = Object.keys(analysisResults.Div.props);
    assert.strictEqual(divProps.length, 3, "Div should have 3 props");
    assert.ok(divProps.includes("width"), "Div should have width prop");
    assert.ok(divProps.includes("height"), "Div should have height prop");
    assert.ok(divProps.includes("maxWidth"), "Div should have maxWidth prop");

    assert.strictEqual(
      analysisResults.Div.props.width?.usage,
      1,
      "width prop should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.Div.props.height?.usage,
      2,
      "height prop should have usage count of 2"
    );
    assert.strictEqual(
      analysisResults.Div.props.maxWidth?.usage,
      1,
      "maxWidth prop should have usage count of 1"
    );

    // Check Text component
    assert.ok(
      analysisResults.Text,
      "Text component should be present in results"
    );
    assert.strictEqual(
      analysisResults.Text.usage,
      2,
      "Text should have usage count of 2"
    );

    // Check Text props
    const textProps = Object.keys(analysisResults.Text.props);
    assert.strictEqual(textProps.length, 2, "Text should have 2 props");
    assert.ok(textProps.includes("fontSize"), "Text should have fontSize prop");
    assert.ok(
      textProps.includes("fontWeight"),
      "Text should have fontWeight prop"
    );

    assert.strictEqual(
      analysisResults.Text.props.fontSize?.usage,
      1,
      "fontSize prop should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.Text.props.fontWeight?.usage,
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
      sourcePackage: "@custom/package",
    });

    assert.ok(
      analysisResults.CustomComponent,
      "CustomComponent should be present in results"
    );

    // Check usage count
    assert.strictEqual(
      analysisResults.CustomComponent.usage,
      1,
      "CustomComponent should have usage count of 1"
    );

    // Check props
    assert.strictEqual(
      Object.keys(analysisResults.CustomComponent.props).length,
      2,
      "CustomComponent should have 2 props"
    );
    assert.strictEqual(
      analysisResults.CustomComponent.props.prop1?.usage,
      1,
      "prop1 should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.CustomComponent.props.prop2?.usage,
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
      Object.keys(analysisResults).sort(),
      ["Button", "Text"].sort(),
      "Only actual components should be included in results"
    );

    // Check Button component
    assert.ok(
      analysisResults.Button,
      "Button component should be present in results"
    );
    assert.strictEqual(
      analysisResults.Button.usage,
      1,
      "Button should have usage count of 1"
    );
    assert.strictEqual(
      Object.keys(analysisResults.Button.props).length,
      2,
      "Button should have 2 props"
    );
    assert.strictEqual(
      analysisResults.Button.props.onClick?.usage,
      1,
      "onClick prop should have usage count of 1"
    );
    assert.strictEqual(
      analysisResults.Button.props.size?.usage,
      1,
      "size prop should have usage count of 1"
    );

    // Check Text component
    assert.ok(
      analysisResults.Text,
      "Text component should be present in results"
    );
    assert.strictEqual(
      analysisResults.Text.usage,
      1,
      "Text should have usage count of 1"
    );

    // Verify hooks and utility functions are not included
    assert.strictEqual(
      analysisResults.useHook,
      undefined,
      "Hook should not be present in results"
    );
    assert.strictEqual(
      analysisResults.utilFunction,
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
    assert.ok(analysisResults.Div, "Div component should exist");
    assert.strictEqual(
      analysisResults.Div.usage,
      3,
      "Div should have 3 usages"
    );

    // Check that properties have correct counts
    assert.strictEqual(
      analysisResults.Div.props.width?.usage,
      3,
      "width prop should be used 3 times"
    );
    assert.strictEqual(
      analysisResults.Div.props.padding?.usage,
      2,
      "padding prop should be used 2 times"
    );
    assert.strictEqual(
      analysisResults.Div.props.height?.usage,
      1,
      "height prop should be used 1 time"
    );

    // Get properties sorted by usage count
    const propEntries = Object.entries(analysisResults.Div.props);
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

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check Button prop values
    assert.ok(analysisResults.Button, "Button should be present in results");

    // String literal value
    assert.deepStrictEqual(
      Array.from(analysisResults.Button.props.variant?.values || []),
      ["primary"],
      "Button variant values should contain 'primary'"
    );

    // Function expression (partial match since it might include whitespace differences)
    const onClickValues = Array.from(
      analysisResults.Button.props.onClick?.values || []
    );
    assert.ok(
      onClickValues.some((value) => value.includes("console.log")),
      "onClick should contain a function with console.log"
    );

    // Boolean expression
    const disabledValues = Array.from(
      analysisResults.Button.props.disabled?.values || []
    );
    assert.ok(
      disabledValues.some((value) => value.includes("true")),
      "disabled prop should contain true value"
    );

    // String literal with hyphen
    assert.deepStrictEqual(
      Array.from(analysisResults.Button.props["data-testid"]?.values || []),
      ["test-button"],
      "data-testid should contain 'test-button'"
    );

    // Template literal
    const ariaLabelValues = Array.from(
      analysisResults.Button.props["aria-label"]?.values || []
    );
    assert.ok(
      ariaLabelValues.some((value) => value.includes("dynamicValue")),
      "aria-label should contain a template literal with dynamicValue"
    );

    // Check Div prop values
    assert.ok(analysisResults.Div, "Div should be present in results");

    // String literal (width)
    assert.deepStrictEqual(
      Array.from(analysisResults.Div.props.width?.values || []),
      ["100px"],
      "Div width values should contain '100px'"
    );

    // Numeric literal
    const heightValues = Array.from(
      analysisResults.Div.props.height?.values || []
    );
    assert.ok(
      heightValues.some((value) => value.includes("200")),
      "height should contain '200' value"
    );

    // Object expression
    const marginValues = Array.from(
      analysisResults.Div.props.margin?.values || []
    );
    assert.ok(
      marginValues.some(
        (value) => value.includes("top") && value.includes("bottom")
      ),
      "margin should contain an object with top and bottom properties"
    );

    // Array expression
    const paddingValues = Array.from(
      analysisResults.Div.props.padding?.values || []
    );
    assert.ok(
      paddingValues.some((value) => value.includes("[") && value.includes("]")),
      "padding should contain an array value"
    );

    // Variable reference
    assert.ok(analysisResults.Text, "Text should be present in results");
    const fontSizeValues = Array.from(
      analysisResults.Text?.props.fontSize?.values || []
    );
    assert.ok(
      fontSizeValues.some((value) => value.includes("dynamicValue")),
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
    assert.ok(analysisResults.Button, "Button should be present in results");

    // Check usage count
    assert.strictEqual(
      analysisResults.Button.usage,
      3,
      "Button should have 3 usages"
    );

    // Check variant values
    assert.strictEqual(
      analysisResults.Button.props.variant?.usage,
      3,
      "variant prop should have usage count of 3"
    );

    const variantValues = Array.from(
      analysisResults.Button.props.variant?.values || []
    ).sort();
    assert.deepStrictEqual(
      variantValues,
      ["primary", "secondary", "tertiary"].sort(),
      "variant values should contain all three variants"
    );

    // Check size values
    assert.strictEqual(
      analysisResults.Button.props.size?.usage,
      3,
      "size prop should have usage count of 3"
    );

    const sizeValues = Array.from(
      analysisResults.Button.props.size?.values || []
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
      Button: {
        usage: 5,
        props: {
          variant: { usage: 3, values: new Set(["primary", "secondary"]) },
          size: { usage: 5, values: new Set(["lg", "sm"]) },
          disabled: { usage: 2, values: new Set(["true"]) },
        },
      },
      Text: {
        usage: 8,
        props: {
          fontSize: { usage: 6, values: new Set(["14px", "16px"]) },
          color: { usage: 4, values: new Set(["red", "blue"]) },
        },
      },
    };

    const newResults = {
      Button: {
        usage: 3,
        props: {
          variant: { usage: 2, values: new Set(["primary", "tertiary"]) },
          onClick: { usage: 3, values: new Set(["() => {}"]) },
          "aria-label": { usage: 1, values: new Set(["Button label"]) },
        },
      },
      Div: {
        usage: 4,
        props: {
          width: { usage: 3, values: new Set(["100px", "auto"]) },
          padding: { usage: 2, values: new Set(["10px"]) },
        },
      },
    };

    const mergedResults = mergeAnalysisResults(existingResults, newResults);

    // Verify components exist in merged results
    assert.ok(mergedResults.Button, "Button should exist in merged results");
    assert.ok(mergedResults.Text, "Text should exist in merged results");
    assert.ok(mergedResults.Div, "Div should exist in merged results");

    // Check that component usage counts are summed
    assert.strictEqual(
      mergedResults.Button.usage,
      8,
      "Button usage should be summed to 8"
    );
    assert.strictEqual(
      mergedResults.Text.usage,
      8,
      "Text usage should remain 8"
    );
    assert.strictEqual(mergedResults.Div.usage, 4, "Div usage should be 4");

    // Check Button props are merged correctly
    assert.ok(mergedResults.Button?.props, "Button should have props");

    // Use type assertions to handle TypeScript's possibly undefined warnings
    const buttonProps = mergedResults.Button!.props;

    assert.strictEqual(
      buttonProps.variant!.usage,
      5,
      "Button variant prop usage should sum to 5"
    );
    const mergedVariantValues = Array.from(buttonProps.variant!.values).sort();
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
    assert.ok(mergedResults.Text?.props, "Text should have props");

    // Use type assertions for Text props
    const textProps = mergedResults.Text!.props;

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
    assert.ok(mergedResults.Div?.props, "Div should have props");

    // Use type assertions for Div props
    const divProps = mergedResults.Div!.props;

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
      import { Button, Text, Div, Box, Alert } from "@workleap/orbiter-ui";
      
      export function App() {
        return (
          <>
            <Text fontSize="14px">Text 1</Text>
            <Text fontSize="14px">Text 2</Text>
            <Div width="100px" height="200px" />
            <Button variant="primary" size="lg">Button 1</Button>
            <Button variant="primary" size="lg">Button 2</Button>
            <Button variant="primary" size="lg">Button 3</Button>
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check Button props have correct counts
    assert.strictEqual(
      analysisResults["Button"]!.props.variant?.usage,
      3,
      "Button variant prop should have 3 usages"
    );
    assert.strictEqual(
      analysisResults["Button"]!.props.size?.usage,
      3,
      "Button size prop should have 3 usages"
    );

    // Check Text props have correct counts
    assert.strictEqual(
      analysisResults["Text"]!.props.fontSize?.usage,
      2,
      "Text fontSize prop should have 2 usages"
    );

    // Check Div props have correct counts
    assert.strictEqual(
      analysisResults["Div"]!.props.width?.usage,
      1,
      "Div width prop should have 1 usage"
    );
    assert.strictEqual(
      analysisResults["Div"]!.props.height?.usage,
      1,
      "Div height prop should have 1 usage"
    );

    // Verify Button props are properly ordered by usage
    const buttonProps = Object.entries(analysisResults["Button"]!.props).map(
      ([name]) => name
    );

    // Both variant and size are used 3 times, so they should both be included early in the list
    assert.ok(
      buttonProps.indexOf("variant") < 2,
      "variant should be among the first Button props"
    );
    assert.ok(
      buttonProps.indexOf("size") < 2,
      "size should be among the first Button props"
    );

    // Verify Text props are properly ordered
    const textProps = Object.entries(analysisResults["Text"]!.props).map(
      ([name]) => name
    );

    // fontSize is used 2 times, so it should be first
    assert.strictEqual(
      textProps[0],
      "fontSize",
      "fontSize should be the first Text prop"
    );

    // Create a component with mixed prop usage for better testing
    const INPUT_WITH_MIXED_PROPS = `
      import { Button } from "@workleap/orbiter-ui";
      
      export function App() {
        return (
          <>
            <Button variant="primary" size="lg" onClick={() => {}} disabled>Button 1</Button>
            <Button variant="primary" size="lg" onClick={() => {}}>Button 2</Button>
            <Button variant="primary" size="lg">Button 3</Button>
          </>
        );
      }
    `;

    const { analysisResults: mixedResults } = analyze(
      getRuntime(INPUT_WITH_MIXED_PROPS),
      null
    );

    // Check prop counts with mixed usage
    assert.strictEqual(
      mixedResults["Button"]!.props.variant?.usage,
      3,
      "variant should be used 3 times"
    );
    assert.strictEqual(
      mixedResults["Button"]!.props.size?.usage,
      3,
      "size should be used 3 times"
    );
    assert.strictEqual(
      mixedResults["Button"]!.props.onClick?.usage,
      2,
      "onClick should be used 2 times"
    );
    assert.strictEqual(
      mixedResults["Button"]!.props.disabled?.usage,
      1,
      "disabled should be used 1 time"
    );

    // Get Button props sorted by usage
    const mixedButtonProps = Object.entries(mixedResults["Button"]!.props).map(
      ([name]) => name
    );

    // Props should be sorted by usage count (variant/size > onClick > disabled)
    assert.ok(
      mixedButtonProps.indexOf("variant") <= 1 &&
        mixedButtonProps.indexOf("size") <= 1,
      "variant and size should be first two props (tied at 3 usages each)"
    );
    assert.ok(
      mixedButtonProps.indexOf("onClick") === 2,
      "onClick should be the third prop (2 usages)"
    );
    assert.ok(
      mixedButtonProps.indexOf("disabled") === 3,
      "disabled should be the fourth prop (1 usage)"
    );
  });

  test("components are strictly ordered by usage count in the returned object", () => {
    const INPUT = `
      import { Div, Text, Button, Box, Alert } from "@workleap/orbiter-ui";
      
      export function App() {
        return (
          <>
            <Div width="100px">Div 1</Div>
            <Div height="100px">Div 2</Div>
            <Div padding="10px">Div 3</Div>
            <Div margin="20px">Div 4</Div>
            <Text>Text 1</Text>
            <Text>Text 2</Text>
            <Text>Text 3</Text>
            <Text>Text 3</Text>
            <Text>Text 3</Text>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
            <Box>Box</Box>
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Expected order by usage count: Text (5), Div (4), Button (2), Box (1)
    const componentNames = Object.keys(analysisResults);

    // First, verify we have all expected components
    assert.ok(analysisResults.Div, "Div component should exist");
    assert.ok(analysisResults.Text, "Text component should exist");
    assert.ok(analysisResults.Button, "Button component should exist");
    assert.ok(analysisResults.Box, "Box component should exist");

    // Verify component usage counts
    assert.strictEqual(
      analysisResults.Div.usage,
      4,
      "Div should have 4 usages"
    );
    assert.strictEqual(
      analysisResults.Text.usage,
      5,
      "Text should have 5 usages"
    );
    assert.strictEqual(
      analysisResults.Button.usage,
      2,
      "Button should have 2 usages"
    );
    assert.strictEqual(analysisResults.Box.usage, 1, "Box should have 1 usage");

    // Check the order of components
    assert.strictEqual(
      componentNames.length,
      4,
      "Should have exactly 4 components"
    );

    assert.strictEqual(
      componentNames[0],
      "Text",
      "Text should be second (5 usages)"
    );
    assert.strictEqual(
      componentNames[1],
      "Div",
      "Div should be first (4 usages)"
    );
    assert.strictEqual(
      componentNames[2],
      "Button",
      "Button should be third (2 usages)"
    );
    assert.strictEqual(
      componentNames[3],
      "Box",
      "Box should be fourth (1 usage)"
    );

    // Verify that Alert is not included (not used in JSX)
    assert.strictEqual(
      analysisResults.Alert,
      undefined,
      "Alert should not be included"
    );
  });
});

describe("JSON serialization", () => {
  test("correctly serializes and deserializes Set objects", () => {
    // Create a sample analysis result with Set objects
    const testResults: AnalysisResults = {
      Button: {
        usage: 5,
        props: {
          variant: {
            usage: 3,
            values: new Set(["primary", "secondary"]),
          },
        },
      },
    };

    // Serialize to JSON string using the shared utility functions
    const jsonString = JSON.stringify(testResults, setReplacer, 2);

    // Make sure the serialized representation includes our special format
    assert.ok(
      jsonString.includes('"values": ['),
      "Serialized JSON should contain values array"
    );

    // Parse back to object
    const parsedResults = JSON.parse(jsonString, setReviver) as AnalysisResults;

    // Verify the Button component exists
    assert.ok(
      parsedResults.Button,
      "Button component should exist in parsed results"
    );

    // Verify structure is preserved
    assert.strictEqual(
      parsedResults.Button!.usage,
      5,
      "Component usage count should be preserved"
    );

    // Verify the variant prop exists
    assert.ok(
      parsedResults.Button!.props.variant,
      "Button variant prop should exist"
    );

    // Most importantly, verify the Set was correctly restored
    assert.ok(
      parsedResults.Button!.props.variant!.values instanceof Set,
      "Values should be restored as a Set"
    );

    const restoredValues = Array.from(
      parsedResults.Button!.props.variant!.values
    );
    assert.strictEqual(restoredValues.length, 2, "Set should have 2 values");
    assert.ok(
      restoredValues.includes("primary") &&
        restoredValues.includes("secondary"),
      "Set should contain original values"
    );
  });
});
