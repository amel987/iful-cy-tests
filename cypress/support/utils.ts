/**
 * Generates a unique string using the current timestamp.
 * Safe to call at module load time — unique per test run.
 *
 * @param prefix - Optional prefix for readability in reports and the UI.
 * @returns e.g. "qa_user_1710500000000"
 */
export const generateUnique = (prefix = "qa"): string =>
  `${prefix}_${Date.now()}`;

