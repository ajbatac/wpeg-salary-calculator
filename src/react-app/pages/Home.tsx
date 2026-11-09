import { useEffect, useMemo, useState } from 'react';
import { MapPin, Calculator, Info, TrendingDown, DollarSign, ExternalLink } from 'lucide-react';
import SalaryForm from '@/react-app/components/SalaryForm';
import SalaryBreakdownComponent from '@/react-app/components/SalaryBreakdown';
import DarkModeToggle from '@/react-app/components/DarkModeToggle';
import ShareButton from '@/react-app/components/ShareButton';
import ColorThemeSelector from '@/react-app/components/ColorThemeSelector';
import TableOfContents from '@/react-app/components/TableOfContents';
import { SalaryInput, SalaryBreakdown, DEFAULT_SALARY_INPUT } from '@/shared/types';
import {
  AVG_MONTHLY_RENT,
  CAPPUCCINO_PRICE,
  SMALL_SLURPEE_PRICE,
  WORK_HOURS_PER_YEAR,
  TAX_SOURCES,
  CRA_TAX_BRACKETS_URL,
  MANITOBA_TAX_RATES_URL,
} from '@/shared/constants';
import { calculateSalary, toAnnual } from '@/react-app/utils/salaryCalculator';
import { formatCurrency, formatCurrencyPrecise } from '@/react-app/utils/format';

const federalTaxBrackets = [
  { range: 'Up to $58,523', rate: '14%' },
  { range: '$58,523 – $117,045', rate: '20.5%' },
  { range: '$117,045 – $181,440', rate: '26%' },
  { range: '$181,440 – $258,482', rate: '29%' },
  { range: 'Above $258,482', rate: '33%' },
];

const manitobaTaxBrackets = [
  { range: 'Up to $47,564', rate: '10.8%' },
  { range: '$47,564 – $101,200', rate: '12.75%' },
  { range: 'Above $101,200', rate: '17.4%' },
];

const payrollContributions = [
  {
    label: 'CPP',
    rate: '5.95%',
    description: 'On earnings $3,500 – $74,600',
    accentClass: 'from-blue-500/20 to-transparent',
    textClass: 'text-blue-700 dark:text-blue-500',
    dotClass: 'bg-blue-500',
  },
  {
    label: 'CPP2',
    rate: '4.00%',
    description: 'On earnings $74,600 – $85,000',
    accentClass: 'from-blue-500/20 to-transparent',
    textClass: 'text-blue-700 dark:text-blue-500',
    dotClass: 'bg-blue-500',
  },
  {
    label: 'EI',
    rate: '1.63%',
    description: 'On earnings up to $68,900',
    accentClass: 'from-green-500/20 to-transparent',
    textClass: 'text-green-700 dark:text-green-500',
    dotClass: 'bg-green-500',
  },
];

interface CalculationResult {
  /** Snapshot of the input the breakdown was computed from. */
  sourceInput: SalaryInput;
  breakdown: SalaryBreakdown;
}

export default function Home() {
  const [salaryInput, setSalaryInput] = useState<SalaryInput>(DEFAULT_SALARY_INPUT);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Debounced calculation: recalculate 300ms after the last input change.
  // The timer callback is async, so no state is set synchronously in the effect body.
  useEffect(() => {
    const timer = setTimeout(() => {
      setResult({ sourceInput: salaryInput, breakdown: calculateSalary(salaryInput) });
    }, 300);
    return () => clearTimeout(timer);
  }, [salaryInput]);

  // The last computed breakdown (may briefly lag the input during the debounce window)
  // keeps the share button and fun cards stable while the next result is pending.
  const breakdown = result?.breakdown ?? null;
  // "Calculating" is derived: the latest input has no matching result yet.
  const isCalculating = result === null || result.sourceInput !== salaryInput;

  // Instant headline numbers for the masthead stat strip: pure and cheap, so it
  // updates on every keystroke without waiting for the debounced detail view.
  const instant = useMemo(() => calculateSalary(salaryInput), [salaryInput]);

  // Derived display values. Before the first (debounced) calculation lands,
  // annualize the raw input so the fallback cards never mix period and annual figures.
  const annualGross =
    breakdown?.grossAnnual ??
    toAnnual(salaryInput.grossSalary + salaryInput.additionalIncome, salaryInput.payFrequency);
  const monthlyGross = annualGross / 12;
  const weeklyGross = annualGross / 52;
  const hourlyGross = annualGross / WORK_HOURS_PER_YEAR;
  const rentPercentage = monthlyGross > 0 ? ((AVG_MONTHLY_RENT / monthlyGross) * 100).toFixed(1) : '—';

  const cppAmount = (breakdown?.cpp ?? 0) + (breakdown?.cpp2 ?? 0);
  const eiAmount = breakdown?.ei ?? 0;
  const totalDeductions = breakdown?.totalDeductions ?? 0;
  const cappuccinoCount = Math.floor(cppAmount / CAPPUCCINO_PRICE);
  const cappuccinosPerDay = Math.round((cappuccinoCount / 365) * 10) / 10;

  const couldBuyItems = [
    {
      title: 'Minimum Down Payment on a $500,000 Home',
      description:
        '$25,000 is the minimum down payment required in Canada for a $500,000 house, so your deductions could put you in a homeownership position.',
      icon: '🏠',
    },
    {
      title: 'A Brand New Compact Car',
      description:
        'Many new compact cars (like a Toyota Corolla or Honda Civic) are priced in the $25,000–$27,000 range.',
      icon: '🚗',
    },
    {
      title: "A Year's Rent for a Two-Bedroom Apartment in Winnipeg",
      description: `At the average rate of $1,562/month, you could cover about ${Math.floor(totalDeductions / 1562)} months of rent.`,
      icon: '🏠',
    },
    {
      title: 'High-End MacBook Pro M4 (Maxed Out)',
      description: `Top-tier MacBook Pro M4 models with large storage and memory options run close to $4,000—so you could buy ${Math.floor(totalDeductions / 4000)} with your deductions.`,
      icon: '💻',
    },
    {
      title: 'Premium Health Insurance Plan (Family Coverage)',
      description: `Comprehensive family plans often cost $2,000–$3,000/year; you could prepay for nearly ${Math.floor(totalDeductions / 2500)} years.`,
      icon: '🏥',
    },
    {
      title: 'Two Years of Groceries for a Small Family',
      description: 'Average annual grocery bill for a family of four is around $12,000–$13,000.',
      icon: '🛒',
    },
    {
      title: 'A Solar Panel System for Your Home',
      description: 'The average cost to install a residential solar system in Manitoba is $20,000–$25,000.',
      icon: '☀️',
    },
    {
      title: 'A Round-the-World Trip for Two',
      description:
        'A comfortable multi-country trip for two people, including flights and accommodations, can be done for $20,000–$25,000.',
      icon: '✈️',
    },
    {
      title: 'Tuition for a Four-Year Undergraduate Degree at University of Manitoba',
      description:
        'Average tuition for a local student is about $5,000–$7,000/year; you could pay for four years in advance.',
      icon: '🎓',
    },
    {
      title: 'A Used Camper Van for Prairie Road Trips',
      description:
        'Used camper vans and RVs often sell in the $20,000–$27,000 range, perfect for exploring Manitoba and beyond.',
      icon: '🚐',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="theme-surface border-b border-border sticky top-0 z-10 backdrop-blur-xl print:static print:border-none">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-card rounded-[var(--radius)] border border-border shadow-lg print:shadow-none">
                <img src="/logo.png" alt="WPEG logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-muted-foreground font-serif text-xl hidden sm:inline" aria-hidden="true">
                ×
              </span>
              <a
                href="https://portal.wpeg.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-card rounded-[var(--radius)] border border-border hover:border-primary/50 transition-colors hidden sm:flex items-center"
                aria-label="WPEG.app — part of the WPEG family"
              >
                <img
                  src="/wpeg-logo.png"
                  alt="WPEG.app — part of the WPEG family"
                  className="h-6 w-auto object-contain"
                />
              </a>
              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl tracking-tight font-bold text-foreground font-serif">
                  <a href="https://portal.wpeg.app/" target="_blank" rel="noopener noreferrer">
                    Winnipeg Salary Calculator 2026-2027
                  </a>
                </h1>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Part of the WPEG family · Manitoba, Canada</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              {breakdown && <ShareButton breakdown={breakdown} />}
              <ColorThemeSelector />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Editorial masthead: full-bleed ink band with the live answer up front.
          The band inverts the theme's own foreground/background pair, so it
          stays high-contrast under every palette and both display modes. */}
      <section className="ink-band relative overflow-hidden" aria-label="Introduction">
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-4 -bottom-20 font-serif font-bold leading-none text-[16rem] xl:text-[22rem] opacity-[0.05]"
        >
          2026
        </span>

        <div className="relative max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-14 xl:py-20">
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] xl:gap-16 items-start">
            <div>
              <h2 className="text-4xl sm:text-5xl xl:text-6xl font-bold font-serif tracking-tight leading-[1.05] mb-4 max-w-2xl [text-wrap:balance]">
                Calculate Your Net Take-Home Pay
              </h2>
              <p className="text-lg sm:text-xl max-w-2xl opacity-70 mb-8">
                Get accurate calculations for your salary after federal and Manitoba provincial taxes, CPP
                contributions, and EI premiums based on current 2026 tax rates.
              </p>

              {/* Navigation Pills (the left rail takes over on xl+ screens) */}
              <div className="flex flex-wrap gap-3 max-w-2xl xl:hidden">
                {[
                  { href: '#calculator', Icon: Calculator, label: 'Calculator' },
                  { href: '#tax-rates', Icon: Info, label: 'Tax Rates' },
                  { href: '#breakdown', Icon: TrendingDown, label: 'Breakdown' },
                  { href: '#coffee-coin', Icon: DollarSign, label: 'Coffee Coin' },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-background/30 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 hover:bg-background/10"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* The form lives in the masthead so visitors can start
                calculating the moment the page opens. */}
            <SalaryForm onInputChange={setSalaryInput} />
          </div>

          {/* Live stat strip: computed straight from the current input (no debounce),
              so the headline answer ticks as you type. */}
          <div className="mt-10 xl:mt-14 pt-8 border-t border-background/20 grid grid-cols-2 gap-x-6 gap-y-8 xl:grid-cols-4 pb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">
                Take-home per month
              </p>
              <p className="text-3xl xl:text-4xl font-bold tabular-nums tracking-tight">
                {formatCurrency(instant.netAnnual / 12)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">Net per year</p>
              <p className="text-3xl xl:text-4xl font-bold tabular-nums tracking-tight">
                {formatCurrency(instant.netAnnual)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">
                Total deductions
              </p>
              <p className="text-3xl xl:text-4xl font-semibold tabular-nums tracking-tight opacity-80">
                {formatCurrency(instant.totalDeductions)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">
                Effective tax rate
              </p>
              <p className="text-3xl xl:text-4xl font-semibold tabular-nums tracking-tight opacity-80">
                {instant.grossAnnual > 0
                  ? `${(((instant.federalTax + instant.provincialTax) / instant.grossAnnual) * 100).toFixed(1)}%`
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="main-content" className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-12">
        {/* Content with left jump-menu rail (xl+) */}
        <div className="xl:flex xl:items-start xl:gap-8">
          <TableOfContents />
          <div className="flex-1 min-w-0">
            {/* Calculator Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="calculator">
              {/* Input Form */}
              <div className="space-y-8">
                {/* Rent-to-Income Snapshot */}
                <div className="theme-card border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 theme-gradient-secondary rounded-[var(--radius)] shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">
                      Rent-to-Income Snapshot
                    </h3>
                  </div>

                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p className="mb-3">
                      The average apartment rent in August 2026 sits near{' '}
                      <strong className="text-foreground">$1,353 a month</strong>. At that price, just under{' '}
                      <strong className="text-primary">{rentPercentage}%</strong> of a{' '}
                      <strong className="text-primary">{formatCurrency(annualGross)}</strong> gross salary
                      would go to housing if you follow the classic &quot;30% rule.&quot;
                    </p>
                    <p>
                      It&apos;s one of the reasons Winnipeg routinely appears on{' '}
                      <strong className="text-foreground">&quot;most affordable Canadian cities&quot;</strong>{' '}
                      lists.
                    </p>
                  </div>
                </div>

                {/* Trivia and Fun Facts */}
                <div className="theme-card border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">
                      Trivia and Fun Facts
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-primary font-serif">Slurpee Capital Math</h4>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <p className="mb-3">
                        Winnipeg has been crowned{' '}
                        <strong className="text-foreground">&quot;Slurpee Capital of the World&quot;</strong>{' '}
                        by 7-Eleven for more than two decades, selling roughly{' '}
                        <strong className="text-foreground">190,000 cups every month</strong>.
                      </p>
                      <p>
                        If your weekly paycheque on a{' '}
                        <strong className="text-primary">{formatCurrency(annualGross)}</strong> salary is
                        about{' '}
                        <strong className="text-foreground">
                          {formatCurrency(weeklyGross)} before deductions
                        </strong>
                        , you could theoretically pick up{' '}
                        <strong className="text-primary">
                          {Math.floor(weeklyGross / SMALL_SLURPEE_PRICE).toLocaleString()} small Slurpees each
                          week
                        </strong>
                        —enough to treat a sold-out Jets game plus most of the arena staff.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sunshine Dividend */}
                <div className="theme-card border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">
                      Sunshine Dividend
                    </h3>
                  </div>

                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p className="mb-3">
                      Winnipeg enjoys around{' '}
                      <strong className="text-foreground">2,354 hours of sunshine a year</strong>, more than
                      London, Manchester or even Tokyo. When you divide that by a standard 2,000-hour work
                      year, your pay works out to earning during about{' '}
                      <strong className="text-primary">1.18 &quot;sun-hours&quot;</strong> for each hour
                      you&apos;re on the clock.
                    </p>
                    <p>
                      At <strong className="text-primary">{formatCurrencyPrecise(hourlyGross)}</strong> per
                      hour, you&apos;re essentially being paid{' '}
                      <strong className="text-primary">
                        {formatCurrencyPrecise(hourlyGross / 1.18)} per sun-hour
                      </strong>
                      —a uniquely Winnipeg way to measure your time&apos;s worth.
                    </p>
                  </div>
                </div>

                {/* Cold-Hard Perspective */}
                <div className="theme-card border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">
                      Cold-Hard Perspective
                    </h3>
                  </div>

                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p className="mb-3">
                      Locals joke about <strong className="text-foreground">&quot;Winterpeg,&quot;</strong>{' '}
                      yet climate data show roughly{' '}
                      <strong className="text-foreground">139 days each year</strong> dip below –5°C.
                      That&apos;s still fewer sub-zero days than paydays (
                      <strong className="text-primary">52</strong>) and far fewer than the{' '}
                      <strong className="text-primary">{cappuccinoCount.toLocaleString()} coffee days</strong>{' '}
                      your CPP math could buy.
                    </p>
                    <p>A little context can warm even the chilliest February.</p>
                  </div>
                </div>

                {/* Quick "Could-Buy" Comparisons */}
                <div className="theme-card border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 theme-gradient-secondary rounded-[var(--radius)] shadow-lg">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">
                      Quick &quot;Could-Buy&quot; Comparisons (Annual)
                    </h3>
                  </div>

                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>• Average two-bedroom rent:</span>
                        <strong className="text-foreground">$20,112</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>• Annual EI premium on {formatCurrency(annualGross)}:</span>
                        <strong className="text-primary">{formatCurrency(eiAmount)}</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>• Number of Slurpees Winnipeg buys city-wide:</span>
                        <strong className="text-foreground">~2.3 million</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>• Total sunshine minutes:</span>
                        <strong className="text-foreground">~141,000</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-xs italic">
                      Seeing deductions next to everyday figures helps users feel the numbers, not just read
                      them.
                    </p>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div id="breakdown">
                {isCalculating && (
                  <div className="theme-card text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                    <p className="text-muted-foreground">Calculating...</p>
                  </div>
                )}
                {!isCalculating && breakdown && <SalaryBreakdownComponent breakdown={breakdown} />}
              </div>
            </div>

            {/* Tax Information Banner */}
            <div className="mb-12 space-y-6" id="tax-rates">
              {/* 2026 Tax Rates */}
              <div className="theme-card border border-border">
                <div className="flex items-start gap-3 mb-6">
                  <Info className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl xl:text-3xl font-bold text-primary font-serif">
                      2026 Tax Rates Used
                    </h3>
                    <p className="text-sm text-foreground/80">
                      Rates effective January 1, 2026, indexed by the 2.0% CRA factor.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Federal Tax Rates */}
                  <section className="space-y-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                    <header className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <h4 className="text-xl font-semibold text-foreground font-serif">
                          Federal Tax Brackets
                        </h4>
                      </div>
                      <a
                        href={CRA_TAX_BRACKETS_URL}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-foreground/90 hover:text-primary hover:underline"
                      >
                        CRA 2026 <ExternalLink className="w-3 h-3" />
                      </a>
                    </header>
                    <div className="space-y-3">
                      {federalTaxBrackets.map((bracket) => (
                        <div
                          key={bracket.range}
                          className="flex items-center justify-between rounded-xl px-4 py-3 bg-background border border-border"
                        >
                          <span className="text-base font-semibold text-foreground">{bracket.range}</span>
                          <span className="text-3xl font-bold text-red-600 dark:text-red-500">
                            {bracket.rate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Provincial & Other Rates */}
                  <div className="space-y-4">
                    {/* Manitoba Tax Rates */}
                    <section className="space-y-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                      <header className="flex items-center justify-between border-b border-border/50 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500" />
                          <h4 className="text-xl font-semibold text-foreground font-serif">
                            Manitoba Provincial Tax
                          </h4>
                        </div>
                        <a
                          href={MANITOBA_TAX_RATES_URL}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-foreground/90 hover:text-primary hover:underline"
                        >
                          MB Finance <ExternalLink className="w-3 h-3" />
                        </a>
                      </header>
                      <div className="space-y-3">
                        {manitobaTaxBrackets.map((bracket) => (
                          <div
                            key={bracket.range}
                            className="flex items-center justify-between rounded-xl px-4 py-3 bg-background border border-border"
                          >
                            <span className="text-base font-semibold text-foreground">{bracket.range}</span>
                            <span className="text-3xl font-bold text-orange-600 dark:text-orange-500">
                              {bracket.rate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* CPP & EI Rates */}
                    <div className="grid grid-cols-1 gap-3">
                      {payrollContributions.map((item) => (
                        <div
                          key={item.label}
                          className={`rounded-2xl border border-border bg-gradient-to-r ${item.accentClass} bg-card px-4 py-4 shadow-sm`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${item.dotClass}`} />
                              <span className="text-xl font-semibold text-foreground">{item.label}</span>
                            </div>
                            <span className={`text-3xl font-bold ${item.textClass}`}>{item.rate}</span>
                          </div>
                          <p className="text-base text-foreground/80 mt-2">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Information */}
            <div className="mt-12 theme-card" id="important-notes">
              <h3 className="text-2xl font-bold text-foreground font-serif mb-3">Important Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Accuracy</h4>
                  <p>
                    This calculator uses official 2026 federal and Manitoba tax brackets, basic personal
                    amount credits, and CPP, CPP2 and EI maximums. Results are estimates and should not
                    replace professional tax advice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Privacy</h4>
                  <p>
                    All calculations are performed locally in your browser. No salary information is stored or
                    transmitted.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Limitations</h4>
                  <p>
                    This calculator does not include some deductions like health benefits, parking, or
                    employer-specific deductions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Updates</h4>
                  <p>
                    Tax rates are updated annually. Please verify current rates with the Canada Revenue Agency
                    for the most accurate calculations.
                  </p>
                </div>
              </div>
            </div>

            {/* Coffee Coin Section */}
            <div
              className="mt-8 theme-card border border-amber-400/30 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10"
              id="coffee-coin"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-[var(--radius)] shadow-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl xl:text-4xl font-bold text-amber-700 dark:text-amber-300 font-serif">
                    Coffee Coin
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Putting your CPP contribution into perspective
                  </p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-amber-950/30 rounded-[var(--radius)] p-6 border border-amber-200/50 dark:border-amber-800/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">$3.53</div>
                    <div className="text-sm text-amber-700 dark:text-amber-400">Average cappuccino price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                      {formatCurrency(cppAmount)}
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-400">
                      Your annual CPP contribution
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                      {cappuccinoCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-400">Cappuccinos per year</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border border-amber-200/30 dark:border-amber-800/20">
                  <p className="text-lg font-medium text-amber-800 dark:text-amber-200">
                    That&apos;s{' '}
                    <strong className="text-2xl text-amber-700 dark:text-amber-300">
                      {cappuccinosPerDay} cappuccinos
                    </strong>{' '}
                    every single day of the year
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                    With enough change left over for a pastry on Fridays! ☕️
                  </p>
                </div>
              </div>
            </div>

            {/* What Your Deductions Could Buy */}
            <div
              className="mt-8 theme-card border border-emerald-400/30 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10"
              id="could-buy"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[var(--radius)] shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl xl:text-4xl font-bold text-emerald-700 dark:text-emerald-300 font-serif">
                    What Your Deductions Could Buy
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Here are ten useful products or purchases you could make with{' '}
                    <strong className="text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(totalDeductions)}
                    </strong>
                    —the total amount deducted from your salary in a year
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {couldBuyItems.map((item, index) => (
                  <div
                    key={item.title}
                    className="bg-white/60 dark:bg-black/30 rounded-[var(--radius)] p-4 border border-emerald-100/50 dark:border-emerald-800/30 hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-1 flex-shrink-0">{item.icon}</div>
                      <div>
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2 font-serif">
                          {index + 1}. {item.title}
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-100 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200/30 dark:border-emerald-800/20 text-center">
                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100">
                  This puts your annual deductions in perspective: They&apos;re enough to buy a car, cover a
                  mortgage down payment, or fund major life experiences.
                </p>
              </div>
            </div>
            {/* References: Wikipedia-style citation list, at the very bottom */}
            <div className="mt-12" id="sources">
              <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif mb-1">References</h3>
              <div className="h-px bg-border mb-4" aria-hidden="true" />
              <ol className="space-y-2.5">
                {TAX_SOURCES.map((source, index) => (
                  <li key={source.url} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="text-primary font-semibold select-none" aria-hidden="true">
                      [{index + 1}]
                    </span>
                    <span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {source.label}
                      </a>
                      <span className="text-muted-foreground"> — {source.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs italic text-muted-foreground">
                All rates last verified against these publications in November 2026.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
