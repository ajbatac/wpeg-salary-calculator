import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
  LineController,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import {
  MapPin,
  ArrowLeft,
  ArrowDown,
  Briefcase,
  PieChart,
  LineChart as LineIcon,
  Trophy,
  Cake,
  Snowflake,
  CarFront,
  CalendarDays,
  MapPinned,
  Wallet,
} from 'lucide-react';
import DarkModeToggle from '@/react-app/components/DarkModeToggle';
import ColorThemeSelector from '@/react-app/components/ColorThemeSelector';
import {
  CurrencyConverter,
  SeasonalBudget,
  CommuteTradeOff,
  FreedomCalendar,
  NeighbourhoodMap,
  LifestyleSlider,
  SeriesSection,
} from '@/react-app/components/charts/WinnipegLifeCharts';
import { DEFAULT_SALARY_INPUT, SalaryBreakdown } from '@/shared/types';
import { decodeSalaryInput } from '@/shared/query';
import { calculateSalary } from '@/react-app/utils/salaryCalculator';
import { formatCurrency, formatPayFrequency } from '@/react-app/utils/format';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
  LineController,
);

/** Illustrative Manitoba industry medians (annual gross) for comparison. */
const INDUSTRIES: ReadonlyArray<{ label: string; gross: number }> = [
  { label: 'Retail & Hospitality', gross: 34000 },
  { label: 'Manufacturing', gross: 58000 },
  { label: 'Trucking & Transport', gross: 62000 },
  { label: 'Trades & Construction', gross: 68000 },
  { label: 'Public Service', gross: 75000 },
  { label: 'Finance & Accounting', gross: 78000 },
  { label: 'Teaching', gross: 82000 },
  { label: 'Nursing (RN)', gross: 89000 },
  { label: 'Emergency Services', gross: 92000 },
  { label: 'Software & Tech', gross: 96000 },
];

/** Illustrative Winnipeg/Manitoba salary benchmarks. */
const BENCHMARKS: ReadonlyArray<{ label: string; gross: number }> = [
  { label: 'Minimum wage (full-time)', gross: 33000 },
  { label: 'Median individual', gross: 55000 },
  { label: 'Median household', gross: 89000 },
  { label: 'Top 10%', gross: 135000 },
  { label: 'Top 1%', gross: 250000 },
];

const cssHsl = (name: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return `hsl(${value})`;
};

/** Semantic deduction colours, continuous with the breakdown badge palette. */
const SLICE_COLORS = {
  federal: '#dc2626',
  provincial: '#ea580c',
  cpp: '#2563eb',
  cpp2: '#1d4ed8',
  ei: '#16a34a',
  rrsp: '#9333ea',
  union: '#ca8a04',
  other: '#6b7280',
  net: '#10b981',
  you: '#8b5cf6',
};

/** Draws "X% kept" in the centre of the money-flow doughnut. */
const doughnutCenterText: Plugin<'doughnut'> = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta.data[0]) return;
    const { x, y } = meta.data[0];
    const netRate = (chart.config.options as { netRate?: number }).netRate;
    if (netRate === undefined) return;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = cssHsl('--foreground');
    ctx.font = '700 28px Inter, sans-serif';
    ctx.fillText(`${netRate}%`, x, y - 10);
    ctx.font = '500 12px Inter, sans-serif';
    ctx.fillStyle = cssHsl('--muted-foreground');
    ctx.fillText('kept as take-home', x, y + 16);
    ctx.restore();
  },
};

interface ChartPageProps {
  breakdown: SalaryBreakdown;
}

function MoneyFlowDoughnut({ breakdown }: ChartPageProps) {
  const slices = [
    { label: 'Net take-home', value: breakdown.netAnnual, color: SLICE_COLORS.net },
    { label: 'Federal tax', value: breakdown.federalTax, color: SLICE_COLORS.federal },
    { label: 'Manitoba tax', value: breakdown.provincialTax, color: SLICE_COLORS.provincial },
    { label: 'CPP', value: breakdown.cpp, color: SLICE_COLORS.cpp },
    ...(breakdown.cpp2 > 0 ? [{ label: 'CPP2', value: breakdown.cpp2, color: SLICE_COLORS.cpp2 }] : []),
    { label: 'EI', value: breakdown.ei, color: SLICE_COLORS.ei },
    ...(breakdown.rrsp > 0 ? [{ label: 'RRSP', value: breakdown.rrsp, color: SLICE_COLORS.rrsp }] : []),
    ...(breakdown.unionDues > 0
      ? [{ label: 'Union dues', value: breakdown.unionDues, color: SLICE_COLORS.union }]
      : []),
    ...(breakdown.otherDeductions > 0
      ? [{ label: 'Other', value: breakdown.otherDeductions, color: SLICE_COLORS.other }]
      : []),
  ].filter((slice) => slice.value > 0);

  const netRate = Math.round((breakdown.netAnnual / breakdown.grossAnnual) * 100);
  const options: ChartOptions<'doughnut'> & { netRate?: number } = {
    netRate,
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        // Bottom legend lets the doughnut own the full card width and sit
        // dead-centre (a right legend squeezes it into the left half).
        position: 'bottom',
        labels: {
          color: cssHsl('--foreground'),
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
          font: { family: 'Inter, sans-serif', size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed as number;
            const share = ((value / breakdown.grossAnnual) * 100).toFixed(1);
            return ` ${context.label}: ${formatCurrency(value)} (${share}%)`;
          },
        },
      },
    },
  };

  return (
    <ReactChart
      type="doughnut"
      options={options}
      plugins={[doughnutCenterText]}
      data={{
        labels: slices.map((slice) => slice.label),
        datasets: [
          {
            data: slices.map((slice) => slice.value),
            backgroundColor: slices.map((slice) => slice.color),
            borderColor: cssHsl('--card'),
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      }}
    />
  );
}

function IndustryComparison({ breakdown }: ChartPageProps) {
  const [industry, setIndustry] = useState(INDUSTRIES[7]); // Nursing (RN)
  const industryNet = useMemo(
    () => calculateSalary({ ...DEFAULT_SALARY_INPUT, grossSalary: industry.gross }),
    [industry],
  );
  const diff = breakdown.netAnnual - industryNet.netAnnual;
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

  const gridColor = cssHsl('--border');
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: cssHsl('--foreground'), usePointStyle: true, boxWidth: 8 } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatter.format(Number(ctx.parsed.y ?? 0))}`,
        },
      },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: cssHsl('--muted-foreground'), font: { size: 12 } } },
      y: {
        grid: { color: gridColor },
        ticks: { color: cssHsl('--muted-foreground'), callback: (v) => `$${Number(v) / 1000}k` },
      },
    },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <label htmlFor="industry" className="text-sm font-semibold text-foreground">
          Compare with:
        </label>
        <select
          id="industry"
          value={industry.label}
          onChange={(event) =>
            setIndustry(INDUSTRIES.find((item) => item.label === event.target.value) ?? INDUSTRIES[0])
          }
          className="theme-input text-sm py-2 max-w-xs"
        >
          {INDUSTRIES.map((item) => (
            <option key={item.label} value={item.label}>
              {item.label} · ~{formatCurrency(item.gross)}
            </option>
          ))}
        </select>
      </div>
      <div className="h-72">
        <ReactChart
          type="bar"
          options={options}
          data={{
            labels: [`You`, industry.label],
            datasets: [
              {
                label: 'Gross salary',
                data: [breakdown.grossAnnual, industry.gross],
                backgroundColor: [SLICE_COLORS.you, cssHsl('--muted')],
                borderRadius: 8,
              },
              {
                label: 'Take-home',
                data: [breakdown.netAnnual, industryNet.netAnnual],
                backgroundColor: [SLICE_COLORS.net, cssHsl('--primary')],
                borderRadius: 8,
              },
            ],
          }}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {diff >= 0 ? (
          <>
            You take home{' '}
            <strong className="text-green-600 dark:text-green-400">{formatter.format(diff)}</strong> more per
            year than a typical {industry.label.toLowerCase()} worker in Manitoba.
          </>
        ) : (
          <>
            A typical {industry.label.toLowerCase()} worker takes home{' '}
            <strong className="text-primary">{formatter.format(-diff)}</strong> more per year than you.
          </>
        )}{' '}
        <span className="italic">Industry figures are illustrative medians.</span>
      </p>
    </div>
  );
}

function BenchmarkBars({ breakdown }: ChartPageProps) {
  const rows = useMemo(() => {
    const list = BENCHMARKS.map((benchmark) => ({ ...benchmark, you: false }));
    const insertAt = list.findIndex((benchmark) => benchmark.gross > breakdown.grossAnnual);
    const you = { label: 'YOU', gross: breakdown.grossAnnual, you: true };
    list.splice(insertAt === -1 ? list.length : insertAt, 0, you);
    return list;
  }, [breakdown.grossAnnual]);

  const gridColor = cssHsl('--border');
  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${formatCurrency(Number(ctx.parsed.x ?? 0))}` } },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: cssHsl('--muted-foreground'), callback: (v) => `$${Number(v) / 1000}k` },
      },
      y: { grid: { display: false }, ticks: { color: cssHsl('--foreground'), font: { size: 12 } } },
    },
  };

  return (
    <div>
      <div className="h-72">
        <ReactChart
          type="bar"
          options={options}
          data={{
            labels: rows.map((row) => row.label),
            datasets: [
              {
                data: rows.map((row) => row.gross),
                backgroundColor: rows.map((row) => (row.you ? SLICE_COLORS.you : cssHsl('--muted'))),
                borderRadius: 8,
              },
            ],
          }}
        />
      </div>
      <p className="mt-3 text-xs italic text-muted-foreground">
        Benchmarks are illustrative Winnipeg/Manitoba figures; you are highlighted.
      </p>
    </div>
  );
}

function EffectiveRateCurve({ breakdown }: ChartPageProps) {
  const { labels, rates, yourPoint } = useMemo(() => {
    const step = 5000;
    const labels: number[] = [];
    const rates: number[] = [];
    for (let gross = 25000; gross <= 300000; gross += step) {
      labels.push(gross);
      const result = calculateSalary({ ...DEFAULT_SALARY_INPUT, grossSalary: gross });
      rates.push(
        Number((((result.federalTax + result.provincialTax) / result.grossAnnual) * 100).toFixed(1)),
      );
    }
    const yourRate = Number(
      (((breakdown.federalTax + breakdown.provincialTax) / breakdown.grossAnnual) * 100).toFixed(1),
    );
    return { labels, rates, yourPoint: { x: breakdown.grossAnnual, y: yourRate } };
  }, [breakdown]);

  const gridColor = cssHsl('--border');
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => `Gross ${formatCurrency(Number(items[0]?.parsed.x ?? 0))}`,
          label: (item) => ` Income tax: ${item.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        grid: { color: gridColor },
        ticks: {
          color: cssHsl('--muted-foreground'),
          callback: (v) => `$${Number(v) / 1000}k`,
          stepSize: 50000,
        },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: cssHsl('--muted-foreground'), callback: (v) => `${v}%` },
        suggestedMax: 45,
      },
    },
  };

  return (
    <div>
      <div className="h-72">
        <ReactChart
          type="line"
          options={options}
          data={{
            datasets: [
              {
                label: 'Effective income-tax rate',
                data: labels.map((gross, index) => ({ x: gross, y: rates[index] })),
                borderColor: cssHsl('--primary'),
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.25,
              },
              {
                label: 'You',
                data: [yourPoint],
                borderColor: SLICE_COLORS.you,
                backgroundColor: SLICE_COLORS.you,
                pointRadius: 7,
                pointHoverRadius: 10,
              },
            ],
          }}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Your effective income-tax rate is <strong className="text-foreground">{yourPoint.y}%</strong> at{' '}
        {formatCurrency(breakdown.grossAnnual)} — the purple dot is you on Manitoba's 2026 curve.
      </p>
    </div>
  );
}

export default function ChartPage() {
  const location = useLocation();
  const input = useMemo(() => decodeSalaryInput(location.search), [location.search]);

  const header = (
    <header className="theme-surface border-b border-border sticky top-0 z-10 backdrop-blur-xl print:static print:border-none">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-card rounded-[var(--radius)] border border-border shadow-lg print:shadow-none">
              <img src="/logo.png" alt="WPEG logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl tracking-tight font-bold text-foreground font-serif">
                Winnipeg Salary Calculator 2026-2027
              </h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Your money, charted · Manitoba, Canada</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <ColorThemeSelector />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );

  if (!input) {
    return (
      <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {header}
        <main id="main-content" className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="theme-card">
            <div className="p-4 w-fit mx-auto rounded-full bg-primary/10 mb-6">
              <LineIcon className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-foreground font-serif mb-3">No salary to chart yet</h2>
            <p className="text-muted-foreground mb-8">
              The charts are built from your numbers. Head back to the calculator, enter your salary, and your
              personal chart page will be one click away.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 theme-button">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Go to the calculator
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const breakdown = calculateSalary(input);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {header}

      <main id="main-content" className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-10">
        {/* Intro: headline left, the entered salary massive on the right */}
        <div className="mb-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground font-serif tracking-tight leading-[1.05] mb-3 [text-wrap:balance]">
              Your salary, charted.
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Every number from your calculation, drawn as living charts — where your money goes, how you
              stack up, and where you sit on Manitoba's 2026 curve.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Gross', value: formatCurrency(breakdown.grossAnnual) },
                { label: 'Take-home', value: formatCurrency(breakdown.netAnnual) },
                { label: 'Deductions', value: formatCurrency(breakdown.totalDeductions) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="px-4 py-2.5 rounded-full bg-card border border-border text-sm"
                >
                  <span className="text-muted-foreground">{stat.label} </span>
                  <strong className="text-foreground tabular-nums">{stat.value}</strong>
                </div>
              ))}
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Adjust my salary
              </Link>
            </div>
          </div>

          {/* The number they entered, massive */}
          <div className="xl:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Your entry · {formatPayFrequency(input.payFrequency)}
            </p>
            <p className="text-6xl sm:text-7xl xl:text-8xl font-bold tabular-nums tracking-tight text-foreground leading-none">
              {formatCurrency(input.grossSalary)}
            </p>
            <a
              href="#charts"
              className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Jump to chart
              <ArrowDown className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="charts">
          <section className="theme-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 theme-gradient-primary rounded-[var(--radius)] shadow-lg">
                <PieChart className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-foreground font-serif">Where your money goes</h3>
            </div>
            <div className="h-96">
              <MoneyFlowDoughnut breakdown={breakdown} />
            </div>
          </section>

          <section className="theme-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 theme-gradient-secondary rounded-[var(--radius)] shadow-lg">
                <Briefcase className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-foreground font-serif">Industry face-off</h3>
            </div>
            <IndustryComparison breakdown={breakdown} />
          </section>

          <section className="theme-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
                <Trophy className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-foreground font-serif">How you stack up in Winnipeg</h3>
            </div>
            <BenchmarkBars breakdown={breakdown} />
          </section>

          <section className="theme-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 theme-gradient-success rounded-[var(--radius)] shadow-lg">
                <LineIcon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-foreground font-serif">The 2026 tax curve</h3>
            </div>
            <EffectiveRateCurve breakdown={breakdown} />
          </section>
        </div>

        {/* Winnipeg life series: the numbers, translated into everyday life */}
        <div className="mt-14 mb-8">
          <h3 className="text-3xl xl:text-4xl font-bold text-foreground font-serif tracking-tight">
            Winnipeg life, charted.
          </h3>
          <p className="text-base text-muted-foreground mt-2 max-w-2xl">
            The same take-home pay, translated into cakes, commutes, calendars, and neighbourhoods. Local
            prices and benchmarks below are illustrative — the tax math is not.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SeriesSection title="The Winnipeg Unit of Currency" icon={Cake} gradient="theme-gradient-primary">
            <CurrencyConverter breakdown={breakdown} />
          </SeriesSection>

          <SeriesSection
            title="The seasonal survival budget"
            icon={Snowflake}
            gradient="theme-gradient-secondary"
          >
            <SeasonalBudget />
          </SeriesSection>

          <SeriesSection title="Potholes vs. pedals" icon={CarFront} gradient="theme-gradient-warning">
            <CommuteTradeOff breakdown={breakdown} />
          </SeriesSection>

          <SeriesSection title="Your Freedom Date" icon={CalendarDays} gradient="theme-gradient-success">
            <FreedomCalendar breakdown={breakdown} />
          </SeriesSection>

          <SeriesSection
            title="Where can you afford to live?"
            icon={MapPinned}
            gradient="theme-gradient-secondary"
          >
            <NeighbourhoodMap breakdown={breakdown} />
          </SeriesSection>

          <SeriesSection title="The lifestyle reality check" icon={Wallet} gradient="theme-gradient-warning">
            <LifestyleSlider breakdown={breakdown} />
          </SeriesSection>
        </div>
      </main>
    </div>
  );
}
