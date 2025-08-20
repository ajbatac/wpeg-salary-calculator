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
} from '@/shared/types';

function calculateTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const taxableAtThisBracket = bracket.max 
      ? Math.min(remainingIncome, bracket.max - bracket.min)
      : remainingIncome;

    if (income > bracket.min) {
      tax += Math.max(0, taxableAtThisBracket) * bracket.rate;
    }

    remainingIncome -= taxableAtThisBracket;
  }

  return Math.round(tax * 100) / 100;
}

function calculateCPP(annualIncome: number): number {
  const pensionableIncome = Math.min(annualIncome, CPP_MAX_EARNINGS) - CPP_BASIC_EXEMPTION;
  const cpp = Math.max(0, pensionableIncome) * CPP_RATE;
  return Math.round(cpp * 100) / 100;
}

function calculateEI(annualIncome: number): number {
  const insurableIncome = Math.min(annualIncome, EI_MAX_EARNINGS);
  const ei = insurableIncome * EI_RATE;
  return Math.round(ei * 100) / 100;
}

function convertToAnnual(amount: number, frequency: PayFrequency): number {
  switch (frequency) {
    case 'annual':
      return amount;
    case 'monthly':
      return amount * 12;
    case 'bi-weekly':
      return amount * 26;
    case 'weekly':
      return amount * 52;
    default:
      return amount;
  }
}

function convertFromAnnual(amount: number, frequency: PayFrequency): number {
  switch (frequency) {
    case 'annual':
      return amount;
    case 'monthly':
      return amount / 12;
    case 'bi-weekly':
      return amount / 26;
    case 'weekly':
      return amount / 52;
    default:
      return amount;
  }
}

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  // Convert all inputs to annual amounts
  const grossAnnual = convertToAnnual(input.grossSalary, input.payFrequency);
  const additionalIncomeAnnual = convertToAnnual(input.additionalIncome || 0, input.payFrequency);
  const rrspAnnual = convertToAnnual(input.rrspContributions || 0, input.payFrequency);
  const unionDuesAnnual = convertToAnnual(input.unionDues || 0, input.payFrequency);
  const otherDeductionsAnnual = convertToAnnual(input.otherDeductions || 0, input.payFrequency);

  const totalGrossIncome = grossAnnual + additionalIncomeAnnual;
  const taxableIncome = totalGrossIncome - rrspAnnual; // RRSP reduces taxable income

  // Calculate taxes
  const federalTax = calculateTax(taxableIncome, FEDERAL_TAX_BRACKETS);
  const provincialTax = calculateTax(taxableIncome, MANITOBA_TAX_BRACKETS);

  // Calculate CPP and EI (based on total gross income, not reduced by RRSP)
  const cpp = calculateCPP(totalGrossIncome);
  const ei = calculateEI(totalGrossIncome);

  // Calculate totals
  const totalDeductions = federalTax + provincialTax + cpp + ei + rrspAnnual + unionDuesAnnual + otherDeductionsAnnual;
  const netAnnual = totalGrossIncome - totalDeductions;

  // Convert to per-period amounts
  const grossPerPeriod = convertFromAnnual(totalGrossIncome, input.payFrequency);
  const netPerPeriod = convertFromAnnual(netAnnual, input.payFrequency);

  return {
    grossAnnual: Math.round(totalGrossIncome * 100) / 100,
    grossPerPeriod: Math.round(grossPerPeriod * 100) / 100,
    federalTax: Math.round(federalTax * 100) / 100,
    provincialTax: Math.round(provincialTax * 100) / 100,
    cpp: Math.round(cpp * 100) / 100,
    ei: Math.round(ei * 100) / 100,
    rrsp: Math.round(rrspAnnual * 100) / 100,
    unionDues: Math.round(unionDuesAnnual * 100) / 100,
    otherDeductions: Math.round(otherDeductionsAnnual * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netAnnual: Math.round(netAnnual * 100) / 100,
    netPerPeriod: Math.round(netPerPeriod * 100) / 100,
    payFrequency: input.payFrequency,
  };
}
