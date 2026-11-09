/**
 * Winnipeg reference figures used across the fun-fact and perspective cards.
 * Single source of truth so the numbers never drift between components.
 */

/** App version shown in the footer; keep in sync with package.json. */
export const APP_VERSION = 'v1.1.0';
export const PORTAL_URL = 'https://portal.wpeg.app';

export const AVG_MONTHLY_RENT = 1353;
export const CAPPUCCINO_PRICE = 3.53;
export const SMALL_SLURPEE_PRICE = 2;
export const WORK_HOURS_PER_YEAR = 2000;
export const SLURPEE_MONTHLY_CUPS = 190000;
export const AVG_DAYS_PER_MONTH = 30.44;
/** Daily city-wide Slurpee spend, derived from the monthly cup figure. */
export const SLURPEE_DAILY_COST = (SLURPEE_MONTHLY_CUPS / AVG_DAYS_PER_MONTH) * SMALL_SLURPEE_PRICE;
export const SLURPEE_DAILY_CUPS = Math.round(SLURPEE_MONTHLY_CUPS / AVG_DAYS_PER_MONTH);
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export interface TaxSource {
  label: string;
  description: string;
  url: string;
}

/** Official publications backing every 2026 rate used by the calculator (URLs verified live). */
export const CRA_TAX_BRACKETS_URL =
  'https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html';
export const MANITOBA_TAX_RATES_URL = 'https://www.gov.mb.ca/finance/personal/ptaxes.html';

export const TAX_SOURCES: readonly TaxSource[] = [
  {
    label: 'CRA — Federal and provincial tax rates and brackets',
    description: '2026 federal brackets (14%–33%), indexation factor, and basic personal amounts.',
    url: CRA_TAX_BRACKETS_URL,
  },
  {
    label: 'CRA — CPP contribution rates, maximums and exemptions',
    description: '2026 YMPE $74,600, $3,500 exemption, 5.95% rate, maximum $4,230.45.',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums-exemptions.html',
  },
  {
    label: 'CRA — Second additional CPP (CPP2) rates and maximums',
    description: '2026 YAMPE $85,000, 4.00% rate, maximum $416.00.',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/calculating-deductions/making-deductions/second-additional-cpp-contribution-rates-maximums.html',
  },
  {
    label: 'CRA — EI premium rates and maximums',
    description: '2026 employee rate 1.63%, maximum insurable earnings $68,900, maximum premium $1,123.07.',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html',
  },
  {
    label: 'Manitoba Finance — Personal Income Taxes',
    description: 'Manitoba brackets (10.8% / 12.75% / 17.4%) and annual indexation.',
    url: MANITOBA_TAX_RATES_URL,
  },
  {
    label: 'Manitoba Finance — Personal Tax Credits',
    description: 'Manitoba basic personal amount and the $200k–$400k phase-out.',
    url: 'https://www.gov.mb.ca/finance/personal/pcredits.html',
  },
];
