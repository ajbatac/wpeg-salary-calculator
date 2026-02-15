import z from "zod";

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
  ei: number;
  rrsp: number;
  unionDues: number;
  otherDeductions: number;
  totalDeductions: number;
  netAnnual: number;
  netPerPeriod: number;
  payFrequency: PayFrequency;
}

// 2026 Tax Brackets and Rates
export const FEDERAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 55867, rate: 0.15 },
  { min: 55867, max: 111733, rate: 0.205 },
  { min: 111733, max: 173205, rate: 0.26 },
  { min: 173205, max: 246752, rate: 0.29 },
  { min: 246752, max: null, rate: 0.33 },
];

export const MANITOBA_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 36842, rate: 0.108 },
  { min: 36842, max: 79625, rate: 0.1275 },
  { min: 79625, max: null, rate: 0.174 },
];

// 2026 CPP and EI Rates
export const CPP_RATE = 0.0595;
export const CPP_MAX_EARNINGS = 68500;
export const CPP_BASIC_EXEMPTION = 3500;

export const EI_RATE = 0.0166;
export const EI_MAX_EARNINGS = 63200;
