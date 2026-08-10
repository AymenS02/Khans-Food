export interface OrderTotal {
  subtotal: number;
  tax: number;
  total: number;
}

interface CalculateOrderTotalParams {
  subtotal: number;
  taxRate: number;
}

export function calculateOrderTotal({
  subtotal,
  taxRate,
}: CalculateOrderTotalParams): OrderTotal {
  if (subtotal < 0) {
    throw new Error("Subtotal cannot be negative.");
  }

  if (taxRate < 0) {
    throw new Error("Tax rate cannot be negative.");
  }

  const tax = roundMoney(subtotal * taxRate);

  const total = roundMoney(subtotal + tax);

  return {
    subtotal: roundMoney(subtotal),
    tax,
    total,
  };
}

function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}