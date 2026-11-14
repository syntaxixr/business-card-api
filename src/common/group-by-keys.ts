export function groupByKeys<K, T>(keys: readonly K[], rows: T[], keyOf: (row: T) => K): T[][] {
  const groups = new Map<K, T[]>(keys.map((key) => [key, []]));
  for (const row of rows) {
    groups.get(keyOf(row))?.push(row);
  }
  return keys.map((key) => groups.get(key) ?? []);
}
