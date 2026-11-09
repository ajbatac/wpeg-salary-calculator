import { SalaryInput, PayFrequency, EmploymentType } from '@/shared/types';

/**
 * The chart page receives the calculation through URL search params, making
 * every chart link shareable. A bare /chart visit decodes to null -> the
 * page shows its "fill the form first" gate.
 */

export function encodeSalaryInput(input: SalaryInput): string {
  const params = new URLSearchParams({
    gross: String(input.grossSalary),
    freq: input.payFrequency,
    emp: input.employmentType,
  });
  if (input.additionalIncome > 0) params.set('add', String(input.additionalIncome));
  if (input.rrspContributions > 0) params.set('rrsp', String(input.rrspContributions));
  if (input.unionDues > 0) params.set('union', String(input.unionDues));
  if (input.otherDeductions > 0) params.set('other', String(input.otherDeductions));
  return params.toString();
}

const PAY_FREQUENCIES: PayFrequency[] = ['annual', 'monthly', 'bi-weekly', 'weekly'];
const EMPLOYMENT_TYPES: EmploymentType[] = ['full-time', 'part-time', 'contract'];

export function decodeSalaryInput(search: string): SalaryInput | null {
  const params = new URLSearchParams(search);
  const gross = Number.parseFloat(params.get('gross') ?? '');
  if (!Number.isFinite(gross) || gross <= 0) return null;
  const freq = params.get('freq') as PayFrequency | null;
  const emp = params.get('emp') as EmploymentType | null;
  const optional = (key: string): number => {
    const value = Number.parseFloat(params.get(key) ?? '');
    return Number.isFinite(value) && value > 0 ? value : 0;
  };
  return {
    grossSalary: gross,
    payFrequency: freq && PAY_FREQUENCIES.includes(freq) ? freq : 'annual',
    employmentType: emp && EMPLOYMENT_TYPES.includes(emp) ? emp : 'full-time',
    additionalIncome: optional('add'),
    rrspContributions: optional('rrsp'),
    unionDues: optional('union'),
    otherDeductions: optional('other'),
  };
}
