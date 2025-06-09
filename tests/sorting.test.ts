import { describe, expect, test } from "vitest";
import { analyze, customStringify, getSortedKeys, mergeAnalysisResults } from "../src/analysis/analyze.ts";
import { getRuntime } from "./utils.ts";

describe("sorting verification", () => {
  test("mergeAnalysisResults produces sorted output", () => {
    const INPUT1 = `
      import { Flex, Button } from "@workleap/orbiter-ui";
      export function App1() {
        return (
          <>
            <Flex gap="40" direction="column" />
            <Button variant="primary" />
          </>
        );
      }
    `;

    const INPUT2 = `
      import { Flex, Button, Text } from "@workleap/orbiter-ui";
      export function App2() {
        return (
          <>
            <Flex gap="80" direction="row" />
            <Flex alignItems="center" />
            <Button variant="secondary" />
            <Text fontSize="14px" />
          </>
        );
      }
    `;

    const { analysisResults: results1 } = analyze(getRuntime(INPUT1), null);
    const { analysisResults: results2 } = analyze(getRuntime(INPUT2), null);

    const merged = mergeAnalysisResults(results1, results2);

    // Components should be sorted by usage count
    const componentNames = Object.keys(merged.components);
    const componentUsages = componentNames.map(name => merged.components[name]!.usage);
    
    // Flex: 3 usages, Button: 2 usages, Text: 1 usage
    expect(componentNames[0]).toBe("Flex");
    expect(componentUsages[0]).toBe(3);
    expect(componentNames[1]).toBe("Button");
    expect(componentUsages[1]).toBe(2);
    expect(componentNames[2]).toBe("Text");
    expect(componentUsages[2]).toBe(1);

    // Props should be sorted by usage count
    const flexComponent = merged.components.Flex!;
    const flexProps = Object.keys(flexComponent.props);
    const flexPropUsages = flexProps.map(prop => flexComponent.props[prop]!.usage);
    
    // gap: 2 usages, direction: 2 usages, alignItems: 1 usage
    // For equal usage, they could be in any order but let's check that higher usage comes first
    expect(flexPropUsages[0]!).toBeGreaterThanOrEqual(flexPropUsages[1]!);
    expect(flexPropUsages[1]!).toBeGreaterThanOrEqual(flexPropUsages[2]!);

    console.log("Merged components order:", componentNames);
    console.log("Merged Flex props order:", flexProps);
    console.log("Merged Flex prop usages:", flexPropUsages);
  });
});

describe("getSortedKeys", () => {
  test("sorts values by total count descending", () => {
    const valuesObject = {
      "string-value": { total: 100, project1: 50, project2: 50 },
      "10": { total: 80, project1: 40, project2: 40 },
      "another-string": { total: 120, project1: 60, project2: 60 },
      "5": { total: 60, project1: 30, project2: 30 }
    };

    const result = getSortedKeys("values", valuesObject);
    
    // Should be sorted by total count descending
    expect(result).toEqual(["another-string", "string-value", "10", "5"]);
  });

  test("sorts values with numeric keys having less total at the end", () => {
    const valuesObject = {
      "primary": { total: 150, project1: 75, project2: 75 },
      "secondary": { total: 120, project1: 60, project2: 60 },
      "1": { total: 30, project1: 15, project2: 15 }, // Numeric key with low total
      "0": { total: 25, project1: 12, project2: 13 }, // Numeric key with low total
      "tertiary": { total: 80, project1: 40, project2: 40 },
      "2": { total: 35, project1: 17, project2: 18 } // Numeric key with low total
    };

    const result = getSortedKeys("values", valuesObject);
    
    // Should be sorted by total count descending, regardless of key type
    expect(result).toEqual(["primary", "secondary", "tertiary", "2", "1", "0"]);
  });

  test("sorts props by usage count descending", () => {
    const propsObject = {
      "variant": { usage: 100, values: {} },
      "size": { usage: 150, values: {} },
      "disabled": { usage: 50, values: {} }
    };

    const result = getSortedKeys("props", propsObject);
    
    expect(result).toEqual(["size", "variant", "disabled"]);
  });

  test("sorts components by usage count descending", () => {
    const componentsObject = {
      "Button": { usage: 200, props: {} },
      "Text": { usage: 50, props: {} },
      "Flex": { usage: 300, props: {} }
    };

    const result = getSortedKeys("components", componentsObject);
    
    expect(result).toEqual(["Flex", "Button", "Text"]);
  });

  test("returns object keys in original order for unknown key types", () => {
    const unknownObject = {
      "z": "value1",
      "a": "value2",
      "m": "value3"
    };

    const result = getSortedKeys("unknown", unknownObject);
    
    // Should return keys in original object order
    expect(result).toEqual(["z", "a", "m"]);
  });

  test("handles empty objects", () => {
    expect(getSortedKeys("values", {})).toEqual([]);
    expect(getSortedKeys("props", {})).toEqual([]);
    expect(getSortedKeys("components", {})).toEqual([]);
  });
});

describe("customStringify", () => {
  test("formats simple object with proper indentation", () => {
    const obj = { name: "test", value: 42 };
    const result = customStringify(obj);
    
    expect(result).toBe(`{
  "name": "test",
  "value": 42
}`);
  });

  test("formats values object with proper sorting", () => {
    const obj = {
      values: {
        "high-usage": { total: 100, project1: 50 },
        "1": { total: 30, project1: 15 }, // Numeric key with lower total
        "medium-usage": { total: 70, project1: 35 },
        "0": { total: 20, project1: 10 } // Numeric key with lowest total
      }
    };

    const result = customStringify(obj);
    
    // Should sort values by total count, numeric keys should be at the end based on their total
    expect(result).toContain("\"high-usage\"");
    expect(result).toContain("\"medium-usage\"");
    expect(result).toContain("\"1\"");
    expect(result).toContain("\"0\"");
    
    // Check that the order is correct by looking at positions
    const highIndex = result.indexOf("\"high-usage\"");
    const mediumIndex = result.indexOf("\"medium-usage\"");
    const oneIndex = result.indexOf("\"1\"");
    const zeroIndex = result.indexOf("\"0\"");
    
    expect(highIndex).toBeLessThan(mediumIndex);
    expect(mediumIndex).toBeLessThan(oneIndex);
    expect(oneIndex).toBeLessThan(zeroIndex);
  });

  test("formats props object with proper sorting", () => {
    const obj = {
      props: {
        "variant": { usage: 100, values: {} },
        "size": { usage: 150, values: {} },
        "disabled": { usage: 50, values: {} }
      }
    };

    const result = customStringify(obj);
    
    // Should sort props by usage count
    const sizeIndex = result.indexOf("\"size\"");
    const variantIndex = result.indexOf("\"variant\"");
    const disabledIndex = result.indexOf("\"disabled\"");
    
    expect(sizeIndex).toBeLessThan(variantIndex);
    expect(variantIndex).toBeLessThan(disabledIndex);
  });

  test("formats components object with proper sorting", () => {
    const obj = {
      components: {
        "Button": { usage: 200, props: {} },
        "Text": { usage: 50, props: {} },
        "Flex": { usage: 300, props: {} }
      }
    };

    const result = customStringify(obj);
    
    // Should sort components by usage count
    const flexIndex = result.indexOf("\"Flex\"");
    const buttonIndex = result.indexOf("\"Button\"");
    const textIndex = result.indexOf("\"Text\"");
    
    expect(flexIndex).toBeLessThan(buttonIndex);
    expect(buttonIndex).toBeLessThan(textIndex);
  });

  test("handles complex nested structures", () => {
    const obj = {
      components: {
        "Button": {
          usage: 100,
          props: {
            "variant": {
              usage: 80,
              values: {
                "primary": { total: 50, project1: 25 },
                "1": { total: 20, project1: 10 }, // Numeric key
                "secondary": { total: 30, project1: 15 }
              }
            },
            "size": {
              usage: 90,
              values: {
                "medium": { total: 60, project1: 30 },
                "large": { total: 30, project1: 15 }
              }
            }
          }
        }
      }
    };

    const result = customStringify(obj);
    
    // Should be valid JSON-like structure
    expect(result).toContain("\"Button\"");
    expect(result).toContain("\"usage\": 100");
    expect(result).toContain("\"props\"");
    
    // Props should be sorted by usage (size: 90, variant: 80)
    const sizeIndex = result.indexOf("\"size\"");
    const variantIndex = result.indexOf("\"variant\"");
    expect(sizeIndex).toBeLessThan(variantIndex);
    
    // Values should be sorted by total count
    const primaryIndex = result.indexOf("\"primary\"");
    const secondaryIndex = result.indexOf("\"secondary\"");
    const oneIndex = result.indexOf("\"1\"");
    expect(primaryIndex).toBeLessThan(secondaryIndex);
    expect(secondaryIndex).toBeLessThan(oneIndex);
  });

  test("handles empty objects and arrays", () => {
    expect(customStringify({})).toBe("{}");
    expect(customStringify([])).toBe("[]");
    expect(customStringify({ empty: {} })).toBe(`{
  "empty": {}
}`);
    expect(customStringify({ emptyArray: [] })).toBe(`{
  "emptyArray": []
}`);
  });

  test("handles mixed data types correctly", () => {
    const obj = {
      string: "test",
      number: 42,
      boolean: true,
      nullValue: null,
      array: [1, "two", false],
      nested: {
        inner: "value"
      }
    };

    const result = customStringify(obj);
    
    expect(result).toContain("\"string\": \"test\"");
    expect(result).toContain("\"number\": 42");
    expect(result).toContain("\"boolean\": true");
    expect(result).toContain("\"nullValue\": null");
    expect(result).toContain("\"array\"");
    expect(result).toContain("\"nested\"");
  });

  test("respects custom indentation", () => {
    const obj = { a: { b: "value" } };
    const result = customStringify(obj, 4);
    
    // Should use 4 spaces for indentation
    expect(result).toContain("    \"a\""); // 4 spaces
    expect(result).toContain("        \"b\""); // 8 spaces
  });
});
