/**
 * Utility function to combine classnames
 * Filters out falsy values and joins with spaces
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
