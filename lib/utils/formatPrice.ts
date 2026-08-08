export function formatPrice(
  amount: number,
  currency: string = "CAD"
): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(amount);
}