import { messages } from "./messages.ts";

export function getTodoComment(key: keyof typeof messages.todoComments): string {
  const message = messages.todoComments[key];
  if (!message) {
    throw new Error(`Todo comment key '${key}' not found in messages.ts`);
  }

  return message;
}

export function getMigrationNote(key: keyof typeof messages.migrationNotes): string {
  const message = messages.migrationNotes[key];
  if (!message) {
    throw new Error(`Migration note key '${key}' not found in messages.ts`);
  }

  return message;
}
