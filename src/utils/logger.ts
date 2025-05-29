import { appendFileSync } from "fs";
import { join } from "path";
const logFileName = "debug.log";

/**
 * Simple file logger utility for debugging
 * @param message - Message or object to log
 * @param logFile - Optional log file name (defaults to debug.log)
 */
export async function logToFile(
  message: unknown,
  ...optionalParams: any[]
): Promise<void> {
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
    appendFileSync(join(process.cwd(), logFileName), logEntry);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
}
