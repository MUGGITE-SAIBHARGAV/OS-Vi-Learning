export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function calculateUnsyncedResult(threads: number, operations: number): number {
  const expected = threads * operations;
  // Simulate lost updates typical in a race condition
  return Math.floor(expected * (0.4 + Math.random() * 0.3));
}
