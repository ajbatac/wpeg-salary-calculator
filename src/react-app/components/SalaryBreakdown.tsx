import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, MapPin } from 'lucide-react';
import { SalaryBreakdown } from '@/shared/types';
import {
  AVG_MONTHLY_RENT,
  CAPPUCCINO_PRICE,
  MONTH_NAMES,
  SLURPEE_DAILY_COST,
  SLURPEE_DAILY_CUPS,
} from '@/shared/constants';
import { formatCurrency, formatPayFrequency } from '@/react-app/utils/format';

interface SalaryBreakdownProps {
  breakdown: SalaryBreakdown;
}

const TRIVIA_FACTS = [
  "Winnipeg has more trees per capita than any other prairie city, with over 400,000 boulevard trees. That's roughly one tree for every two residents.",
  "The city's underground walkway system spans 30 blocks, originally built in the 1970s to help workers escape winter temperatures that can drop to -40°C.",
  "Winnipeg's Portage and Main intersection was once called 'the windiest corner in Canada' due to unique wind tunnel effects between buildings.",
  'The Royal Canadian Mint produces coins for over 75 countries worldwide right here in Winnipeg, including Canada\u2019s own currency.',
  'Winnipeg is home to the world\u2019s longest naturally frozen skating trail at 10 kilometers along the Red and Assiniboine rivers.',
  'The city consumes more Slurpees per capita than anywhere else in the world, even during winter months when temperatures plummet.',
  "Winnipeg's Exchange District has the largest collection of heritage buildings in North America, with over 150 heritage structures.",
  'The city experiences more sunshine hours annually than Vancouver, Toronto, or Montreal despite its harsh winter reputation.',
  "Winnipeg's Grand Beach was rated as one of the world's best beaches by Playboy magazine in the 1960s for its fine white sand.",
  'The Forks Market sits at the historic meeting point of two rivers and has been a trading post for over 6,000 years.',
  "Winnipeg Transit operates one of North America's most extensive rapid transit systems for a city its size.",
  "The city is home to Canada's oldest ballet company, the Royal Winnipeg Ballet, founded in 1939.",
  "Winnipeg's Assiniboine Park Zoo houses the Journey to Churchill exhibit, one of the world's most comprehensive northern species displays.",
  "The city's Centennial Concert Hall was the first concert hall in Canada designed specifically for both orchestra and opera performances.",
  "Winnipeg has produced more NHL players per capita than any other Canadian city, earning it the nickname 'Hockey Capital of Canada.'",
  'The Red River flows north to Hudson Bay, making Winnipeg one of the few major cities where the river doesn\u2019t flow to the nearest ocean.',
  "Winnipeg's Chinatown is the oldest in Western Canada, established in the 1890s by Chinese railway workers.",
  "The city's mosquito population is so legendary that locals joke about the 'Manitoba air force', but the season only lasts about 6 weeks.",
  "Winnipeg's Canadian Museum for Human Rights is the only national museum outside of Ottawa, featuring a striking glass cloud design.",
  'The city experiences more hours of daylight in summer than Miami, with nearly 17 hours of daylight during peak summer solstice.',
];

const TRIVIA_COLORS = [
  'bg-purple-600/30 text-purple-100 border-purple-400/40',
  'bg-emerald-600/30 text-emerald-100 border-emerald-400/40',
  'bg-cyan-600/30 text-cyan-100 border-cyan-400/40',
  'bg-rose-600/30 text-rose-100 border-rose-400/40',
  'bg-amber-600/30 text-amber-100 border-amber-400/40',
  'bg-teal-600/30 text-teal-100 border-teal-400/40',
  'bg-indigo-600/30 text-indigo-100 border-indigo-400/40',
  'bg-pink-600/30 text-pink-100 border-pink-400/40',
  'bg-lime-600/30 text-lime-100 border-lime-400/40',
  'bg-violet-600/30 text-violet-100 border-violet-400/40',
];

const pickRandom = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

export default function SalaryBreakdownComponent({ breakdown }: SalaryBreakdownProps) {
  // Pick the trivia card once per mount, not on every re-render.
  const trivia = useMemo(() => ({ fact: pickRandom(TRIVIA_FACTS), color: pickRandom(TRIVIA_COLORS) }), []);

  const deductionItems = [
    {
      label: 'Federal Tax',
      amount: breakdown.federalTax,
      color: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/20',
    },
    {
      label: 'Manitoba Provincial Tax',
      amount: breakdown.provincialTax,
      color: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/20',
    },
    {
      label: 'CPP Contributions',
      amount: breakdown.cpp,
      color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
    ...(breakdown.cpp2 > 0
      ? [
          {
            label: 'CPP2 (Enhanced)',
            amount: breakdown.cpp2,
            color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/20',
          },
        ]
      : []),
    {
      label: 'EI Premiums',
      amount: breakdown.ei,
      color: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20',
    },
    ...(breakdown.rrsp > 0
      ? [
          {
            label: 'RRSP Contributions',
            amount: breakdown.rrsp,
            color: 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/20',
          },
        ]
      : []),
    ...(breakdown.unionDues > 0
      ? [
          {
            label: 'Union Dues',
            amount: breakdown.unionDues,
            color: 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border-yellow-500/20',
          },
        ]
      : []),
    ...(breakdown.otherDeductions > 0
      ? [
          {
            label: 'Other Deductions',
            amount: breakdown.otherDeductions,
            color: 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/20',
          },
        ]
      : []),
  ];

  const effectiveTaxRate = breakdown.grossAnnual
    ? ((breakdown.federalTax + breakdown.provincialTax) / breakdown.grossAnnual) * 100
    : 0;
  const totalDeductionRate = breakdown.grossAnnual
    ? (breakdown.totalDeductions / breakdown.grossAnnual) * 100
    : 0;

  const federalRentMonths = Math.max(1, Math.round(breakdown.federalTax / AVG_MONTHLY_RENT));
  const rentMonthName = MONTH_NAMES[Math.min(federalRentMonths - 1, MONTH_NAMES.length - 1)];
  const totalCpp = breakdown.cpp + breakdown.cpp2;
  const provincialCappuccinos = Math.round(breakdown.provincialTax / CAPPUCCINO_PRICE);
  const cppCappuccinos = Math.round(totalCpp / CAPPUCCINO_PRICE);
  const eiCappuccinos = Math.round(breakdown.ei / CAPPUCCINO_PRICE);
  const totalRentMonths = Math.round((breakdown.totalDeductions / AVG_MONTHLY_RENT) * 10) / 10;
  const totalCappuccinos = Math.round(breakdown.totalDeductions / CAPPUCCINO_PRICE);
  // The 190,000-cup figure is *monthly*; the daily habit is that divided across the month,
  // so funding duration is measured in days at the derived daily city-wide cost.
  const slurpeeDays = Math.round((breakdown.totalDeductions / SLURPEE_DAILY_COST) * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gross Income */}
        <div className="theme-card elastic-card border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 theme-gradient-primary rounded-[var(--radius)] shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-sans">Gross Income</h3>
          </div>
          <div className="space-y-2">
            <p className="elastic-number font-bold text-primary tabular-nums tracking-tight">
              {formatCurrency(breakdown.grossPerPeriod)}
            </p>
            <p className="text-sm text-muted-foreground">{formatPayFrequency(breakdown.payFrequency)}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(breakdown.grossAnnual)} annually</p>
          </div>
        </div>

        {/* Net Income */}
        <div className="theme-card elastic-card border border-green-400/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 theme-gradient-success rounded-[var(--radius)] shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-sans">Net Take-Home</h3>
          </div>
          <div className="space-y-2">
            <p className="elastic-number font-bold text-green-700 dark:text-green-400 tabular-nums tracking-tight">
              {formatCurrency(breakdown.netPerPeriod)}
            </p>
            <p className="text-sm text-muted-foreground">{formatPayFrequency(breakdown.payFrequency)}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(breakdown.netAnnual)} annually</p>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="theme-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">
            Winnipeg, Manitoba Tax Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 theme-surface rounded-[var(--radius)] border border-border">
            <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
            <p className="text-3xl font-bold text-foreground tabular-nums">{effectiveTaxRate.toFixed(1)}%</p>
          </div>
          <div className="text-center p-4 theme-surface rounded-[var(--radius)] border border-border">
            <p className="text-sm text-muted-foreground">Total Deductions</p>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {totalDeductionRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-4 theme-surface rounded-[var(--radius)] border border-border">
            <p className="text-sm text-muted-foreground">Net Rate</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {(100 - totalDeductionRate).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="theme-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 theme-gradient-secondary rounded-[var(--radius)] shadow-lg">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">Deduction Breakdown</h3>
        </div>

        <div className="space-y-4">
          {deductionItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3 px-4 rounded-[var(--radius)] theme-surface border hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${item.color}`}>
                  {item.label}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-muted-foreground">annual</p>
              </div>
            </div>
          ))}

          {/* Total Deductions */}
          <div className="flex items-center justify-between py-4 px-4 rounded-[var(--radius)] bg-red-500/20 border-2 border-red-500/30 font-bold backdrop-blur-sm">
            <span className="text-red-700 dark:text-red-400">Total Deductions</span>
            <span className="text-red-700 dark:text-red-400 text-lg">
              {formatCurrency(breakdown.totalDeductions)}
            </span>
          </div>
        </div>
      </div>

      {/* Deduction Perspective */}
      <div className="theme-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif">Deduction Perspective</h3>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Federal income tax of{' '}
            <strong className="text-foreground">{formatCurrency(breakdown.federalTax)} a year</strong> is
            roughly equal to <strong className="text-primary">{federalRentMonths} months</strong> of average
            city rent (the median apartment sat at C$1,353 in August 2026), so your federal bill alone could
            keep a typical one-bedroom roof overhead from January through {rentMonthName}.
          </p>

          <p>
            Manitoba&apos;s provincial tax bite of{' '}
            <strong className="text-foreground">{formatCurrency(breakdown.provincialTax)}</strong> would buy a
            caffeine fiend more than{' '}
            <strong className="text-primary">{provincialCappuccinos.toLocaleString()} cappuccinos</strong> at
            Winnipeg&apos;s going rate of $3.53 each. That&apos;s one foamy pick-me-up every workday for{' '}
            <strong className="text-primary">{Math.round(provincialCappuccinos / 250)} full years</strong>.
          </p>

          <p>
            Your annual CPP contribution of{' '}
            <strong className="text-foreground">{formatCurrency(totalCpp)}</strong> converts to about{' '}
            <strong className="text-primary">{cppCappuccinos.toLocaleString()} cappuccinos</strong>, or enough
            lattes to fuel the morning commute for every Bomber fan in the north-end grandstand on game day.
          </p>

          <p>
            The <strong className="text-foreground">{formatCurrency(breakdown.ei)}</strong> in EI premiums is
            the price of just under <strong className="text-primary">{eiCappuccinos} cappuccinos</strong>.
            Think of it as an emergency stash that would keep you caffeinated from the first snowfall to
            playoff hockey season.
          </p>

          <p>
            When you add everything up, total deductions of{' '}
            <strong className="text-foreground">{formatCurrency(breakdown.totalDeductions)}</strong> equal
            roughly <strong className="text-primary">{totalRentMonths} months</strong> of average Winnipeg
            rent or more than{' '}
            <strong className="text-primary">{totalCappuccinos.toLocaleString()} cappuccinos</strong>. Put
            another way, your withholdings could fund the city&apos;s daily Slurpee habit (about{' '}
            {SLURPEE_DAILY_CUPS.toLocaleString()} cups, from 190,000 a month) for{' '}
            <strong className="text-primary">{slurpeeDays} days</strong>, underscoring just how much of your
            paycheque is redirected before it ever hits your bank account.
          </p>
        </div>

        {/* Winnipeg Salary Trivia */}
        <div
          className={`mt-6 p-6 rounded-[var(--radius)] border backdrop-blur-sm ${trivia.color} hover:scale-[1.01] transition-all duration-300`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-[var(--radius)] shadow-lg">
              <MapPin className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              Winnipeg Trivia
            </h3>
          </div>

          <div className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
            <p className="font-medium text-slate-900 dark:text-slate-100">{trivia.fact}</p>
            <p className="mt-3 text-xs italic text-slate-700 dark:text-slate-200">
              Refresh the page to see another fun fact about Canada&apos;s most interesting prairie city.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
