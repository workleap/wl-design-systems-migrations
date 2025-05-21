import { appendFileSync } from "fs";
import { join } from "path";
const logFile = "debug.log";

/**
 * Simple file logger utility for debugging
 * @param message - Message or object to log
 * @param logFile - Optional log file name (defaults to debug.log)
 */
export function logToFile(message: unknown, ...optionalParams: any[]): void {
  try {
    const timestamp = new Date().toISOString();
    let formattedMessage =
      typeof message === "object"
        ? JSON.stringify(message, null, 2)
        : String(message);
    if (optionalParams.length > 0) {
      formattedMessage += " " + optionalParams.join(" ");
    }

    const logEntry = `[${timestamp}] ${formattedMessage}\n`;
    appendFileSync(join(process.cwd(), logFile), logEntry);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
}

/**
 * Logs a message with the file path and line number context
 * @param message - Message or object to log
 * @param filePath - Path to the file being processed
 * @param context - Additional context information
 * @param logFile - Optional log file name (defaults to debug.log)
 */
export function logWithContext(
  message: unknown,
  filePath: string,
  context?: Record<string, unknown>,
  logFile: string = "debug.log"
): void {
  const contextObj = {
    file: filePath,
    ...context,
    message,
  };

  logToFile(contextObj);
}
