/**
 * Custom replacer function for JSON.stringify to handle the new values structure
 * No longer needs to handle Set objects since we're using plain objects now
 *
 * @param key - The current key being processed
 * @param value - The value associated with the key
 * @returns The value as-is since we're using plain objects
 */
export function setReplacer(key: string, value: any): any {
  // No transformation needed for the new structure
  return value;
}

/**
 * Custom reviver function for JSON.parse to restore the values structure
 * No longer needs to restore Set objects since we're using plain objects now
 *
 * @param key - The current key being processed
 * @param value - The value associated with the key
 * @returns The value as-is since we're using plain objects
 */
export function setReviver(key: string, value: any): any {
  // No transformation needed for the new structure
  return value;
}
