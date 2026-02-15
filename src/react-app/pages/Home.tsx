import { useState, useEffect, useCallback } from 'react';
import { MapPin, Calculator, Info, TrendingDown, DollarSign } from 'lucide-react';
import SalaryForm from '@/react-app/components/SalaryForm';
import SalaryBreakdownComponent from '@/react-app/components/SalaryBreakdown';
import DarkModeToggle from '@/react-app/components/DarkModeToggle';
import ShareButton from '@/react-app/components/ShareButton';
import { SalaryInput, SalaryBreakdown } from '@/shared/types';
import { calculateSalary } from '@/react-app/utils/salaryCalculator';

const federalTaxBrackets = [
  { range: 'Up to $55,867', rate: '15%' },
  { range: '$55,867 – $111,733', rate: '20.5%' },
  { range: '$111,733 – $173,205', rate: '26%' },
  { range: '$173,205 – $246,752', rate: '29%' },
  { range: 'Above $246,752', rate: '33%' },
];

const manitobaTaxBrackets = [
  { range: 'Up to $36,842', rate: '10.8%' },
  { range: '$36,843 – $79,625', rate: '12.75%' },
  { range: 'Above $79,625', rate: '17.4%' },
];

const payrollContributions = [
  {
    label: 'CPP',
    rate: '5.95%',
    description: 'On earnings $3,500 – $68,500',
    accentClass: 'from-blue-500/20 to-transparent',
    textClass: 'text-blue-500',
    dotClass: 'bg-blue-500',
  },
  {
    label: 'EI',
    rate: '1.66%',
    description: 'On earnings up to $63,200',
    accentClass: 'from-green-500/20 to-transparent',
    textClass: 'text-green-500',
    dotClass: 'bg-green-500',
  },
];


export default function Home() {
  const [salaryInput, setSalaryInput] = useState<SalaryInput>({
    grossSalary: 65000,
    payFrequency: 'annual',
    employmentType: 'full-time',
    additionalIncome: 0,
    rrspContributions: 0,
    unionDues: 0,
    otherDeductions: 0,
  });

  const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Debounced calculation
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const result = calculateSalary(salaryInput);
      setBreakdown(result);
      setIsCalculating(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [salaryInput]);

  const handleInputChange = useCallback((input: SalaryInput) => {
    setSalaryInput(input);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="theme-surface border-b border-border sticky top-0 z-10 backdrop-blur-xl print:static print:border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-card rounded-[var(--radius)] border border-border shadow-lg print:shadow-none">
                <img
                  src="/logo.png"
                  alt="WPEG logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-serif"><a href='https://portal.wpeg.app/' target='_blank' rel='noopener noreferrer'>WPEG: Winnipeg Salary Calculator 2026</a></h1>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Manitoba, Canada</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              {breakdown && <ShareButton breakdown={breakdown} />}
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Calculate Your Net Take-Home Pay
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Get accurate calculations for your salary after federal and Manitoba provincial taxes, 
            CPP contributions, and EI premiums based on current 2026 tax rates.
          </p>
          
          {/* Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            <a
              href="#tax-rates"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <Info className="w-4 h-4" />
              Tax Rates
            </a>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <Calculator className="w-4 h-4" />
              Calculator
            </a>
            <a
              href="#breakdown"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <TrendingDown className="w-4 h-4" />
              Breakdown
            </a>
            <a
              href="#coffee-coin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <DollarSign className="w-4 h-4" />
              Coffee Coin
            </a>
          </div>
        </div>

        {/* Tax Information Banner */}
        <div className="mb-8 space-y-6" id="tax-rates">
          {/* 2026 Tax Rates */}
          <div className="theme-card border border-border">
            <div className="flex items-start gap-3 mb-6">
              <Info className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-primary font-serif">2026 Tax Rates Used</h3>
                <p className="text-sm text-foreground/80">
                  High-contrast cards make it easier to skim each bracket at a glance.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Federal Tax Rates */}
              <section className="space-y-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <header className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <h4 className="text-lg font-semibold text-foreground font-serif">Federal Tax Brackets</h4>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-foreground/70">CRA 2026</span>
                </header>
                <div className="space-y-3">
                  {federalTaxBrackets.map((bracket) => (
                    <div
                      key={bracket.range}
                      className="flex items-center justify-between rounded-xl px-4 py-3 bg-background border border-border"
                    >
                      <span className="text-base font-semibold text-foreground">{bracket.range}</span>
                      <span className="text-2xl font-bold text-red-500">{bracket.rate}</span>
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
                      <h4 className="text-lg font-semibold text-foreground font-serif">Manitoba Provincial Tax</h4>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-foreground/70">2026 Budget</span>
                  </header>
                  <div className="space-y-3">
                    {manitobaTaxBrackets.map((bracket) => (
                      <div
                        key={bracket.range}
                        className="flex items-center justify-between rounded-xl px-4 py-3 bg-background border border-border"
                      >
                        <span className="text-base font-semibold text-foreground">{bracket.range}</span>
                        <span className="text-2xl font-bold text-orange-500">{bracket.rate}</span>
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
                        <span className={`text-2xl font-bold ${item.textClass}`}>{item.rate}</span>
                      </div>
                      <p className="text-base text-foreground/80 mt-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="calculator">
          {/* Input Form */}
          <div className="space-y-8">
            <SalaryForm onInputChange={handleInputChange} />
            
            {/* Rent-to-Income Snapshot */}
            <div className="theme-card border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 theme-gradient-secondary rounded-[var(--radius)] shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-serif">Rent-to-Income Snapshot</h3>
              </div>
              
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="mb-3">
                  The average apartment rent in August 2026 sits near <strong className="text-foreground">$1,353 a month</strong>.
                  At that price, just under <strong className="text-primary">
                    {(() => {
                      const monthlyGross = breakdown ? breakdown.grossAnnual / 12 : salaryInput.grossSalary / 12;
                      const rentPercentage = (1353 / monthlyGross * 100).toFixed(1);
                      return `${rentPercentage}%`;
                    })()}
                  </strong> of a {(() => {
                    const displaySalary = breakdown ? breakdown.grossAnnual : salaryInput.grossSalary;
                    return new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(displaySalary);
                  })()} gross salary would go to housing if you follow the classic "30% rule."
                </p>
                <p>
                  It's one of the reasons Winnipeg routinely appears on <strong className="text-foreground">"most affordable Canadian cities"</strong> lists.
                </p>
              </div>
            </div>

            {/* Trivia and Fun Facts */}
            <div className="theme-card border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-serif">Trivia and Fun Facts</h3>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-primary font-serif">Slurpee Capital Math</h4>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p className="mb-3">
                    Winnipeg has been crowned <strong className="text-foreground">"Slurpee Capital of the World"</strong> by 7-Eleven 
                    for more than two decades, selling roughly <strong className="text-foreground">190,000 cups every month</strong>.
                  </p>
                  <p>
                    If your weekly paycheque on a {(() => {
                      const displaySalary = breakdown ? breakdown.grossAnnual : salaryInput.grossSalary;
                      return new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(displaySalary);
                    })()} salary is about <strong className="text-foreground">{(() => {
                      const weeklyGross = breakdown ? breakdown.grossAnnual / 52 : salaryInput.grossSalary / 52;
                      return new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(weeklyGross);
                    })()} before deductions</strong>, 
                    you could theoretically pick up <strong className="text-primary">{(() => {
                      const weeklyGross = breakdown ? breakdown.grossAnnual / 52 : salaryInput.grossSalary / 52;
                      const slurpees = Math.floor(weeklyGross / 2); // Assuming $2 per small Slurpee
                      return slurpees.toLocaleString();
                    })()} small Slurpees each week</strong>—enough 
                    to treat a sold-out Jets game plus most of the arena staff.
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
                <h3 className="text-xl font-bold text-foreground font-serif">Sunshine Dividend</h3>
              </div>
              
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="mb-3">
                  Winnipeg enjoys around <strong className="text-foreground">2,354 hours of sunshine a year</strong>, 
                  more than London, Manchester or even Tokyo. When you divide that by a standard 2,000-hour work year, 
                  your pay works out to earning during about <strong className="text-primary">1.18 "sun-hours"</strong> for 
                  each hour you're on the clock.
                </p>
                <p>
                  At {(() => {
                    const hourlyRate = breakdown ? breakdown.grossAnnual / 2000 : salaryInput.grossSalary / 2000;
                    return new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(hourlyRate);
                  })()} per hour, you're essentially being paid <strong className="text-primary">{(() => {
                    const hourlyRate = breakdown ? breakdown.grossAnnual / 2000 : salaryInput.grossSalary / 2000;
                    const sunHourRate = hourlyRate / 1.18;
                    return new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(sunHourRate);
                  })()} per sun-hour</strong>—a uniquely Winnipeg way to measure your time's worth.
                </p>
              </div>
            </div>

            {/* Cold-Hard Perspective */}
            <div className="theme-card border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-serif">Cold-Hard Perspective</h3>
              </div>
              
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="mb-3">
                  Locals joke about <strong className="text-foreground">"Winterpeg,"</strong> yet climate data show roughly <strong className="text-foreground">139 days each year</strong> dip below –5°C. 
                  That's still fewer sub-zero days than paydays (<strong className="text-primary">52</strong>) and far fewer than the <strong className="text-primary">{(() => {
                    const cppAmount = breakdown ? breakdown.cpp : 0;
                    const cappuccinos = Math.floor(cppAmount / 3.53);
                    return cappuccinos.toLocaleString();
                  })()} coffee days</strong> your CPP math could buy.
                </p>
                <p>
                  A little context can warm even the chilliest February.
                </p>
              </div>
            </div>

            {/* Quick "Could-Buy" Comparisons */}
            <div className="theme-card border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 theme-gradient-secondary rounded-[var(--radius)] shadow-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-serif">Quick "Could-Buy" Comparisons (Annual)</h3>
              </div>
              
              <div className="text-sm text-muted-foreground leading-relaxed">
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>• Average two-bedroom rent:</span>
                    <strong className="text-foreground">$20,112</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Annual EI premium on {(() => {
                      const displaySalary = breakdown ? breakdown.grossAnnual : salaryInput.grossSalary;
                      return new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(displaySalary);
                    })()}:</span>
                    <strong className="text-primary">{(() => {
                      const eiAmount = breakdown ? breakdown.ei : 0;
                      return new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(eiAmount);
                    })()}</strong>
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
                  Seeing deductions next to everyday figures helps users feel the numbers, not just read them.
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

        {/* Footer Information */}
        <div className="mt-12 theme-card">
          <h3 className="text-lg font-bold text-foreground mb-3">Important Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Accuracy</h4>
              <p>This calculator uses 2026 federal and Manitoba tax rates. Results are estimates and should not replace professional tax advice.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Privacy</h4>
              <p>All calculations are performed locally in your browser. No salary information is stored or transmitted.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Limitations</h4>
              <p>This calculator does not include some deductions like health benefits, parking, or employer-specific deductions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Updates</h4>
              <p>Tax rates are updated annually. Please verify current rates with the Canada Revenue Agency for the most accurate calculations.</p>
            </div>
          </div>
        </div>

        {/* Coffee Coin Section */}
        <div className="mt-8 theme-card border border-amber-400/30 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10" id="coffee-coin">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-[var(--radius)] shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300 font-serif">Coffee Coin</h3>
              <p className="text-sm text-amber-600 dark:text-amber-400">Putting your CPP contribution into perspective</p>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-amber-950/30 rounded-[var(--radius)] p-6 border border-amber-200/50 dark:border-amber-800/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">$3.53</div>
                <div className="text-sm text-amber-600 dark:text-amber-400">Average cappuccino price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                  {(() => {
                    const cppAmount = breakdown ? breakdown.cpp : 0;
                    return new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(cppAmount);
                  })()}
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-400">Your annual CPP contribution</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                  {(() => {
                    const cppAmount = breakdown ? breakdown.cpp : 0;
                    const cappuccinos = Math.floor(cppAmount / 3.53);
                    return cappuccinos.toLocaleString();
                  })()}
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-400">Cappuccinos per year</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border border-amber-200/30 dark:border-amber-800/20">
              <p className="text-lg font-medium text-amber-800 dark:text-amber-200">
                That's <strong className="text-2xl text-amber-700 dark:text-amber-300">{(() => {
                  const cppAmount = breakdown ? breakdown.cpp : 0;
                  const cappuccinos = Math.floor(cppAmount / 3.53);
                  const perDay = Math.round(cappuccinos / 365 * 10) / 10;
                  return perDay;
                })()} cappuccinos</strong> every single day of the year
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                With enough change left over for a pastry on Fridays! ☕️
              </p>
            </div>
          </div>
        </div>

        {/* What Your Deductions Could Buy */}
        <div className="mt-8 theme-card border border-emerald-400/30 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[var(--radius)] shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 font-serif">What Your Deductions Could Buy</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Here are ten useful products or purchases you could make with{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {(() => {
                    const totalDeductions = breakdown ? breakdown.totalDeductions : 0;
                    return new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalDeductions);
                  })()}
                </strong>
                —the total amount deducted from your salary in a year
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                title: "Minimum Down Payment on a $500,000 Home",
                description: "$25,000 is the minimum down payment required in Canada for a $500,000 house, so your deductions could put you in a homeownership position.",
                icon: "🏠"
              },
              {
                title: "A Brand New Compact Car",
                description: "Many new compact cars (like a Toyota Corolla or Honda Civic) are priced in the $25,000–$27,000 range.",
                icon: "🚗"
              },
              {
                title: "A Year's Rent for a Two-Bedroom Apartment in Winnipeg",
                description: (() => {
                  const totalDeductions = breakdown ? breakdown.totalDeductions : 0;
                  const months = Math.floor(totalDeductions / 1562);
                  return `At the average rate of $1,562/month, you could cover about ${months} months of rent.`;
                })(),
                icon: "🏠"
              },
              {
                title: "High-End MacBook Pro M4 (Maxed Out)",
                description: (() => {
                  const totalDeductions = breakdown ? breakdown.totalDeductions : 0;
                  const macbooks = Math.floor(totalDeductions / 4000);
                  return `Top-tier MacBook Pro M4 models with large storage and memory options run close to $4,000—so you could buy ${macbooks} with your deductions.`;
                })(),
                icon: "💻"
              },
              {
                title: "Premium Health Insurance Plan (Family Coverage)",
                description: (() => {
                  const totalDeductions = breakdown ? breakdown.totalDeductions : 0;
                  const years = Math.floor(totalDeductions / 2500);
                  return `Comprehensive family plans often cost $2,000–$3,000/year; you could prepay for nearly ${years} years.`;
                })(),
                icon: "🏥"
              },
              {
                title: "Two Years of Groceries for a Small Family",
                description: "Average annual grocery bill for a family of four is around $12,000–$13,000.",
                icon: "🛒"
              },
              {
                title: "A Solar Panel System for Your Home",
                description: "The average cost to install a residential solar system in Manitoba is $20,000–$25,000.",
                icon: "☀️"
              },
              {
                title: "A Round-the-World Trip for Two",
                description: "A comfortable multi-country trip for two people, including flights and accommodations, can be done for $20,000–$25,000.",
                icon: "✈️"
              },
              {
                title: "Tuition for a Four-Year Undergraduate Degree at University of Manitoba",
                description: "Average tuition for a local student is about $5,000–$7,000/year; you could pay for four years in advance.",
                icon: "🎓"
              },
              {
                title: "A Used Camper Van for Prairie Road Trips",
                description: "Used camper vans and RVs often sell in the $20,000–$27,000 range, perfect for exploring Manitoba and beyond.",
                icon: "🚐"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/60 dark:bg-black-950/30 rounded-[var(--radius)] p-4 border border-emerald-100/50 dark:border-emerald-800/30 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1 flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2 font-serif">
                      {index + 1}. {item.title}
                    </h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-100 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200/30 dark:border-emerald-800/20 text-center">
            <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100">
              This puts your annual deductions in perspective: They're enough to buy a car, cover a mortgage down payment, or fund major life experiences.
            </p>
          </div>
        </div>
        <div className="mt-12 theme-card border border-blue-400/30 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10">
          <a href='https://portal.wpeg.app/' target='_blank' rel='noopener noreferrer'>&lt;&lt; Back to WPEG</a>
        </div>
      </main>
    </div>
  );
}
