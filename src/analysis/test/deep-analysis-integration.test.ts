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
    assert.strictEqual(largeValue.files.length, 2, "Should have two GitHub URLs for different lines");
    
    // Check Text component
    const textValues = analysisResults.components.Text?.props.fontSize?.values;
    assert.ok(textValues, "Text fontSize values should exist");
    
    const fontSize14Value = textValues["14px"];
    assert.ok(fontSize14Value, "14px fontSize should exist");
    assert.ok(fontSize14Value.files, "14px fontSize should have files property");
    assert.strictEqual(fontSize14Value.files.length, 1, "Should have one file");
  });
  
  test("deep analysis includes all GitHub URLs when same value appears on different lines", () => {
    const INPUT = `
import { Button } from "@workleap/orbiter-ui";

export function TestComponent() {
  return (
    <>
      <Button variant="primary">First Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="primary">Second Primary Button</Button>
      <Button variant="tertiary">Tertiary Button</Button>
      <Button variant="primary">Third Primary Button</Button>
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
    
    // Check primary variant that appears on 3 different lines
    const primaryValue = variantValues["primary"];
    assert.ok(primaryValue, "Primary variant should exist");
    assert.ok(primaryValue.files, "Primary variant should have files property");
    assert.strictEqual(primaryValue.total, 3, "Primary should have total count of 3");
    assert.strictEqual(primaryValue.files.length, 3, "Should have three GitHub URLs for different lines");
    
    // Verify all URLs are GitHub URLs with line numbers and are different
    primaryValue.files.forEach((file, index) => {
      assert.ok(file.includes("github.com"), `File ${index + 1} should be a GitHub URL`);
      assert.ok(file.includes("#L"), `File ${index + 1} should include line number`);
    });
    
    // Verify URLs are different (different line numbers)
    const uniqueUrls = new Set(primaryValue.files);
    assert.strictEqual(uniqueUrls.size, 3, "All three GitHub URLs should be unique");
    
    // Check secondary variant that appears only once
    const secondaryValue = variantValues["secondary"];
    assert.ok(secondaryValue, "Secondary variant should exist");
    assert.ok(secondaryValue.files, "Secondary variant should have files property");
    assert.strictEqual(secondaryValue.total, 1, "Secondary should have total count of 1");
    assert.strictEqual(secondaryValue.files.length, 1, "Should have one GitHub URL");
    
    // Check tertiary variant that appears only once
    const tertiaryValue = variantValues["tertiary"];
    assert.ok(tertiaryValue, "Tertiary variant should exist");
    assert.ok(tertiaryValue.files, "Tertiary variant should have files property");
    assert.strictEqual(tertiaryValue.total, 1, "Tertiary should have total count of 1");
    assert.strictEqual(tertiaryValue.files.length, 1, "Should have one GitHub URL");
  });
});
