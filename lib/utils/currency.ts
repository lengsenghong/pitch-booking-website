export function formatCurrency(
  amount: number | string,
  currency: string = 'USD'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

export function formatPrice(price: number | string): string {
  return formatCurrency(price).replace('$', '$');
}

export function calculateTotal(
  pricePerHour: number,
  durationMinutes: number
): number {
  const hours = durationMinutes / 60;
  return pricePerHour * hours;
}

export function calculateCommission(
  amount: number,
  commissionRate: number = 0.1
): number {
  return amount * commissionRate;
}

export function calculateNetAmount(
  amount: number,
  commissionRate: number = 0.1
): number {
  return amount - calculateCommission(amount, commissionRate);
}