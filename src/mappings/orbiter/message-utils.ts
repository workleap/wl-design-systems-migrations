import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import messages from "./messages.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Messages {
  todoComments: Record<string, string>;
  migrationNotes: Record<string, string>;
}

let messagesCache: Messages | null = null;

export function getMessages(): Messages {
  if (!messagesCache) {
    const messagesPath = path.join(__dirname, "messages.json");
    const messagesContent = fs.readFileSync(messagesPath, "utf-8");
    messagesCache = JSON.parse(messagesContent);
  }

  return messagesCache!;
}

export function getTodoComment(key: keyof typeof messages.todoComments): string {
  const message = messages.todoComments[key];
  if (!message) {
    throw new Error(`Todo comment key '${key}' not found in messages.json`);
  }

  return message;
}

export function getMigrationNote(key: keyof typeof messages.migrationNotes): string {
  const message = messages.migrationNotes[key];
  if (!message) {
    throw new Error(`Migration note key '${key}' not found in messages.json`);
  }

  return message;
}
