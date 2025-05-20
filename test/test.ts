import jscodeshift, { type API } from "jscodeshift";
import assert from "node:assert";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, test } from "vitest";
import transform from "../src/index.js";
import { mappings as initialMappings, mappings } from "../src/mappings.js";
import { analyze, mergeAnalysisResults } from "../src/utils/analyze.js";
import { migrate } from "../src/utils/migrate.js";
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
  };
};

describe("o2h-migration", () => {
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

  test("when there is already an import for Hopper, add the migrated one to it", async () => {
    const INPUT = `import { Div } from "@workleap/orbiter-ui";import { Span } from "@hopper-ui/components";`;
    const OUTPUT = `import { Span, Div } from "@hopper-ui/components";`;

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when a component has similar name, Don't touch it.", async () => {
    const INPUT = `import { Div as Div2 } from "@workleap/orbiter-ui"; import { Div } from "external"; export function App() { return <><Div width="120px" height="auto" /><Div2/></>; }`;
    const OUTPUT = `import { Div } from "external"; import { Div as Div2 } from "@hopper-ui/components"; export function App() { return <><Div width="120px" height="auto" /><Div2/></>; }`;

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when an Orbiter component has attributes, used the map table to migrate them.", async () => {
    const INPUT = `import { Div } from "@workleap/orbiter-ui"; export function App() { return <Div width="120px" height="auto" />; }`;
    const OUTPUT = `import { Div } from "@hopper-ui/components"; export function App() { return <Div UNSAFE_width="120px" UNSAFE_height="auto" />; }`;

    const actualOutput = migrate(getRuntime(INPUT));

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
              width: () => null,
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
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });
});

describe("component usage analysis", () => {
  test("analyze basic component usage", () => {
    const INPUT = `import { Div, Text } from "@workleap/orbiter-ui"; export function App() { return <><Div border="1px" width="120px" /><Text fontSize="14px" /></>; }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Check that the results are in the expected JSON format
    assert.ok(
      analysisResults.Div,
      "Div component should be present in results"
    );
    assert.ok(
      analysisResults.Text,
      "Text component should be present in results"
    );
    assert.deepEqual([...analysisResults.Div].sort(), ["border", "width"]);
    assert.deepEqual(analysisResults.Text, ["fontSize"]);
  });

  test("analyze component with alias", () => {
    const INPUT = `import { Div as CustomDiv, Text } from "@workleap/orbiter-ui"; export function App() { return <CustomDiv border="1px" width="120px" />; }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    const expectedResults = {
      Div: ["border", "width"],
    };

    assert.deepEqual(analysisResults, expectedResults);
  });

  test("analyze includes non-mapped components", () => {
    const INPUT = `import { UnknownComponent } from "@workleap/orbiter-ui"; export function App() { return <UnknownComponent prop1="value" prop2="value" />; }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    // Should include the unknown component and its props
    assert.ok(
      analysisResults.UnknownComponent,
      "UnknownComponent should be present in results"
    );
    assert.deepEqual(
      new Set(analysisResults.UnknownComponent),
      new Set(["prop1", "prop2"])
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

    const expectedResults = {
      Div: ["width", "height", "maxWidth"],
      Text: ["fontSize", "fontWeight"],
    };

    // Use a deep comparison that doesn't care about array order
    assert.deepEqual(
      Object.keys(analysisResults).sort(),
      Object.keys(expectedResults).sort()
    );

    // Check each array separately to handle unsorted arrays
    assert.ok(
      analysisResults.Div,
      "Div component should be present in results"
    );
    assert.ok(
      analysisResults.Text,
      "Text component should be present in results"
    );
    assert.deepEqual(
      new Set(analysisResults.Div),
      new Set(expectedResults.Div)
    );
    assert.deepEqual(
      new Set(analysisResults.Text),
      new Set(expectedResults.Text)
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
    assert.deepEqual(
      new Set(analysisResults.CustomComponent),
      new Set(["prop1", "prop2"])
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
    assert.ok(
      analysisResults.Button,
      "Button component should be present in results"
    );
    assert.ok(
      analysisResults.Text,
      "Text component should be present in results"
    );
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
});

describe("analyze file aggregation", () => {
  test("mergeAnalysisResults combines component props correctly", () => {
    const existingResults = {
      Button: ["variant", "size", "disabled"],
      Text: ["fontSize", "color"],
    };

    const newResults = {
      Button: ["variant", "onClick", "aria-label"],
      Div: ["width", "padding"],
    };

    const mergedResults = mergeAnalysisResults(existingResults, newResults);

    // Check that Button props are merged correctly with duplicates removed
    assert.deepEqual(
      new Set(mergedResults.Button),
      new Set(["variant", "size", "disabled", "onClick", "aria-label"]),
      "Button props should be merged without duplicates"
    );

    // Check that Text props remain unchanged
    assert.deepEqual(
      mergedResults.Text,
      ["fontSize", "color"],
      "Text props should remain unchanged"
    );

    // Check that Div is added correctly
    assert.deepEqual(
      mergedResults.Div,
      ["width", "padding"],
      "Div props should be added to the merged results"
    );
  });
});
