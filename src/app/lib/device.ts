/**
 * Returns whether full page reloads are required for page navigation
 */
export function isForceRefreshRequired(): boolean {
  return !('pushstate' in window.history);
}
