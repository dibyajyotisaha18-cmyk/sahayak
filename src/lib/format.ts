/** Indian digit grouping: 200000 → ₹2,00,000 */
export function formatINR(amount: number): string {
  return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
}
