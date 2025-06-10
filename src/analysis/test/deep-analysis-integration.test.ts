import assert from "node:assert";
import { describe, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze } from "../analyze.ts";

describe("deep analysis CLI integration", () => {
  test("deep analysis produces files property in values", () => {
    const INPUT = `
    import { Button, Text } from "@workleap/orbiter-ui";
    
    export function TestComponent() {
      return (
        <>
          <Button variant="primary" size="large">Primary Button</Button>
          <Button variant="secondary" size="large">Secondary Button</Button>
          <Text fontSize="14px">Some text</Text>
        </>
      );
    }`;

    // Test with deep analysis enabled
    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      deep: true,
      project: "test-project"
    });

    // Verify Button component analysis
    assert.ok(analysisResults.components.Button, "Button should be present");
    
    const variantValues = analysisResults.components.Button.props.variant?.values;
    assert.ok(variantValues, "Button variant values should exist");
    
    // Check primary variant
    const primaryValue = variantValues["primary"];
    assert.ok(primaryValue, "Primary variant should exist");
    assert.ok(primaryValue.files, "Primary variant should have files property");
    assert.strictEqual(primaryValue.files.length, 1, "Should have one file");
    assert.strictEqual(primaryValue.total, 1, "Primary should have total count of 1");
    assert.ok(primaryValue.projects, "Primary should have projects property");
    assert.strictEqual(primaryValue.projects["test-project"], 1, "Should track project count");
    
    // Check secondary variant
    const secondaryValue = variantValues["secondary"];
    assert.ok(secondaryValue, "Secondary variant should exist");
    assert.ok(secondaryValue.files, "Secondary variant should have files property");
    assert.strictEqual(secondaryValue.files.length, 1, "Should have one file");
    
    // Check size values (both buttons have "large" size)
    const sizeValues = analysisResults.components.Button.props.size?.values;
    assert.ok(sizeValues, "Button size values should exist");
    
    const largeValue = sizeValues["large"];
    assert.ok(largeValue, "Large size should exist");
    assert.ok(largeValue.files, "Large size should have files property");
    assert.strictEqual(largeValue.total, 2, "Large size should have total count of 2");
    assert.strictEqual(largeValue.files.length, 1, "Should have one file (no duplicates)");
    
    // Check Text component
    const textValues = analysisResults.components.Text?.props.fontSize?.values;
    assert.ok(textValues, "Text fontSize values should exist");
    
    const fontSize14Value = textValues["14px"];
    assert.ok(fontSize14Value, "14px fontSize should exist");
    assert.ok(fontSize14Value.files, "14px fontSize should have files property");
    assert.strictEqual(fontSize14Value.files.length, 1, "Should have one file");

  });
});
