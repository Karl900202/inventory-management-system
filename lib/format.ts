/**
 * Format number with thousand separators
 * @param value - Number to format
 * @returns Formatted string with commas (e.g., "1,234,567")
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}
