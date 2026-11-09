import {
  SalaryInput,
  SalaryBreakdown,
  PayFrequency,
  TaxBracket,
  FEDERAL_TAX_BRACKETS,
  MANITOBA_TAX_BRACKETS,
  CPP_RATE,
  CPP_MAX_EARNINGS,
  CPP_BASIC_EXEMPTION,
  EI_RATE,
  EI_MAX_EARNINGS,
  PERIODS_PER_YEAR,
} from '@/shared/types';

const roundToCents = (amount: number): number => Math.round(amount * 100) / 100;

/** Normalizes any incoming value to a finite, non-negative number. */
const nonNegative = (value: number | undefined): number => {
  const amount = value ?? 0;
  return Number.isFinite(amount) ? Math.max(0, amount) : 0;
};

/** Progressive tax: each bracket taxes only the income that falls inside it. */
function calculateTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  for (const { min, max, rate } of brackets) {
    const taxableInBracket = Math.min(income, max ?? Number.POSITIVE_INFINITY) - min;
    if (taxableInBracket <= 0) continue;
    tax += taxableInBracket * rate;
  }
  return roundToCents(tax);
}

function calculateCPP(annualIncome: number): number {
  const pensionableIncome = Math.min(nonNegative(annualIncome), CPP_MAX_EARNINGS) - CPP_BASIC_EXEMPTION;
  return roundToCents(Math.max(0, pensionableIncome) * CPP_RATE);
}

function calculateEI(annualIncome: number): number {
  const insurableIncome = Math.min(nonNegative(annualIncome), EI_MAX_EARNINGS);
  return roundToCents(insurableIncome * EI_RATE);
}

export function toAnnual(amount: number, frequency: PayFrequency): number {
  return amount * PERIODS_PER_YEAR[frequency];
}

export function fromAnnual(amount: number, frequency: PayFrequency): number {
  return amount / PERIODS_PER_YEAR[frequency];
}

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const { payFrequency } = input;

  // Normalize at the boundary so the math below only ever sees clean numbers.
  const grossAnnual = nonNegative(toAnnual(input.grossSalary, payFrequency));
  const additionalIncomeAnnual = nonNegative(toAnnual(input.additionalIncome, payFrequency));
  const rrspAnnual = nonNegative(toAnnual(input.rrspContributions, payFrequency));
  const unionDuesAnnual = nonNegative(toAnnual(input.unionDues, payFrequency));
  const otherDeductionsAnnual = nonNegative(toAnnual(input.otherDeductions, payFrequency));

  const totalGrossIncome = grossAnnual + additionalIncomeAnnual;
  // RRSP contributions reduce taxable income (floored at zero).
  const taxableIncome = Math.max(0, totalGrossIncome - rrspAnnual);

  const federalTax = calculateTax(taxableIncome, FEDERAL_TAX_BRACKETS);
  const provincialTax = calculateTax(taxableIncome, MANITOBA_TAX_BRACKETS);

  // CPP and EI are based on total gross income, not the RRSP-reduced amount.
  const cpp = calculateCPP(totalGrossIncome);
  const ei = calculateEI(totalGrossIncome);

  const totalDeductions =
    federalTax + provincialTax + cpp + ei + rrspAnnual + unionDuesAnnual + otherDeductionsAnnual;
  const netAnnual = totalGrossIncome - totalDeductions;

  return {
    grossAnnual: roundToCents(totalGrossIncome),
    grossPerPeriod: roundToCents(fromAnnual(totalGrossIncome, payFrequency)),
    federalTax,
    provincialTax,
    cpp,
    ei,
    rrsp: roundToCents(rrspAnnual),
    unionDues: roundToCents(unionDuesAnnual),
    otherDeductions: roundToCents(otherDeductionsAnnual),
    totalDeductions: roundToCents(totalDeductions),
    netAnnual: roundToCents(netAnnual),
    netPerPeriod: roundToCents(fromAnnual(netAnnual, payFrequency)),
    payFrequency,
  };
}
