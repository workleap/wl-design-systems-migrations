import * as fs from "fs";
import { tmpdir } from "os";
import { join } from "path";


export interface MigrationNote {
  note: string;
  affectedFiles: Set<string>;
}

export const MIGRATION_NOTES_FILE = "migration-notes.md";

// Simple file-based locking mechanism for the output file
class FileLock {
  private lockFile: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor(maxRetries = 50, retryDelay = 100) {
    this.lockFile = join(tmpdir(), `${MIGRATION_NOTES_FILE}.lock`);
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async acquire(): Promise<void> {
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        // Try to create lock file exclusively
        fs.writeFileSync(this.lockFile, process.pid.toString(), { flag: "wx" });

        return;
      } catch (error: any) {
        if (error.code === "EEXIST") {
          // Lock file exists, wait and retry
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed to acquire lock after ${this.maxRetries} attempts`);
  }

  release(): void {
    try {
      fs.unlinkSync(this.lockFile);
    } catch {
      // Lock file might have been removed already, ignore
    }
  }
}

export class MigrationNotesManager {
  private notes: Map<string, MigrationNote> = new Map();
  private outputFilePath: string;
  private lock: FileLock;

  constructor(
    projectRoot: string = process.cwd(), 
    outputFileName: string = MIGRATION_NOTES_FILE
  ) {   
    this.outputFilePath = join(projectRoot, outputFileName);
    this.lock = new FileLock();   
  }

  getOutputFilePath(): string {
    return this.outputFilePath;
  }

  addMigrationNote(tag: string, note: string, filePath: string): void {
    if (!note?.trim()) {
      return;
    }
    const noteKey = `**${tag}**: ${note}`;

    if (this.notes.has(noteKey)) {
      this.notes.get(noteKey)!.affectedFiles.add(filePath);
    } else {
      this.notes.set(noteKey, {
        note: noteKey,
        affectedFiles: new Set([filePath])
      });
    }
  }

  addMigrationNotes(tag: string, notes: string | string[], filePath: string): void {
    const notesList = Array.isArray(notes) ? notes : [notes];
    
    for (const note of notesList) {
      this.addMigrationNote(tag, note, filePath);
    }
  }

  async generateMigrationNotesFile(): Promise<void> {
    await this.lock.acquire();
    try {
      // Merge with existing file content if it exists
      const existingNotes = this.loadExistingNotes();
      this.mergeNotes(existingNotes);
      
      if (this.notes.size === 0) {
        // Remove output file if no notes exist
        if (fs.existsSync(this.outputFilePath)) {
          fs.unlinkSync(this.outputFilePath);
        }

        return;
      }
      
      const content = this.formatMigrationNotes();
      fs.writeFileSync(this.outputFilePath, content);
    } finally {
      this.lock.release();
      this.cleanup();
    }
  }

  private loadExistingNotes(): Map<string, MigrationNote> {
    const existingNotes = new Map<string, MigrationNote>();
    
    if (!fs.existsSync(this.outputFilePath)) {
      return existingNotes;
    }

    try {
      const content = fs.readFileSync(this.outputFilePath, "utf-8");
      const lines = content.split("\n");
      
      let currentNote: string | null = null;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and headers
        if (!trimmedLine || trimmedLine.startsWith("#")) {
          continue;
        }
        
        // Main note (starts with "- " without indentation)
        if (line.startsWith("- ")) {
          currentNote = line.substring(2);
          if (!existingNotes.has(currentNote)) {
            existingNotes.set(currentNote, {
              note: currentNote,
              affectedFiles: new Set()
            });
          }
        } else if (line.startsWith("  - ") && currentNote) {
          // File path (starts with "  - " with two-space indentation)
          const filePath = line.substring(4);
          existingNotes.get(currentNote)!.affectedFiles.add(filePath);
        }
      }
    } catch (error) {
      console.warn("Failed to load existing migration notes:", error);
    }
    
    return existingNotes;
  }

  private mergeNotes(existingNotes: Map<string, MigrationNote>): void {
    // Merge existing notes with current notes
    for (const [noteText, existingNote] of existingNotes) {
      if (this.notes.has(noteText)) {
        // Merge affected files
        const currentNote = this.notes.get(noteText)!;
        for (const file of existingNote.affectedFiles) {
          currentNote.affectedFiles.add(file);
        }
      } else {
        // Add existing note that's not in current notes
        this.notes.set(noteText, existingNote);
      }
    }
  }

  private formatMigrationNotes(): string {
    const lines: string[] = [
      "# Migration Notes",
      ""
    ];

    // Sort notes alphabetically for consistent output
    const sortedNotes = Array.from(this.notes.values()).sort((a, b) => 
      a.note.localeCompare(b.note)
    );

    sortedNotes.forEach(({ note, affectedFiles }) => {
      lines.push(`- ${note}`);
      
      // Sort files alphabetically
      const sortedFiles = Array.from(affectedFiles).sort();
      sortedFiles.forEach(file => {
        lines.push(`  - ${file}`);
      });
      
      lines.push(""); // Empty line between notes
    });

    return lines.join("\n");
  }

  private cleanup(): void {
    // Clear in-memory notes
    this.notes.clear();
  }
}

// Global instance for easy access
let globalManager: MigrationNotesManager | null = null;

export function getMigrationNotesManager(
  projectRoot?: string, 
  outputFileName?: string
): MigrationNotesManager {
  if (!globalManager) {
    globalManager = new MigrationNotesManager(projectRoot, outputFileName);
  }

  return globalManager;
}

export function resetGlobalManager(): void {
  globalManager = null;
}

/**
 * Creates a lazy-loaded migration notes manager getter
 * The getter uses singleton pattern - it creates the manager only once when first accessed
 */
export function createLazyMigrationNotesManager(): {
  getMigrationNotesManager: () => MigrationNotesManager;
} {
  let cachedManager: MigrationNotesManager | undefined = undefined;

  return {
    getMigrationNotesManager: () => {
      if (cachedManager === undefined) {
        // Use current working directory as project root
        cachedManager = new MigrationNotesManager(process.cwd());
      }

      return cachedManager;
    }
  };
}
