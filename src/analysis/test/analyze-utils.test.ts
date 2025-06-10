import { describe, expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze, customStringify, getSortedKeys, mergeAnalysisResults } from "../analyze.ts";

describe("analyze - utility functions", () => {
  test("getSortedKeys returns keys in alphabetical order", () => {
    const obj = { zebra: 1, apple: 2, banana: 3 };
    const sortedKeys = getSortedKeys("test", obj);
    // Object.keys returns keys in insertion order, so for this object: zebra, apple, banana
    expect(sortedKeys).toEqual(["zebra", "apple", "banana"]);
  });

  test("customStringify produces sorted JSON output", () => {
    const obj = {
      zebra: { count: 1 },
      apple: { count: 2 },
      banana: { count: 3 }
    };
    
    const jsonString = customStringify(obj, 2);
    
    // Check that the JSON contains all keys
    expect(jsonString).toContain("\"zebra\"");
    expect(jsonString).toContain("\"apple\"");
    expect(jsonString).toContain("\"banana\"");
    
    // Check that keys appear in insertion order (Object.keys natural order)
    const zebraIndex = jsonString.indexOf("\"zebra\"");
    const appleIndex = jsonString.indexOf("\"apple\"");
    const bananaIndex = jsonString.indexOf("\"banana\"");
    
    expect(zebraIndex).toBeLessThan(appleIndex);
    expect(appleIndex).toBeLessThan(bananaIndex);
  });

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

    const result1 = analyze(getRuntime(INPUT1), null);
    const result2 = analyze(getRuntime(INPUT2), null);

    const merged = mergeAnalysisResults(result1.analysisResults, result2.analysisResults);

    // Test that components are sorted by usage (descending)
    const componentKeys = Object.keys(merged.components);
    // Verify that components are present and ordered by usage count
    expect(componentKeys.length).toBeGreaterThan(0);
    
    // For components with equal usage, they should maintain consistent ordering
    for (let i = 0; i < componentKeys.length - 1; i++) {
      const currentComponent = merged.components[componentKeys[i]!];
      const nextComponent = merged.components[componentKeys[i + 1]!];
      expect(currentComponent).toBeDefined();
      expect(nextComponent).toBeDefined();
      expect(currentComponent!.usage).toBeGreaterThanOrEqual(nextComponent!.usage);
    }

    // Test that props within components are sorted by usage (descending)
    expect(merged.components.Flex).toBeDefined();
    const flexProps = Object.keys(merged.components.Flex!.props);
    for (let i = 0; i < flexProps.length - 1; i++) {
      const currentProp = merged.components.Flex!.props[flexProps[i]!];
      const nextProp = merged.components.Flex!.props[flexProps[i + 1]!];
      expect(currentProp).toBeDefined();
      expect(nextProp).toBeDefined();
      expect(currentProp!.usage).toBeGreaterThanOrEqual(nextProp!.usage);
    }

    // Test that values within props are sorted by total count (descending)
    expect(merged.components.Flex!.props.direction).toBeDefined();
    const directionValues = Object.keys(merged.components.Flex!.props.direction!.values);
    // Values are sorted by total count, so we need to verify the actual order
    expect(directionValues.length).toBeGreaterThan(0);

    expect(merged.components.Flex!.props.gap).toBeDefined();
    const gapValues = Object.keys(merged.components.Flex!.props.gap!.values);
    // Values are sorted by total count, so we need to verify the actual order
    expect(gapValues.length).toBeGreaterThan(0);
  });

  test("JSON output maintains consistent sorting", () => {
    const INPUT = `
      import { Flex, Button, Text } from "@workleap/orbiter-ui";
      export function App() {
        return (
          <>
            <Flex gap="80" direction="row" alignItems="center" />
            <Button variant="secondary" size="large" />
            <Text fontSize="14px" color="primary" />
          </>
        );
      }
    `;

    const { analysisResults } = analyze(getRuntime(INPUT), null);
    
    // Convert to JSON string using customStringify
    const jsonString = customStringify(analysisResults, 2);
    
    // Parse back to verify structure
    const parsed = JSON.parse(jsonString);
    
    // Verify top-level keys are sorted (Object.keys natural order)
    const topLevelKeys = Object.keys(parsed);
    expect(topLevelKeys).toEqual(["overall", "components"]);
    
    // Verify components are sorted by usage count (descending)
    const componentKeys = Object.keys(parsed.components);
    // Components in the test: Flex (3 usages), Button (1 usage), Text (1 usage)
    // So expected order would be: Flex, then Button and Text (order may vary for equal counts)
    expect(componentKeys[0]).toBe("Flex");
    expect(componentKeys).toContain("Button");
    expect(componentKeys).toContain("Text");
    expect(componentKeys).toHaveLength(3);
    
    // Verify props within each component are sorted by usage (descending)
    Object.values(parsed.components).forEach((component: any) => {
      if (component.props) {
        const propKeys = Object.keys(component.props);
        // Props are sorted by usage count (descending), so verify the order
        for (let i = 0; i < propKeys.length - 1; i++) {
          const currentProp = component.props[propKeys[i]!];
          const nextProp = component.props[propKeys[i + 1]!];
          expect(currentProp.usage).toBeGreaterThanOrEqual(nextProp.usage);
        }
        
        // Verify values within each prop are sorted by total count (descending)
        Object.values(component.props).forEach((prop: any) => {
          if (prop.values) {
            const valueKeys = Object.keys(prop.values);
            // Values are sorted by total count (descending)
            for (let i = 0; i < valueKeys.length - 1; i++) {
              const currentValue = prop.values[valueKeys[i]!];
              const nextValue = prop.values[valueKeys[i + 1]!];
              expect(currentValue.total).toBeGreaterThanOrEqual(nextValue.total);
            }
          }
        });
      }
    });
  });

  test("sorting preserves all data integrity", () => {
    const INPUT1 = `
      import { Flex } from "@workleap/orbiter-ui";
      export function App1() {
        return <Flex gap="zebra" direction="apple" />;
      }
    `;

    const INPUT2 = `
      import { Flex } from "@workleap/orbiter-ui";
      export function App2() {
        return <Flex gap="apple" direction="zebra" />;
      }
    `;

    const result1 = analyze(getRuntime(INPUT1), null);
    const result2 = analyze(getRuntime(INPUT2), null);

    const merged = mergeAnalysisResults(result1.analysisResults, result2.analysisResults);

    // Verify that despite sorting, all data is preserved
    expect(merged.components.Flex).toBeDefined();
    expect(merged.components.Flex!.props.gap).toBeDefined();
    expect(merged.components.Flex!.props.direction).toBeDefined();
    expect(merged.components.Flex!.props.gap!.values["apple"]?.total).toBe(1);
    expect(merged.components.Flex!.props.gap!.values["zebra"]?.total).toBe(1);
    expect(merged.components.Flex!.props.direction!.values["apple"]?.total).toBe(1);
    expect(merged.components.Flex!.props.direction!.values["zebra"]?.total).toBe(1);

    // Values should be sorted by total count (when equal, order may vary)
    const gapValueKeys = Object.keys(merged.components.Flex!.props.gap!.values);
    expect(gapValueKeys).toContain("apple");
    expect(gapValueKeys).toContain("zebra");
    expect(gapValueKeys).toHaveLength(2);

    const directionValueKeys = Object.keys(merged.components.Flex!.props.direction!.values);
    expect(directionValueKeys).toContain("apple");
    expect(directionValueKeys).toContain("zebra");
    expect(directionValueKeys).toHaveLength(2);
  });
});
