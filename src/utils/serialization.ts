/**
 * Custom replacer function for JSON.stringify to handle Set objects
 * Transforms Set instances into a special format that can be reconstituted later
 *
 * @param key - The current key being processed
 * @param value - The value associated with the key
 * @returns The transformed value suitable for JSON serialization
 */
export function setReplacer(key: string, value: any): any {
  if (value instanceof Set) {
    return Array.from(value);
  }

  return value;
}

/**
 * Custom reviver function for JSON.parse to restore Set objects
 * Reconstructs Set instances from the special format created by setReplacer
 *
 * @param key - The current key being processed
 * @param value - The value associated with the key
 * @returns The restored value, converting special Set objects back to actual Sets
 */
export function setReviver(key: string, value: any): any {
  if (
    typeof value === "object" &&
    value !== null &&
    key === "values" &&
    Array.isArray(value)
  ) {
    return new Set(value);
  }

  return value;
}
