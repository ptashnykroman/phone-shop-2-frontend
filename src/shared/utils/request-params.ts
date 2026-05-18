export function compactParams<T extends object>(params: T) {
  return Object.entries(params as Record<string, unknown>).reduce<
    Record<string, unknown>
  >((acc, [key, value]) => {
    if (value === undefined || value === null || value === "") {
      return acc;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        acc[key] = value.join(",");
      }
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
}
