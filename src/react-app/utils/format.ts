import { PayFrequency } from '@/shared/types';

const cadWhole = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const cadPrecise = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return cadWhole.format(amount);
}

export function formatCurrencyPrecise(amount: number): string {
  return cadPrecise.format(amount);
}

export function formatPayFrequency(frequency: PayFrequency): string {
  switch (frequency) {
    case 'annual':
      return 'per year';
    case 'monthly':
      return 'per month';
    case 'bi-weekly':
      return 'bi-weekly';
    case 'weekly':
      return 'per week';
  }
}
