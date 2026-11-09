/**
 * Winnipeg reference figures used across the fun-fact and perspective cards.
 * Single source of truth so the numbers never drift between components.
 */
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
