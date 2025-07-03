import { expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze } from "../analyze.ts";

test("analyze should include both components and functions", () => {
  const sourceCode = `
    import { Div, useResponsive } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const responsive = useResponsive();
      const responsive2 = useResponsive(false);
      
      return <Div border="1px" width="120px" />;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const { analysisResults } = analyze(runtime, null);

  // Should have both components and functions
  expect(analysisResults.components).toBeDefined();
  expect(analysisResults.functions).toBeDefined();

  // Should track component usage
  expect(analysisResults.components.Div).toBeDefined();
  expect(analysisResults.components.Div!.usage.total).toBe(1);
  expect(analysisResults.components.Div!.props.border?.values["1px"]?.usage.total).toBe(1);

  // Should track function usage
  expect(analysisResults.functions.useResponsive).toBeDefined();
  expect(analysisResults.functions.useResponsive!.usage.total).toBe(2);
  expect(analysisResults.functions.useResponsive!.values["useResponsive()"]?.usage.total).toBe(1);
  expect(analysisResults.functions.useResponsive!.values["useResponsive(false)"]?.usage.total).toBe(1);

  // Should have correct totals
  expect(analysisResults.overall.usage.components).toBe(1);
  expect(analysisResults.overall.usage.functions).toBe(2);
});

test("analyze should include project tracking and files when enabled", () => {
  const sourceCode = `
    import { Button, useBreakpoint } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const bp1 = useBreakpoint("sm");
      const bp2 = useBreakpoint("md");
      
      return <Button variant="primary" size="lg">Click me</Button>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const { analysisResults } = analyze(runtime, null, {
    project: "test-project",
    deep: true
  });

  // Check components have project and file tracking
  expect(analysisResults.components.Button).toBeDefined();
  expect(analysisResults.components.Button!.usage.projects).toBeDefined();
  expect(analysisResults.components.Button!.usage.projects!["test-project"]).toBe(1);
  
  const variantPrimary = analysisResults.components.Button!.props.variant?.values["primary"];
  expect(variantPrimary?.files).toBeDefined();
  expect(variantPrimary?.files?.length).toBe(1);

  // Check functions have project and file tracking
  expect(analysisResults.functions.useBreakpoint).toBeDefined();
  expect(analysisResults.functions.useBreakpoint!.usage.projects).toBeDefined();
  expect(analysisResults.functions.useBreakpoint!.usage.projects!["test-project"]).toBe(2);

  const smCall = analysisResults.functions.useBreakpoint!.values["useBreakpoint(\"sm\")"];
  expect(smCall?.usage.projects).toBeDefined();
  expect(smCall?.usage.projects!["test-project"]).toBe(1);
  expect(smCall?.files).toBeDefined();
  expect(smCall?.files?.length).toBe(1);

  const mdCall = analysisResults.functions.useBreakpoint!.values["useBreakpoint(\"md\")"];
  expect(mdCall?.usage.projects).toBeDefined();
  expect(mdCall?.usage.projects!["test-project"]).toBe(1);
  expect(mdCall?.files).toBeDefined();
  expect(mdCall?.files?.length).toBe(1);
});

test("should analyze components, functions, and objects together", () => {
  const sourceCode = `
    import { Button, useBreakpoint, ButtonProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const breakpoint = useBreakpoint("md");
      
      const buttonConfig: ButtonProps = {
        variant: "primary",
        size: "sm"
      };
      
      return (
        <Button variant="secondary" size="lg">
          Click me
        </Button>
      );
    }
  `;

  const runtime = getRuntime(sourceCode);
  const { analysisResults } = analyze(runtime, null);

  // Should track components
  expect(analysisResults.components.Button).toBeDefined();
  expect(analysisResults.components.Button!.usage.total).toBe(1);
  expect(analysisResults.components.Button!.props.variant!.values["secondary"]!.usage.total).toBe(1);
  expect(analysisResults.components.Button!.props.size!.values["lg"]!.usage.total).toBe(1);

  // Should track functions
  expect(analysisResults.functions.useBreakpoint).toBeDefined();
  expect(analysisResults.functions.useBreakpoint!.usage.total).toBe(1);
  expect(analysisResults.functions.useBreakpoint!.values["useBreakpoint(\"md\")"]!.usage.total).toBe(1);

  // Should track objects
  expect(analysisResults.types.ButtonProps).toBeDefined();
  expect(analysisResults.types.ButtonProps!.usage.total).toBe(1);

  // Should track overall statistics correctly
  expect(analysisResults.overall.usage.components).toBe(1); // 1 Button component
  expect(analysisResults.overall.usage.componentProps).toBe(2); // variant + size props on Button
  expect(analysisResults.overall.usage.functions).toBe(1); // 1 useBreakpoint function
  expect(analysisResults.overall.usage.types).toBe(1); // 1 ButtonProps type usage
});
