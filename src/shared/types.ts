import { z } from 'zod';

export const PayFrequencySchema = z.enum(['annual', 'monthly', 'bi-weekly', 'weekly']);
export type PayFrequency = z.infer<typeof PayFrequencySchema>;

export const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract']);
export type EmploymentType = z.infer<typeof EmploymentTypeSchema>;

export const SalaryInputSchema = z.object({
  grossSalary: z.number().min(0),
  payFrequency: PayFrequencySchema,
  employmentType: EmploymentTypeSchema,
  additionalIncome: z.number().min(0).optional().default(0),
  rrspContributions: z.number().min(0).optional().default(0),
  unionDues: z.number().min(0).optional().default(0),
  otherDeductions: z.number().min(0).optional().default(0),
});

export type SalaryInput = z.infer<typeof SalaryInputSchema>;

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface SalaryBreakdown {
  grossAnnual: number;
  grossPerPeriod: number;
  federalTax: number;
  provincialTax: number;
  cpp: number;
  cpp2: number;
  ei: number;
  rrsp: number;
  unionDues: number;
  otherDeductions: number;
  totalDeductions: number;
  netAnnual: number;
  netPerPeriod: number;
  payFrequency: PayFrequency;
}

/** Number of pay periods per year for each supported frequency. */
export const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  annual: 1,
  monthly: 12,
  'bi-weekly': 26,
  weekly: 52,
};

/** Single source of truth for the initial form state shared by form and page. */
export const DEFAULT_SALARY_INPUT: SalaryInput = {
  grossSalary: 65000,
  payFrequency: 'annual',
  employmentType: 'full-time',
  additionalIncome: 0,
  rrspContributions: 0,
  unionDues: 0,
  otherDeductions: 0,
};

// 2026 Tax Brackets and Rates (CRA-indexed, 2.0% factor)
export const FEDERAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 58523, rate: 0.14 },
  { min: 58523, max: 117045, rate: 0.205 },
  { min: 117045, max: 181440, rate: 0.26 },
  { min: 181440, max: 258482, rate: 0.29 },
  { min: 258482, max: null, rate: 0.33 },
];

export const MANITOBA_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 47564, rate: 0.108 },
  { min: 47564, max: 101200, rate: 0.1275 },
  { min: 101200, max: null, rate: 0.174 },
];

// Basic Personal Amounts (non-refundable credits valued at the lowest bracket rate).
// Federal: enhanced BPA is reduced by 3% of income above the phase-out start,
// down to the un-enhanced floor. Manitoba: phased out linearly $200k–$400k.
export const FEDERAL_BPA_MAX = 16452;
export const FEDERAL_BPA_FLOOR = 14829;
export const FEDERAL_BPA_PHASEOUT_START = 181440;
export const FEDERAL_BPA_PHASEOUT_RATE = 0.03;

export const MANITOBA_BPA_MAX = 16140;
export const MANITOBA_BPA_PHASEOUT_START = 200000;
export const MANITOBA_BPA_PHASEOUT_END = 400000;

// 2026 CPP: base 5.95% between the exemption and YMPE; CPP2 4.00% up to YAMPE.
export const CPP_RATE = 0.0595;
export const CPP_MAX_EARNINGS = 74600;
export const CPP_BASIC_EXEMPTION = 3500;

export const CPP2_RATE = 0.04;
export const CPP2_MAX_EARNINGS = 85000;

// 2026 EI (employee rate; max annual premium $1,123.07)
export const EI_RATE = 0.0163;
export const EI_MAX_EARNINGS = 68900;
