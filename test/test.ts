import jscodeshift, { type API } from "jscodeshift";
import assert from "node:assert";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, test } from "vitest";
import transform from "../src/index.js";
import { mappings as initialMappings, mappings } from "../src/mappings.js";
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
