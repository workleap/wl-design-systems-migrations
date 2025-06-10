import { describe, expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze } from "../analyze.ts";

describe("full file path verification", () => {
  test("deep analysis captures full file paths, not just filenames", () => {
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

    // This should be the full path, not just "TestComponent.tsx"
    expect(primaryValue?.files?.[0]).toBe("/Users/test/project/src/components/TestComponent.tsx");
    expect(primaryValue?.files?.[0]).not.toBe("TestComponent.tsx");

    // Verify Text fontSize files
    const textFontSizeValues = analysisResults.components.Text?.props.fontSize?.values;
    expect(textFontSizeValues).toBeDefined();

    const fontSize14Value = textFontSizeValues!["14px"];
    expect(fontSize14Value).toBeDefined();
    expect(fontSize14Value?.files).toBeDefined();
    expect(fontSize14Value?.files?.[0]).toBe("/Users/test/project/src/components/TestComponent.tsx");
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
    expect(secondaryValue?.files?.[0]).toBe("./src/App.tsx");
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
    expect(tertiaryValue?.files?.[0]).toBe("C:\\Users\\developer\\project\\src\\components\\WindowsComponent.tsx");
  });
});
