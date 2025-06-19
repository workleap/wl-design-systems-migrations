/**
We need this to make sure keys are sorted properly.
In default JSON.stringify, the numeric keys are sorted before string keys,
but we want to ensure a consistent order for our custom objects.
 */
export function customStringify(value: any, indent = 2) {
  // Internal helper to walk with current indent level
  function walk(val: any, relatedKey: string, level: number): string {
    const pad = " ".repeat(level * indent);
    const padInner = " ".repeat((level + 1) * indent);

    // Detect array-of-pairs → custom object
    if (
      Array.isArray(val) &&
      val.length > 0 &&
      val.every(item =>
        Array.isArray(item) &&
        item.length === 2 &&
        typeof item[0] === "string"
      )
    ) {
      const parts = val.map(
        ([k, v]) => `${padInner}${JSON.stringify(k)}: ${walk(v, k, level + 1)}`
      );

      return `{\n${parts.join(",\n")}\n${pad}}`;
    }

    // Regular arrays
    if (Array.isArray(val)) {
      if (val.length === 0) {return "[]";}
      const parts = val.map(item => `${padInner}${walk(item, relatedKey, level + 1)}`);

      return `[\n${parts.join(",\n")}\n${pad}]`;
    }

    // Plain object
    if (val !== null && typeof val === "object") {
      const keys = getSortedKeys(relatedKey, val);

      if (keys.length === 0) {return "{}";}
      const parts = keys.map(
        k => `${padInner}${JSON.stringify(k)}: ${walk(val[k], k, level + 1)}`
      );

      return `{\n${parts.join(",\n")}\n${pad}}`;
    }

    // Primitives
    return JSON.stringify(val);
  }

  return walk(value, "", 0);
}

export function getSortedKeys(key: string, value: object): string[] {
  if (key == "values") {
    return Object.entries(value as Record<string, any>)
      .sort((a, b) => b[1].usage.total - a[1].usage.total)
      .map(([k]) => k);
  } else if (key == "props") {
    return Object.entries(value as Record<string, any>)
      .sort((a, b) => b[1].usage - a[1].usage)
      .map(([k]) => k);
  } else if (key == "components") {
    return Object.entries(value as Record<string, any>)
      .sort((a, b) => b[1].usage - a[1].usage)
      .map(([k]) => k);
  } else {
    return Object.keys(value);
  }
}
