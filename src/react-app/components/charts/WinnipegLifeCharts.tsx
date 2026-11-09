import { useMemo, useState } from 'react';
import { Chart as ReactChart } from 'react-chartjs-2';
import { Cake } from 'lucide-react';
import { SalaryBreakdown } from '@/shared/types';
import { MONTH_NAMES } from '@/shared/constants';
import { formatCurrency } from '@/react-app/utils/format';

/**
 * The "Winnipeg life" chart series. Everything computed from the user's own
 * breakdown uses the real engine; every local price below (cakes, tickets,
 * rents, levies) is an illustrative estimate and labelled as such.
 */

interface SeriesProps {
  breakdown: SalaryBreakdown;
}

const cssHsl = (name: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return `hsl(${value})`;
};

const COLORS = {
  federal: '#dc2626',
  provincial: '#ea580c',
  payroll: '#2563eb',
  freedom: '#10b981',
  muted: '#6b7280',
  you: '#8b5cf6',
  gold: '#ca8a04',
  rose: '#e11d48',
};

const gridColor = () => cssHsl('--border');
const tickColor = () => cssHsl('--muted-foreground');

/** 1. The Winnipeg Unit of Currency converter. */
const WUC_UNITS = [
  { id: 'cake', label: "Jeanne's cakes", price: 26, note: 'the banana-crust legend of St. Boniface' },
  { id: 'slurpee', label: 'Large Slurpees', price: 2.5, note: 'civic duty in the Slurpee capital' },
  { id: 'jets', label: 'Jets tickets', price: 115, note: 'upper bowl, where the noise lives' },
  { id: 'honey-dill', label: 'Honey dill tubs', price: 6, note: '250ml of chicken-finger nectar' },
] as const;

export function CurrencyConverter({ breakdown }: SeriesProps) {
  const [unit, setUnit] = useState<(typeof WUC_UNITS)[number]>(WUC_UNITS[1]);
  const count = Math.floor(breakdown.netAnnual / unit.price);
  const perWeek = Math.floor(count / 52);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {WUC_UNITS.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => setUnit(candidate)}
            aria-pressed={unit.id === candidate.id}
            className={`px-3 py-2 rounded-full border text-sm font-medium transition-colors ${
              unit.id === candidate.id
                ? 'bg-primary/15 text-primary border-primary/40'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {candidate.label}
          </button>
        ))}
      </div>
      <p className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight text-foreground">
        {count.toLocaleString()}{' '}
        <span className="text-lg font-semibold text-muted-foreground">{unit.label}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        per year, or about {perWeek.toLocaleString()} a week ({unit.note}). Prices illustrative.
      </p>
      <div className="h-24">
        <ReactChart
          type="bar"
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { color: gridColor() },
                ticks: { color: tickColor(), callback: (v) => Number(v).toLocaleString() },
              },
              y: { display: false },
            },
          }}
          data={{
            labels: [unit.label],
            datasets: [{ data: [count], backgroundColor: [COLORS.you], borderRadius: 8 }],
          }}
        />
      </div>
    </div>
  );
}

/** 2. Seasonal survival budget (illustrative monthly Winnipeg extras). */
const SEASON_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SEASON_SERIES = [
  { label: 'Winterizing & car', color: COLORS.federal, data: [40, 40, 150, 90, 0, 0, 0, 0, 0, 60, 200, 50] },
  {
    label: 'Utilities & gear',
    color: COLORS.payroll,
    data: [220, 200, 150, 90, 0, 0, 0, 0, 0, 60, 120, 190],
  },
  { label: 'Winter getaway fund', color: COLORS.muted, data: [80, 80, 80, 0, 0, 0, 0, 0, 0, 0, 60, 0] },
  { label: 'Lake, festivals & bugs', color: COLORS.gold, data: [0, 0, 0, 0, 20, 60, 180, 200, 60, 0, 0, 0] },
];

export function SeasonalBudget() {
  return (
    <div>
      <div className="h-72">
        <ReactChart
          type="bar"
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: cssHsl('--foreground'), usePointStyle: true, boxWidth: 8 } },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(Number(ctx.parsed.y ?? 0))}`,
                },
              },
            },
            scales: {
              x: { stacked: true, grid: { color: gridColor() }, ticks: { color: tickColor() } },
              y: {
                stacked: true,
                grid: { color: gridColor() },
                ticks: { color: tickColor(), callback: (v) => `$${v}` },
              },
            },
          }}
          data={{
            labels: SEASON_MONTHS,
            datasets: SEASON_SERIES.map((series) => ({
              label: series.label,
              data: series.data,
              backgroundColor: series.color,
              borderRadius: 4,
            })),
          }}
        />
      </div>
      <p className="mt-3 text-xs italic text-muted-foreground">
        Illustrative seasonal extras on top of your regular budget, in the months Winnipeg treats differently.
      </p>
    </div>
  );
}

/** 3. Commute trade-off: driving vs Transit vs cycling (illustrative rates). */
export function CommuteTradeOff({ breakdown }: SeriesProps) {
  const [km, setKm] = useState(18);
  const [days, setDays] = useState(5);

  const costs = useMemo(() => {
    const driving = km * 2 * days * 52 * 0.28 + 650; // per-km running cost + pothole levy
    const transit = 111 * 12;
    const cycling = 260;
    return { driving, transit, cycling };
  }, [km, days]);

  const savingVsDriving = costs.driving - costs.cycling;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="commute-km" className="block text-sm font-semibold text-foreground mb-1">
            One-way commute (km)
          </label>
          <input
            id="commute-km"
            type="number"
            min="1"
            max="120"
            value={km}
            onChange={(event) => setKm(Math.max(1, Math.min(120, Number(event.target.value) || 1)))}
            className="theme-input text-sm py-2"
          />
        </div>
        <div>
          <label htmlFor="commute-days" className="block text-sm font-semibold text-foreground mb-1">
            Work days per week
          </label>
          <input
            id="commute-days"
            type="number"
            min="1"
            max="7"
            value={days}
            onChange={(event) => setDays(Math.max(1, Math.min(7, Number(event.target.value) || 1)))}
            className="theme-input text-sm py-2"
          />
        </div>
      </div>
      <div className="h-56">
        <ReactChart
          type="bar"
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: { label: (ctx) => ` ${formatCurrency(Number(ctx.parsed.y ?? 0))} per year` },
              },
            },
            scales: {
              x: { grid: { color: gridColor() }, ticks: { color: cssHsl('--foreground') } },
              y: {
                grid: { color: gridColor() },
                ticks: { color: tickColor(), callback: (v) => `$${Number(v) / 1000}k` },
              },
            },
          }}
          data={{
            labels: ['Driving', 'Winnipeg Transit', 'Cycling'],
            datasets: [
              {
                data: [costs.driving, costs.transit, costs.cycling],
                backgroundColor: [COLORS.federal, COLORS.payroll, COLORS.freedom],
                borderRadius: 8,
              },
            ],
          }}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Cycling saves{' '}
        <strong className="text-green-600 dark:text-green-400">{formatCurrency(savingVsDriving)}</strong> a
        year over driving, about {Math.round((savingVsDriving / Math.max(breakdown.netAnnual, 1)) * 100)}% of
        your take-home. Rates illustrative ($0.28/km + a $650 pothole levy).
      </p>
    </div>
  );
}

/** 4. Tax Freedom Day calendar, computed straight from the breakdown. */
interface DayCell {
  month: number;
  day: number;
  color: string;
  isFreedom: boolean;
}

export function FreedomCalendar({ breakdown }: SeriesProps) {
  const { cells, freedomLabel } = useMemo(() => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const gross = breakdown.grossAnnual;
    const segments = [
      { color: COLORS.federal, days: Math.round((breakdown.federalTax / gross) * 365) },
      { color: COLORS.provincial, days: Math.round((breakdown.provincialTax / gross) * 365) },
      {
        color: COLORS.payroll,
        days: Math.round(((breakdown.cpp + breakdown.cpp2 + breakdown.ei) / gross) * 365),
      },
    ];
    const taxedDays = Math.min(
      364,
      segments.reduce((sum, segment) => sum + segment.days, 0),
    );

    const cells: DayCell[] = [];
    let month = 0;
    let dayOfMonth = 1;
    for (let dayOfYear = 0; dayOfYear < 365; dayOfYear++) {
      let color = COLORS.freedom;
      if (dayOfYear < taxedDays) {
        let left = dayOfYear;
        for (const segment of segments) {
          if (left < segment.days) {
            color = segment.color;
            break;
          }
          left -= segment.days;
        }
      }
      cells.push({ month, day: dayOfMonth, color, isFreedom: color === COLORS.freedom });
      dayOfMonth++;
      if (dayOfMonth > daysInMonth[month]) {
        month++;
        dayOfMonth = 1;
      }
    }
    const freedomCell = cells[taxedDays] ?? cells[364];
    const freedomLabel = `${MONTH_NAMES[freedomCell.month]} ${freedomCell.day}`;
    return { cells, freedomLabel };
  }, [breakdown]);

  const legend = [
    { label: 'Federal tax', color: COLORS.federal },
    { label: 'Manitoba tax', color: COLORS.provincial },
    { label: 'CPP & EI', color: COLORS.payroll },
    { label: 'Yours to keep', color: COLORS.freedom },
  ];

  // group cells by month for the 12-column calendar
  const groups = cells.reduce<{ month: number; cells: DayCell[] }[]>((acc, cell) => {
    const last = acc[acc.length - 1];
    if (last && last.month === cell.month) last.cells.push(cell);
    else acc.push({ month: cell.month, cells: [cell] });
    return acc;
  }, []);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Your <strong className="text-green-600 dark:text-green-400">Freedom Date</strong> is{' '}
        <strong className="text-foreground">{freedomLabel}</strong>. Every dollar you earn after that is
        yours to keep.
      </p>
      <div className="grid grid-cols-12 gap-1.5">
        {groups.map((group) => (
          <div key={group.month} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              {MONTH_NAMES[group.month].slice(0, 3)}
            </span>
            <div className="flex flex-col gap-1 w-full">
              {group.cells.map((cell) => (
                <span
                  key={`${cell.month}-${cell.day}`}
                  className="w-full aspect-square rounded-[3px] transition-transform hover:scale-125"
                  style={{ background: cell.color }}
                  title={`${MONTH_NAMES[cell.month]} ${cell.day}${cell.isFreedom ? ', yours' : ''}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        {legend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 5. Neighborhood affordability vs the 30% / 40% rules (illustrative rents). */
const NEIGHBOURHOODS: ReadonlyArray<{ name: string; rent: number }> = [
  { name: 'North End', rent: 995 },
  { name: 'Transcona', rent: 1050 },
  { name: 'West Kildonan', rent: 1100 },
  { name: 'St. Boniface', rent: 1250 },
  { name: 'St. Vital', rent: 1300 },
  { name: 'Wolseley', rent: 1400 },
  { name: 'River Heights', rent: 1450 },
  { name: 'Osborne Village', rent: 1500 },
  { name: 'Tuxedo', rent: 1850 },
  { name: 'East St. Paul', rent: 2050 },
];

export function NeighbourhoodMap({ breakdown }: SeriesProps) {
  const monthlyNet = breakdown.netAnnual / 12;
  const barColor = (rent: number): string => {
    const share = rent / monthlyNet;
    if (share <= 0.3) return COLORS.freedom;
    if (share <= 0.4) return COLORS.gold;
    return COLORS.rose;
  };

  return (
    <div>
      <div className="h-80">
        <ReactChart
          type="bar"
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const rent = Number(ctx.parsed.x ?? 0);
                    const share = Math.round((rent / monthlyNet) * 100);
                    return ` ${formatCurrency(rent)}/mo (${share}% of your take-home)`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: { color: gridColor() },
                ticks: { color: tickColor(), callback: (v) => `$${(Number(v) / 100).toFixed(0)}00` },
              },
              y: { grid: { display: false }, ticks: { color: cssHsl('--foreground'), font: { size: 12 } } },
            },
          }}
          data={{
            labels: NEIGHBOURHOODS.map((area) => area.name),
            datasets: [
              {
                data: NEIGHBOURHOODS.map((area) => area.rent),
                backgroundColor: NEIGHBOURHOODS.map((area) => barColor(area.rent)),
                borderRadius: 6,
              },
            ],
          }}
        />
      </div>
      <p className="mt-3 text-xs italic text-muted-foreground">
        Illustrative 1-bedroom averages. Green ≤ 30% of your monthly take-home, gold ≤ 40%, red is house-poor
        territory.
      </p>
    </div>
  );
}

/** 6. Lifestyle reality check: sliders against the monthly net. */
export function LifestyleSlider({ breakdown }: SeriesProps) {
  const [rent, setRent] = useState(1353);
  const [savingsPct, setSavingsPct] = useState(10);
  const monthlyNet = breakdown.netAnnual / 12;
  const groceries = 450;
  const utilities = 235;
  const fixed = rent + groceries + utilities;
  const safety = monthlyNet * (savingsPct / 100);
  const fun = Math.max(0, monthlyNet - fixed - safety);
  const perDay = fun / 30;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
        <div>
          <label
            htmlFor="rent-slider"
            className="flex justify-between text-sm font-semibold text-foreground mb-1"
          >
            <span>Monthly rent/mortgage</span>
            <span className="tabular-nums text-primary">{formatCurrency(rent)}</span>
          </label>
          <input
            id="rent-slider"
            type="range"
            min={800}
            max={2600}
            step={25}
            value={rent}
            onChange={(event) => setRent(Number(event.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label
            htmlFor="savings-slider"
            className="flex justify-between text-sm font-semibold text-foreground mb-1"
          >
            <span>Savings rate</span>
            <span className="tabular-nums text-primary">{savingsPct}%</span>
          </label>
          <input
            id="savings-slider"
            type="range"
            min={0}
            max={25}
            step={1}
            value={savingsPct}
            onChange={(event) => setSavingsPct(Number(event.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>
      <div className="h-24">
        <ReactChart
          type="bar"
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: cssHsl('--foreground'), usePointStyle: true, boxWidth: 8 } },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(Number(ctx.parsed.x ?? 0))}/mo`,
                },
              },
            },
            scales: {
              x: {
                stacked: true,
                grid: { color: gridColor() },
                ticks: { color: tickColor(), callback: (v) => `$${(Number(v) / 100).toFixed(0)}00` },
              },
              y: { stacked: true, display: false },
            },
          }}
          data={{
            labels: ['Your month'],
            datasets: [
              {
                label: 'Fixed (rent + food + utilities)',
                data: [fixed],
                backgroundColor: COLORS.payroll,
                borderRadius: 6,
              },
              { label: 'Safety net', data: [safety], backgroundColor: COLORS.gold, borderRadius: 6 },
              { label: 'Guilt-free fun', data: [fun], backgroundColor: COLORS.freedom, borderRadius: 6 },
            ],
          }}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        After the basics and your safety net, you have{' '}
        <strong className="text-green-600 dark:text-green-400">{formatCurrency(perDay)} a day</strong> of
        guilt-free spending. Groceries and utilities illustrative.
      </p>
    </div>
  );
}

/** Section shell shared by the series, matching the existing chart cards. */
export function SeriesSection({
  title,
  icon: Icon,
  gradient,
  children,
}: {
  title: string;
  icon: typeof Cake;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <section className="theme-card">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 ${gradient} rounded-[var(--radius)] shadow-lg`}>
          <Icon className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-foreground font-serif">{title}</h3>
      </div>
      {children}
    </section>
  );
}
