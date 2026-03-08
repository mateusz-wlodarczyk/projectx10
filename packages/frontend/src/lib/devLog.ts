/**
 * Logs only in development. No-op in production to avoid build/deploy noise.
 */
export function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}
