// Builds a parameter string for GET Requests
// Input: Array of [key, value] pairs
// Output: Query String: employee_id=1&name=John...
export function buildQueryString(params: Record<string, any>) {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`)
        : [`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`]
    )
    .join("&");
}


// Compares original and current data to generate fields for PATCH Requests
// Input: originalData (Dictionary), currentData (Dictionary), patchableKeys (List)
// Output: Dictionary of [key, value] pairs that have been changed
export function buildPatchData<T extends Record<string, any>>(
  originalData: T,
  currentData: T,
  keys: (keyof T)[]
): Partial<T> {
  const patch: Partial<T> = {};

  keys.forEach((key) => {
    const originalValue = originalData[key];
    const currentValue = currentData[key];

    const bothNullish = originalValue == null && currentValue == null;

    if (!bothNullish && originalValue !== currentValue) {
      patch[key] = currentValue;
    }
  });

  return patch;
}