import { expect, test } from "vitest";
import { getRuntime } from "../../utils/test.js";
import { performFunctionAnalysis } from "../utils/function-analyzer.js";

test("should analyze function calls from source package", () => {
  const sourceCode = `
    import { useResponsive, useBreakpoint } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const responsive = useResponsive();
      const breakpoint = useBreakpoint("md");
      const responsive2 = useResponsive(false);
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performFunctionAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track useResponsive function
  expect(result.useResponsive).toBeDefined();
  expect(result.useResponsive!.count.total).toBe(2);
  
  // Should track different call signatures
  expect(result.useResponsive!.values["useResponsive()"]).toBeDefined();
  expect(result.useResponsive!.values["useResponsive()"]?.usage.total).toBe(1);
  
  expect(result.useResponsive!.values["useResponsive(false)"]).toBeDefined();
  expect(result.useResponsive!.values["useResponsive(false)"]?.usage.total).toBe(1);

  // Should track useBreakpoint function
  expect(result.useBreakpoint).toBeDefined();
  expect(result.useBreakpoint!.count.total).toBe(1);
  expect(result.useBreakpoint!.values["useBreakpoint(\"md\")"]).toBeDefined();
  expect(result.useBreakpoint!.values["useBreakpoint(\"md\")"]?.usage.total).toBe(1);
});

test("should ignore functions not from source package", () => {
  const sourceCode = `
    import { useState } from "react";
    import { useResponsive } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const [state, setState] = useState();
      const responsive = useResponsive();
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performFunctionAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track useResponsive from target package
  expect(result.useResponsive).toBeDefined();
  expect(result.useResponsive!.count.total).toBe(1);

  // Should not track useState from React
  expect(result.useState).toBeUndefined();
  expect(result.setState).toBeUndefined();
});

test("should handle complex function call arguments", () => {
  const sourceCode = `
    import { useBreakpoint } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const bp1 = useBreakpoint("sm");
      const bp2 = useBreakpoint(isActive ? "md" : "lg");
      const bp3 = useBreakpoint(getBreakpoint());
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performFunctionAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  expect(result.useBreakpoint).toBeDefined();
  expect(result.useBreakpoint!.count.total).toBe(3);
  
  // Should have different call signatures
  expect(result.useBreakpoint!.values["useBreakpoint(\"sm\")"]).toBeDefined();
  expect(result.useBreakpoint!.values["useBreakpoint(isActive ? \"md\" : \"lg\")"]).toBeDefined();
  expect(result.useBreakpoint!.values["useBreakpoint(getBreakpoint())"]).toBeDefined();
});

test("should track file locations when deep analysis is enabled", () => {
  const sourceCode = `
    import { useResponsive, useBreakpoint } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const responsive = useResponsive();
      const isDesktop = useResponsive(false);
      const breakpoint = useBreakpoint("md");
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performFunctionAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: true
  });

  // Check useResponsive function calls have file tracking
  expect(result.useResponsive).toBeDefined();
  expect(result.useResponsive!.values["useResponsive()"]?.files).toBeDefined();
  expect(Array.isArray(result.useResponsive!.values["useResponsive()"]?.files)).toBe(true);
  expect(result.useResponsive!.values["useResponsive()"]?.files?.length).toBe(1);

  expect(result.useResponsive!.values["useResponsive(false)"]?.files).toBeDefined();
  expect(result.useResponsive!.values["useResponsive(false)"]?.files?.length).toBe(1);

  // Check useBreakpoint function calls have file tracking
  expect(result.useBreakpoint).toBeDefined();
  expect(result.useBreakpoint!.values["useBreakpoint(\"md\")"]?.files).toBeDefined();
  expect(result.useBreakpoint!.values["useBreakpoint(\"md\")"]?.files?.length).toBe(1);

  // Verify the files contain repository URLs with line numbers or file paths with line numbers
  const responsiveFile = result.useResponsive!.values["useResponsive()"]?.files?.[0];
  const responsiveFalseFile = result.useResponsive!.values["useResponsive(false)"]?.files?.[0];
  const breakpointFile = result.useBreakpoint!.values["useBreakpoint(\"md\")"]?.files?.[0];

  // Should contain either GitHub or Azure DevOps URL, or fallback to file path with line number
  expect(
    responsiveFile?.includes("github.com") || 
    responsiveFile?.includes("dev.azure.com") || 
    responsiveFile?.includes("visualstudio.com") || 
    responsiveFile?.includes("#L")
  ).toBe(true);

  expect(
    responsiveFalseFile?.includes("github.com") || 
    responsiveFalseFile?.includes("dev.azure.com") || 
    responsiveFalseFile?.includes("visualstudio.com") || 
    responsiveFalseFile?.includes("#L")
  ).toBe(true);

  expect(
    breakpointFile?.includes("github.com") || 
    breakpointFile?.includes("dev.azure.com") || 
    breakpointFile?.includes("visualstudio.com") || 
    breakpointFile?.includes("#L")
  ).toBe(true);
});

test("should track multiple file locations for same function call signature", () => {
  const sourceCode = `
    import { useResponsive } from "@workleap/orbiter-ui";
    
    function ComponentA() {
      const responsive = useResponsive();
      return <div></div>;
    }

    function ComponentB() {
      const responsive = useResponsive();
      return <span></span>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performFunctionAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: true
  });

  expect(result.useResponsive).toBeDefined();
  expect(result.useResponsive!.count.total).toBe(2);
  expect(result.useResponsive!.values["useResponsive()"]?.usage.total).toBe(2);
  expect(result.useResponsive!.values["useResponsive()"]?.files).toBeDefined();
  expect(result.useResponsive!.values["useResponsive()"]?.files?.length).toBe(2);

  // Both URLs should be different (different line numbers)
  const files = result.useResponsive!.values["useResponsive()"]?.files || [];
  expect(files[0]).not.toBe(files[1]);
});

test("should combine project tracking and deep analysis", () => {
  const sourceCode = `
    import { useBreakpoint } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const bp1 = useBreakpoint("sm");
      const bp2 = useBreakpoint("md");
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performFunctionAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: "test-project",
    deep: true
  });

  expect(result.useBreakpoint).toBeDefined();
  expect(result.useBreakpoint!.count.total).toBe(2);
  expect(result.useBreakpoint!.count.projects).toBeDefined();
  expect(result.useBreakpoint!.count.projects!["test-project"]).toBe(2);

  // Check individual call signatures have both project and file tracking
  const smCall = result.useBreakpoint!.values["useBreakpoint(\"sm\")"];
  expect(smCall?.usage.total).toBe(1);
  expect(smCall?.usage.projects).toBeDefined();
  expect(smCall?.usage.projects!["test-project"]).toBe(1);
  expect(smCall?.files).toBeDefined();
  expect(smCall?.files?.length).toBe(1);

  const mdCall = result.useBreakpoint!.values["useBreakpoint(\"md\")"];
  expect(mdCall?.usage.total).toBe(1);
  expect(mdCall?.usage.projects).toBeDefined();
  expect(mdCall?.usage.projects!["test-project"]).toBe(1);
  expect(mdCall?.files).toBeDefined();
  expect(mdCall?.files?.length).toBe(1);
});
