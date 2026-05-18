/**
 * Development logging utilities
 * These functions only log in development mode
 */

const isDev = process.env.NODE_ENV === "development";

/**
 * Log debug information in development mode
 */
export function devLog(context: string, message: string, data?: unknown): void {
  if (isDev) {
    console.log(`[${context}] ${message}`, data ?? "");
  }
}

/**
 * Log errors in development mode
 */
export function devError(
  context: string,
  message: string,
  error?: unknown,
): void {
  if (isDev) {
    console.error(`[${context}] ${message}`, error ?? "");
  }
}
