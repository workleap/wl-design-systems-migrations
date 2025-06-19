#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// First, let's create a simple test file
const testContent = `
import { Div, Button, Text } from "@workleap/orbiter-ui";

export function TestComponent() {
  return (
    <div>
      <Div border="1px solid" padding="16px">
        <Text fontSize="14px">Hello World</Text>
        <Button variant="primary" size="md">Click me</Button>
        <Button variant="secondary" size="md">Cancel</Button>
      </Div>
      <Div border="2px solid" padding="16px">
        <Text fontSize="12px">Smaller text</Text>
      </Div>
    </div>
  );
}
`;

// Write the test file
fs.writeFileSync("test-example.tsx", testContent);

// Run the analysis
exec("npx jscodeshift -t src/index.ts --analyze --output-path analysis-result.json --project testProject test-example.tsx", (error, stdout, stderr) => {
    if (error) {
        console.error("Error:", error);

        return;
    }
    
    console.log("Analysis complete!");
    
    // Read and display the results
    if (fs.existsSync("analysis-result.json")) {
        const results = JSON.parse(fs.readFileSync("analysis-result.json", "utf8"));
        console.log("\nAnalysis Results:");
        console.log(JSON.stringify(results, null, 2));
    }
    
    // Clean up
    fs.unlinkSync("test-example.tsx");
});
