import * as fs from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";
import { MigrationNotesManager, resetGlobalManager } from "../migration-notes.js";

describe("Migration Notes Integration", () => {
  it("should merge with existing migration-notes.md file in real project scenario", async () => {
    const testProjectDir = path.join(process.cwd(), "test-integration-real");
    
    // Clean up any existing test directory
    if (fs.existsSync(testProjectDir)) {
      const files = fs.readdirSync(testProjectDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(testProjectDir, file));
      });
      fs.rmdirSync(testProjectDir);
    }
    
    // Set up a test directory
    fs.mkdirSync(testProjectDir);

    try {
      // Reset global manager to ensure clean state
      resetGlobalManager();
      
      // Create an existing migration-notes.md file
      const existingNotesPath = path.join(testProjectDir, "migration-notes.md");
      const existingContent = `# Migration Notes

- **Div**: Existing note from previous migration run
  - src/legacy/OldComponent.tsx
  - src/legacy/AnotherComponent.tsx

- **Div**: Shared migration note
  - src/shared/ExistingFile.tsx

`;
      fs.writeFileSync(existingNotesPath, existingContent);

      // Create a new migration notes manager for the test directory
      const manager = new MigrationNotesManager(testProjectDir, "migration-notes.md");
      
      // Simulate adding new migration notes during a migration run
      manager.addMigrationNote("Div", "New migration note added during current run", "src/components/NewComponent.tsx");
      manager.addMigrationNote("Div", "Another new note", "src/components/AnotherNewComponent.tsx");
      manager.addMigrationNote("Div", "Shared migration note", "src/components/NewSharedFile.tsx"); // Should merge with existing

      // Generate the migration notes file (this should merge with existing)
      await manager.generateMigrationNotesFile();

      // Verify the file exists and content was merged properly
      expect(fs.existsSync(existingNotesPath)).toBe(true);
      
      const mergedContent = fs.readFileSync(existingNotesPath, "utf-8");
      
      // Verify merged content contains both existing and new notes
      expect(mergedContent).toContain("# Migration Notes");
      
      // Existing notes should be preserved
      expect(mergedContent).toContain("- **Div**: Existing note from previous migration run");
      expect(mergedContent).toContain("  - src/legacy/OldComponent.tsx");
      expect(mergedContent).toContain("  - src/legacy/AnotherComponent.tsx");
      
      // New notes should be added
      expect(mergedContent).toContain("- **Div**: New migration note added during current run");
      expect(mergedContent).toContain("  - src/components/NewComponent.tsx");
      expect(mergedContent).toContain("- **Div**: Another new note");
      expect(mergedContent).toContain("  - src/components/AnotherNewComponent.tsx");
      
      // Shared notes should be merged (files combined under same note)
      expect(mergedContent).toContain("- **Div**: Shared migration note");
      expect(mergedContent).toContain("  - src/shared/ExistingFile.tsx");
      expect(mergedContent).toContain("  - src/components/NewSharedFile.tsx");
      
      // Notes should be sorted alphabetically
      const lines = mergedContent.split("\n").filter(line => line.startsWith("- "));
      expect(lines.indexOf("- **Div**: Another new note")).toBeLessThan(lines.indexOf("- **Div**: Existing note from previous migration run"));
      expect(lines.indexOf("- **Div**: Existing note from previous migration run")).toBeLessThan(lines.indexOf("- **Div**: New migration note added during current run"));
    } finally {
      // Clean up test files
      if (fs.existsSync(testProjectDir)) {
        const files = fs.readdirSync(testProjectDir);
        files.forEach(file => {
          fs.unlinkSync(path.join(testProjectDir, file));
        });
        fs.rmdirSync(testProjectDir);
      }
    }
  });
});