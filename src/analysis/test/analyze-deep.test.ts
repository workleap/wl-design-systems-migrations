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
    assert.strictEqual(primaryValue.files.length, 1, "Should have one repository URL");

    const secondaryValue = variantValues["secondary"];
    assert.ok(secondaryValue, "Secondary variant should exist");
    assert.ok(secondaryValue.files, "Secondary variant should have files property");
    assert.strictEqual(secondaryValue.files.length, 1, "Should have one repository URL");

    // Verify the files contain repository URLs with line numbers (GitHub or Azure DevOps)
    const primaryUrl = primaryValue.files[0]!;
    const secondaryUrl = secondaryValue.files[0]!;
    
    // Should contain either GitHub or Azure DevOps URL, or fallback to file path with line number
    assert.ok(
      primaryUrl.includes("github.com") || primaryUrl.includes("dev.azure.com") || primaryUrl.includes("visualstudio.com") || primaryUrl.includes("#L"),
      "Should contain repository URL or line number"
    );
    assert.ok(
      secondaryUrl.includes("github.com") || secondaryUrl.includes("dev.azure.com") || secondaryUrl.includes("visualstudio.com") || secondaryUrl.includes("#L"),
      "Should contain repository URL or line number"
    );

    // Verify size property (appears on both buttons)
    const sizeValues = analysisResults.components.Button.props.size?.values;
    assert.ok(sizeValues, "Button size values should exist");
    
    const largeValue = sizeValues["large"];
    assert.ok(largeValue, "Large size should exist");
    assert.ok(largeValue.files, "Large size should have files property");
    assert.strictEqual(largeValue.files.length, 2, "Should have two repository URLs (one for each button)");
  });

  test("deep analysis includes all repository URLs when same value appears on different lines", () => {
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
    assert.strictEqual(largeValue.files.length, 2, "Should have two repository URLs for two different occurrences");

    // Both URLs should be different (different line numbers)
    assert.notStrictEqual(largeValue.files[0], largeValue.files[1], "URLs should be different (different lines)");
    
    // Both should contain repository URLs with line numbers (GitHub, Azure DevOps, or file paths)
    largeValue.files.forEach((url, index) => {
      const hasRepoUrl = url.includes("github.com") || url.includes("dev.azure.com") || url.includes("visualstudio.com");
      const hasLineNumber = url.includes("#L") || url.includes("&line=");
      assert.ok(hasRepoUrl || hasLineNumber, `URL ${index + 1} should contain repository URL or line number`);
    });
  });

  test("deep analysis captures full file paths in repository URLs", () => {
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

    // The system now generates repository URLs with line numbers when in a real git repo
    // For mock paths that don't exist in git repos, it falls back to file path
    // This should contain the full path, not just "TestComponent.tsx"
    expect(primaryValue?.files?.[0]).toContain("/Users/test/project/src/components/TestComponent.tsx");
    expect(primaryValue?.files?.[0]).not.toBe("TestComponent.tsx");
    
    // If it's a repository URL, it should contain line numbers; otherwise it's just the file path
    const isRepoUrl = primaryValue?.files?.[0]?.includes("github.com") || 
                      primaryValue?.files?.[0]?.includes("dev.azure.com") || 
                      primaryValue?.files?.[0]?.includes("visualstudio.com");
    if (isRepoUrl) {
      expect(primaryValue?.files?.[0]).toMatch(/#L|&line=/); // Should contain line number in GitHub or Azure format
    }

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
    // The system generates repository URLs when in a git repository, so check for the path within the URL
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
    // The system generates repository URLs when in a git repository, so check for the path within the URL
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
