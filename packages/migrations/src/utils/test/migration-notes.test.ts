import * as fs from "fs";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MigrationNotesManager, resetGlobalManager } from "../migration-notes.ts";

describe("MigrationNotesManager", () => {
  let testDir: string;
  let manager: MigrationNotesManager;

  beforeEach(() => {
    // Reset global manager state
    resetGlobalManager();
    
    // Create a temporary directory for testing
    testDir = path.join(process.cwd(), "test-migration-notes");
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    manager = new MigrationNotesManager(testDir, "migration-notes.md.tmp");
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(testDir, file));
      });
      fs.rmdirSync(testDir);
    }
  });

  it("should add migration notes for single file", async () => {
    manager.addMigrationNote("Div", "Test migration note", "/path/to/file1.tsx");
    await manager.generateMigrationNotesFile();

    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, "utf-8");
    expect(content).toContain("# Migration Notes");
    expect(content).toContain("- **Div**: Test migration note");
    expect(content).toContain("  - /path/to/file1.tsx");
  });

  it("should aggregate same notes across multiple files", async () => {
    manager.addMigrationNote("Div", "Same note", "/path/to/file1.tsx");
    manager.addMigrationNote("Div", "Same note", "/path/to/file2.tsx");
    manager.addMigrationNote("Div", "Different note", "/path/to/file3.tsx");
    await manager.generateMigrationNotesFile();

    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    const content = fs.readFileSync(outputPath, "utf-8");

    expect(content).toContain("- **Div**: Same note");
    expect(content).toContain("  - /path/to/file1.tsx");
    expect(content).toContain("  - /path/to/file2.tsx");
    expect(content).toContain("- **Div**: Different note");
    expect(content).toContain("  - /path/to/file3.tsx");
  });

  it("should handle array of migration notes", async () => {
    manager.addMigrationNotes("Div", ["Note 1", "Note 2"], "/path/to/file1.tsx");
    await manager.generateMigrationNotesFile();

    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    const content = fs.readFileSync(outputPath, "utf-8");
    
    expect(content).toContain("- **Div**: Note 1");
    expect(content).toContain("- **Div**: Note 2");
    expect(content).toContain("  - /path/to/file1.tsx");
  });

  it("should skip empty notes", async () => {
    manager.addMigrationNote("Div", "", "/path/to/file1.tsx");
    manager.addMigrationNote("Div", "   ", "/path/to/file2.tsx");
    manager.addMigrationNote("Div", "Valid note", "/path/to/file3.tsx");
    await manager.generateMigrationNotesFile();

    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    const content = fs.readFileSync(outputPath, "utf-8");
    
    expect(content).not.toContain("/path/to/file1.tsx");
    expect(content).not.toContain("/path/to/file2.tsx");
    expect(content).toContain("- **Div**: Valid note");
    expect(content).toContain("  - /path/to/file3.tsx");
  });

  it("should sort notes and files alphabetically", async () => {
    manager.addMigrationNote("Div", "Z note", "/z/file.tsx");
    manager.addMigrationNote("Div", "A note", "/a/file.tsx");
    manager.addMigrationNote("Div", "A note", "/z/file.tsx");
    manager.addMigrationNote("Div", "A note", "/b/file.tsx");
    await manager.generateMigrationNotesFile();

    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    const content = fs.readFileSync(outputPath, "utf-8");
    
    // Check that A note comes before Z note
    const aIndex = content.indexOf("- **Div**: A note");
    const zIndex = content.indexOf("- **Div**: Z note");
    expect(aIndex).toBeLessThan(zIndex);
    
    // Check that files are sorted within each note
    const aFiles = content.substring(aIndex, zIndex);
    const aFileIndex = aFiles.indexOf("  - /a/file.tsx");
    const bFileIndex = aFiles.indexOf("  - /b/file.tsx");
    const zFileIndex = aFiles.indexOf("  - /z/file.tsx");
    expect(aFileIndex).toBeLessThan(bFileIndex);
    expect(bFileIndex).toBeLessThan(zFileIndex);
  });

  it("should remove files when no notes exist", async () => {
    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    
    await manager.generateMigrationNotesFile(); // This should remove the output file since no notes exist

    expect(fs.existsSync(outputPath)).toBe(false);
  });

  it("should handle concurrent access to the same note", async () => {
    // Simulate concurrent access (now synchronous)
    manager.addMigrationNote("Div", "Concurrent note", "/file1.tsx");
    manager.addMigrationNote("Div", "Concurrent note", "/file2.tsx");
    manager.addMigrationNote("Div", "Concurrent note", "/file3.tsx");

    await manager.generateMigrationNotesFile();

    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    const content = fs.readFileSync(outputPath, "utf-8");

    expect(content).toContain("- **Div**: Concurrent note");
    expect(content).toContain("  - /file1.tsx");
    expect(content).toContain("  - /file2.tsx");
    expect(content).toContain("  - /file3.tsx");
  });

  it("should merge with existing migration notes file", async () => {
    const outputPath = path.join(testDir, "migration-notes.md.tmp");
    
    // Create an existing migration notes file
    const existingContent = `# Migration Notes

- **Div**: Existing note 1
  - /existing/file1.tsx
  - /existing/file2.tsx

- **Div**: Existing note 2
  - /existing/file3.tsx

`;
    fs.writeFileSync(outputPath, existingContent);
    
    // Add new notes
    manager.addMigrationNote("Div", "New note", "/new/file.tsx");
    manager.addMigrationNote("Div", "Existing note 1", "/new/file2.tsx"); // Should merge with existing

    await manager.generateMigrationNotesFile();
    
    const content = fs.readFileSync(outputPath, "utf-8");
    
    // Should contain both existing and new notes
    expect(content).toContain("- **Div**: Existing note 1");
    expect(content).toContain("  - /existing/file1.tsx");
    expect(content).toContain("  - /existing/file2.tsx");
    expect(content).toContain("  - /new/file2.tsx"); // Merged

    expect(content).toContain("- **Div**: Existing note 2");
    expect(content).toContain("  - /existing/file3.tsx");

    expect(content).toContain("- **Div**: New note");
    expect(content).toContain("  - /new/file.tsx");
  });
});
