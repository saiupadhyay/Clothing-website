/**
 * Centralized Indian Rupee price formatter.
 * Formats numbers into Indian numbering format with 'Rs.' prefix.
 * e.g. 1299 -> 'Rs. 1,299', 48 -> 'Rs. 48'
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount)) return 'Rs. 0';
  return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
}
