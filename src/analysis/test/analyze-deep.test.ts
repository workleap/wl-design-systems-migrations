import assert from "node:assert";
import { describe, expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze } from "../analyze.ts";

describe("analyze - deep analysis", () => {
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

    const primaryValue = variantValues["primary"];
    assert.ok(primaryValue, "Primary variant should exist");
    assert.ok(primaryValue.files, "Primary variant should have files property");
    assert.ok(Array.isArray(primaryValue.files), "Files should be an array");
    assert.strictEqual(primaryValue.files.length, 1, "Should have one GitHub URL");

    const secondaryValue = variantValues["secondary"];
    assert.ok(secondaryValue, "Secondary variant should exist");
    assert.ok(secondaryValue.files, "Secondary variant should have files property");
    assert.strictEqual(secondaryValue.files.length, 1, "Should have one GitHub URL");

    // Verify the files contain GitHub URLs with line numbers
    assert.ok(primaryValue.files[0]!.includes("github.com"), "Should contain GitHub URL");
    assert.ok(primaryValue.files[0]!.includes("#L"), "Should contain line number");
    assert.ok(secondaryValue.files[0]!.includes("github.com"), "Should contain GitHub URL");
    assert.ok(secondaryValue.files[0]!.includes("#L"), "Should contain line number");

    // Verify size property (appears on both buttons)
    const sizeValues = analysisResults.components.Button.props.size?.values;
    assert.ok(sizeValues, "Button size values should exist");
    
    const largeValue = sizeValues["large"];
    assert.ok(largeValue, "Large size should exist");
    assert.ok(largeValue.files, "Large size should have files property");
    assert.strictEqual(largeValue.files.length, 2, "Should have two GitHub URLs (one for each button)");
  });

  test("deep analysis includes all GitHub URLs when same value appears on different lines", () => {
    const INPUT = `
    import { Button } from "@workleap/orbiter-ui";
    
    export function TestComponent() {
      return (
        <>
          <Button size="large">First Large Button</Button>
          <Button variant="primary">Primary Button</Button>
          <Button size="large">Second Large Button</Button>
        </>
      );
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      deep: true,
      project: "test-project"
    });

    const sizeValues = analysisResults.components.Button?.props.size?.values;
    assert.ok(sizeValues, "Button size values should exist");

    const largeValue = sizeValues["large"];
    assert.ok(largeValue, "Large size should exist");
    assert.ok(largeValue.files, "Large size should have files property");
    assert.strictEqual(largeValue.files.length, 2, "Should have two GitHub URLs for two different occurrences");

    // Both URLs should be different (different line numbers)
    assert.notStrictEqual(largeValue.files[0], largeValue.files[1], "URLs should be different (different lines)");
    
    // Both should contain GitHub URLs with line numbers
    largeValue.files.forEach((url, index) => {
      assert.ok(url.includes("github.com"), `URL ${index + 1} should contain GitHub URL`);
      assert.ok(url.includes("#L"), `URL ${index + 1} should contain line number`);
    });
  });

  test("deep analysis captures full file paths in GitHub URLs", () => {
    const INPUT = `
    import { Button, Text } from "@workleap/orbiter-ui";
    
    export function TestComponent() {
      return (
        <>
          <Button variant="primary" size="large">Primary Button</Button>
          <Text fontSize="14px">Some text</Text>
        </>
      );
    }`;

    // Create a runtime with a specific file path to test
    const runtime = getRuntime(INPUT);
    // Override the filePath to simulate a real file path
    runtime.filePath = "/Users/test/project/src/components/TestComponent.tsx";

    const { analysisResults } = analyze(runtime, null, {
      deep: true,
      project: "test-project"
    });

    // Verify Button variant files
    const buttonVariantValues = analysisResults.components.Button?.props.variant?.values;
    expect(buttonVariantValues).toBeDefined();

    const primaryValue = buttonVariantValues!["primary"];
    expect(primaryValue).toBeDefined();
    expect(primaryValue?.files).toBeDefined();
    expect(Array.isArray(primaryValue?.files)).toBe(true);
    expect(primaryValue?.files).toHaveLength(1);

    // The system now generates GitHub URLs with line numbers
    // This should be a GitHub URL containing the full path, not just "TestComponent.tsx"
    expect(primaryValue?.files?.[0]).toContain("/Users/test/project/src/components/TestComponent.tsx");
    expect(primaryValue?.files?.[0]).toContain("#L");
    expect(primaryValue?.files?.[0]).not.toBe("TestComponent.tsx");

    // Verify Text fontSize files
    const textFontSizeValues = analysisResults.components.Text?.props.fontSize?.values;
    expect(textFontSizeValues).toBeDefined();

    const fontSize14Value = textFontSizeValues!["14px"];
    expect(fontSize14Value).toBeDefined();
    expect(fontSize14Value?.files).toBeDefined();
    expect(fontSize14Value?.files?.[0]).toContain("/Users/test/project/src/components/TestComponent.tsx");
  });

  test("deep analysis captures relative paths correctly", () => {
    const INPUT = `
    import { Button } from "@workleap/orbiter-ui";
    
    export function App() {
      return <Button variant="secondary">Secondary Button</Button>;
    }`;

    const runtime = getRuntime(INPUT);
    // Test with relative path
    runtime.filePath = "./src/App.tsx";

    const { analysisResults } = analyze(runtime, null, {
      deep: true
    });

    const buttonVariantValues = analysisResults.components.Button?.props.variant?.values;
    const secondaryValue = buttonVariantValues!["secondary"];
    
    expect(secondaryValue).toBeDefined();
    expect(secondaryValue?.files).toBeDefined();
    // The system generates GitHub URLs when in a git repository, so check for the path within the URL
    expect(secondaryValue?.files?.[0]).toContain("./src/App.tsx");
  });

  test("deep analysis captures Windows-style paths correctly", () => {
    const INPUT = `
    import { Button } from "@workleap/orbiter-ui";
    
    export function WindowsComponent() {
      return <Button variant="tertiary">Tertiary Button</Button>;
    }`;

    const runtime = getRuntime(INPUT);
    // Test with Windows-style path
    runtime.filePath = "C:\\Users\\developer\\project\\src\\components\\WindowsComponent.tsx";

    const { analysisResults } = analyze(runtime, null, {
      deep: true
    });

    const buttonVariantValues = analysisResults.components.Button?.props.variant?.values;
    const tertiaryValue = buttonVariantValues!["tertiary"];
    
    expect(tertiaryValue).toBeDefined();
    expect(tertiaryValue?.files).toBeDefined();
    // The system generates GitHub URLs when in a git repository, so check for the path within the URL
    expect(tertiaryValue?.files?.[0]).toContain("C:\\Users\\developer\\project\\src\\components\\WindowsComponent.tsx");
  });

  test("non-deep analysis does not include files property", () => {
    const INPUT = `
    import { Button } from "@workleap/orbiter-ui";
    
    export function TestComponent() {
      return <Button variant="primary">Primary Button</Button>;
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      deep: false,
      project: "test-project"
    });

    const variantValues = analysisResults.components.Button?.props.variant?.values;
    const primaryValue = variantValues!["primary"];
    
    expect(primaryValue).toBeDefined();
    expect(primaryValue?.files).toBeUndefined();
  });
});
