import {
  SalaryInput,
  SalaryBreakdown,
  PayFrequency,
  TaxBracket,
  FEDERAL_TAX_BRACKETS,
  MANITOBA_TAX_BRACKETS,
  FEDERAL_BPA_MAX,
  FEDERAL_BPA_FLOOR,
  FEDERAL_BPA_PHASEOUT_START,
  FEDERAL_BPA_PHASEOUT_RATE,
  MANITOBA_BPA_MAX,
  MANITOBA_BPA_PHASEOUT_START,
  MANITOBA_BPA_PHASEOUT_END,
  CPP_RATE,
  CPP_MAX_EARNINGS,
  CPP_BASIC_EXEMPTION,
  CPP2_RATE,
  CPP2_MAX_EARNINGS,
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
  return tax;
}

/**
 * Federal basic personal amount for 2026. The enhanced portion is reduced by
 * 3% of income above the phase-out start, never falling below the floor.
 */
function federalBasicPersonalAmount(netIncome: number): number {
  const reduction = FEDERAL_BPA_PHASEOUT_RATE * Math.max(0, netIncome - FEDERAL_BPA_PHASEOUT_START);
  return Math.max(FEDERAL_BPA_FLOOR, FEDERAL_BPA_MAX - reduction);
}

/** Manitoba basic personal amount for 2026: phased out linearly from $200k to $400k. */
function manitobaBasicPersonalAmount(netIncome: number): number {
  if (netIncome <= MANITOBA_BPA_PHASEOUT_START) return MANITOBA_BPA_MAX;
  if (netIncome >= MANITOBA_BPA_PHASEOUT_END) return 0;
  const phaseOutFraction =
    (netIncome - MANITOBA_BPA_PHASEOUT_START) / (MANITOBA_BPA_PHASEOUT_END - MANITOBA_BPA_PHASEOUT_START);
  return MANITOBA_BPA_MAX * (1 - phaseOutFraction);
}

/** Tax after applying the BPA non-refundable credit (valued at the lowest bracket rate). */
function taxAfterCredits(income: number, brackets: TaxBracket[], basicPersonalAmount: number): number {
  const credit = basicPersonalAmount * brackets[0].rate;
  return Math.max(0, roundToCents(calculateTax(income, brackets) - credit));
}

/** Base CPP: 5.95% on pensionable earnings between the exemption and the YMPE. */
function calculateCPP(annualIncome: number): number {
  const pensionableIncome = Math.min(nonNegative(annualIncome), CPP_MAX_EARNINGS) - CPP_BASIC_EXEMPTION;
  return roundToCents(Math.max(0, pensionableIncome) * CPP_RATE);
}

/** CPP2 (enhancement tier): 4.00% on earnings between the YMPE and the YAMPE. */
function calculateCPP2(annualIncome: number): number {
  const enhancedIncome = Math.min(nonNegative(annualIncome), CPP2_MAX_EARNINGS) - CPP_MAX_EARNINGS;
  return roundToCents(Math.max(0, enhancedIncome) * CPP2_RATE);
}

/** EI: employee premium of 1.63% on insurable earnings up to the MIE. */
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

  const federalTax = taxAfterCredits(
    taxableIncome,
    FEDERAL_TAX_BRACKETS,
    federalBasicPersonalAmount(taxableIncome),
  );
  const provincialTax = taxAfterCredits(
    taxableIncome,
    MANITOBA_TAX_BRACKETS,
    manitobaBasicPersonalAmount(taxableIncome),
  );

  // CPP, CPP2 and EI are based on total gross income, not the RRSP-reduced amount.
  const cpp = calculateCPP(totalGrossIncome);
  const cpp2 = calculateCPP2(totalGrossIncome);
  const ei = calculateEI(totalGrossIncome);

  const totalDeductions =
    federalTax + provincialTax + cpp + cpp2 + ei + rrspAnnual + unionDuesAnnual + otherDeductionsAnnual;
  const netAnnual = totalGrossIncome - totalDeductions;

  return {
    grossAnnual: roundToCents(totalGrossIncome),
    grossPerPeriod: roundToCents(fromAnnual(totalGrossIncome, payFrequency)),
    federalTax,
    provincialTax,
    cpp,
    cpp2,
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
