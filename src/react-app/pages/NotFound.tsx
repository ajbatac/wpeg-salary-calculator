import { useMemo, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowLeft, BarChart3, Bug, CupSoda, History, Snowflake } from 'lucide-react';
import SiteHeader from '@/react-app/components/SiteHeader';

/** Deterministic pseudo-random so the blizzard layout is stable between renders. */
const seeded = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const PARTICLE_EMOJI = ['❄', '❄', '❄', '❄', '🥤', '🏒', '☃️', '🦟', '🍁'] as const;

const BIG_DIGITS = [
  { char: '4', rotate: '-7deg', scale: '1' },
  { char: '0', rotate: '4deg', scale: '1.07' },
  { char: '4', rotate: '-4deg', scale: '1' },
] as const;

const RECEIPT_LINES: readonly [string, string][] = [
  ['GROSS CONTENT FOUND', '$0.00'],
  ['FEDERAL TAX (14%)', '$0.00'],
  ['MANITOBA TAX (10.8%)', '$0.00'],
  ['CPP + EI', '$0.00'],
];

const TICKER: readonly string[] = [
  'SLURPEE CAPITAL OF THE WORLD',
  'GO JETS GO',
  '−40°: WHERE CELSIUS AND FAHRENHEIT FINALLY AGREE',
  '2,354 HOURS OF SUNSHINE A YEAR',
  'HEART OF THE CONTINENT',
  'FRIENDLY MANITOBA',
  'NEVER MEET ANYONE AT PORTAGE & MAIN',
  'MORE MOSQUITOES THAN STOP SIGNS (ALLEGEDLY)',
];

const THEORIES = [
  {
    icon: Snowflake,
    title: 'The cold snap',
    text: 'Last seen near −40°, the only temperature where Celsius and Fahrenheit agree, and roughly how found this page is.',
  },
  {
    icon: CupSoda,
    title: 'The Slurpee defence',
    text: 'Even the Slurpee Capital of the World (190,000 cups a month) couldn\u2019t freeze this URL back into existence.',
  },
  {
    icon: Bug,
    title: 'The mosquito theory',
    text: 'A Winnipeg mosquito carried it off. By late June those things can lift a wagon, so one little webpage was no problem.',
  },
] as const;

/** Barcode bar widths, in units of 2px. */
const BARCODE = [3, 1, 2, 1, 1, 4, 1, 2, 3, 1, 1, 2, 1, 1, 3, 2, 1, 4, 1, 1, 2, 1, 3, 1] as const;

function Blizzard() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = seeded(i + 1);
        const b = seeded(i + 50);
        const c = seeded(i + 100);
        const d = seeded(i + 150);
        return {
          emoji: PARTICLE_EMOJI[Math.floor(a * PARTICLE_EMOJI.length)],
          left: `${b * 100}%`,
          fontSize: `${1 + c * 1.5}rem`,
          duration: `${12 + d * 14}s`,
          delay: `-${a * 20}s`,
          drift: `${(c - 0.5) * 16}vw`,
          opacity: 0.2 + b * 0.35,
        };
      }),
    [],
  );

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="wpeg-fall pointer-events-none absolute top-0 select-none opacity-0"
          style={
            {
              left: p.left,
              fontSize: p.fontSize,
              animationDuration: p.duration,
              animationDelay: p.delay,
              '--wpeg-drift': p.drift,
              '--wpeg-opacity': p.opacity,
            } as CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function Receipt({ url }: { url: string }) {
  return (
    <div className="relative">
      {/* Passport-style rubber stamp */}
      <div
        className="absolute -top-5 -right-2 z-10 rotate-[-14deg] rounded-[var(--radius)] border-[3px] border-destructive/80 bg-card/85 px-3 py-1 font-mono text-sm font-bold uppercase tracking-widest text-destructive shadow-lg backdrop-blur-sm"
        aria-hidden="true"
      >
        Not Found
      </div>

      <div className="theme-card rotate-[-1.5deg] font-mono text-sm transition-transform duration-500 hover:rotate-0">
        <div className="text-center">
          <div className="text-base font-bold tracking-wide">❄ WPEG SALARY CALCULATOR ❄</div>
          <div className="mt-1 text-xs text-muted-foreground uppercase tracking-[0.2em]">
            Statement of missing content
          </div>
        </div>

        <div className="my-4 border-t-2 border-dashed border-border" aria-hidden="true" />

        <div className="space-y-1.5">
          <div className="flex items-baseline">
            <span className="shrink-0">URL</span>
            <span className="mx-2 flex-1 border-b-2 border-dotted border-border" aria-hidden="true" />
            <span className="max-w-[60%] truncate text-primary">{url}</span>
          </div>
          <div className="flex items-baseline">
            <span className="shrink-0">PAGE FOUND</span>
            <span className="mx-2 flex-1 border-b-2 border-dotted border-border" aria-hidden="true" />
            <span className="font-bold text-destructive">NO</span>
          </div>
          <div className="flex items-baseline">
            <span className="shrink-0">ISSUED</span>
            <span className="mx-2 flex-1 border-b-2 border-dotted border-border" aria-hidden="true" />
            <span>JUST NOW</span>
          </div>
        </div>

        <div className="my-4 border-t-2 border-dashed border-border" aria-hidden="true" />

        <div className="space-y-1.5">
          {RECEIPT_LINES.map(([label, value]) => (
            <div key={label} className="flex items-baseline">
              <span className="shrink-0">{label}</span>
              <span className="mx-2 flex-1 border-b-2 border-dotted border-border" aria-hidden="true" />
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="my-4 border-t-2 border-dashed border-border" aria-hidden="true" />

        <div className="flex items-baseline text-base font-bold">
          <span>NET PAY</span>
          <span className="mx-2 flex-1 border-b-2 border-dotted border-border" aria-hidden="true" />
          <span>$0.00</span>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          THIS PAGE EARNS NOTHING. EVEN THE CRA CAN&apos;T TAX IT.
        </p>

        <div className="my-4 border-t-2 border-dashed border-border" aria-hidden="true" />

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 items-end gap-[2px]" aria-hidden="true">
            {BARCODE.map((w, i) => (
              <span key={i} className="inline-block bg-foreground" style={{ width: `${w * 2}px`, height: '100%' }} />
            ))}
          </div>
          <div className="text-xs text-muted-foreground tracking-[0.3em]">4·0·4 · 4·0·4 · MERCI · COME AGAIN</div>
        </div>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const displayUrl = pathname.length > 40 ? `${pathname.slice(0, 37)}…` : pathname;

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <SiteHeader />

      <main id="main-content">
        {/* === Hero: aurora, blizzard, and a very large 404 ============== */}
        <section className="relative overflow-hidden">
          {/* Manitoba-aurora glow bed */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="wpeg-drift absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-primary/25 blur-3xl" />
            <div
              className="wpeg-drift absolute -top-20 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-3xl"
              style={{ animationDelay: '-6s' }}
            />
            <div
              className="wpeg-drift absolute bottom-[-12rem] left-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl"
              style={{ background: 'hsl(var(--chart-3) / 0.2)', animationDelay: '-12s' }}
            />
          </div>
          <Blizzard />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
              404 · Not Found · $0.00 taxes owed
            </div>

            <div className="relative mx-auto inline-block select-none" aria-hidden="true">
              <div className="absolute inset-x-0 top-1/2 -z-10 h-1/2 -translate-y-1/2 rounded-full theme-gradient-primary opacity-30 blur-3xl" />
              <div className="flex items-center justify-center font-serif font-black leading-[0.85] tracking-tight">
                {BIG_DIGITS.map((d, i) => (
                  <span
                    key={i}
                    className="wpeg-bob theme-gradient-text text-[7.5rem] drop-shadow-xl sm:text-[12rem] lg:text-[16rem]"
                    style={
                      {
                        rotate: d.rotate,
                        scale: d.scale,
                        animationDelay: `${i * 0.9}s`,
                      } as CSSProperties
                    }
                  >
                    {d.char}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="mt-6 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Colder than Portage &amp; Main in January.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We combed both rivers, the whole Forks market, and every kilometre of Portage Avenue. Whatever
              this URL promised, it isn&apos;t here. It may have moved, or it never survived its first
              Manitoba winter.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                Back to home
              </Link>
              <Link to="/chart" className="theme-button inline-flex items-center gap-2">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Chart your paycheque instead
              </Link>
              <Link to="/changelog" className="theme-button inline-flex items-center gap-2">
                <History className="h-4 w-4" aria-hidden="true" />
                Changelog
              </Link>
            </div>
          </div>
        </section>

        {/* === Winnipeg brag ticker ======================================== */}
        <div className="ink-band overflow-hidden py-3 print:hidden" aria-hidden="true">
          <div className="wpeg-marquee flex w-max whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] opacity-90 sm:text-sm">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {TICKER.map((item) => (
                  <span key={item} className="flex items-center">
                    <span className="px-6">{item}</span>
                    <span className="opacity-50">★</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* === The investigation: receipt + case file ===================== */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Receipt url={displayUrl} />

            <div className="theme-card border border-primary/20">
              <h3 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Missing: one (1) webpage
              </h3>

              <div className="mt-5 rounded-[var(--radius)] border-2 border-dashed border-border p-4 text-center">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Have you seen this URL?
                </div>
                <div className="mt-1 break-all font-mono text-lg text-primary">{displayUrl}</div>
                <div className="mt-2 font-mono text-xs text-muted-foreground">
                  LAST SEEN: YOUR ADDRESS BAR · REWARD: 0 SMALL SLURPEES
                </div>
              </div>

              <ul className="mt-6 space-y-5">
                {THEORIES.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <div className="theme-gradient-secondary shrink-0 rounded-[var(--radius)] p-3 shadow-lg">
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                If found, please return it to the homepage. No reward, but we&apos;ll calculate your taxes,
                which is basically the same thing.
              </p>
            </div>
          </div>
        </section>

        <p className="px-4 pb-10 text-center font-mono text-xs tracking-widest text-muted-foreground">
          * NO PAGES WERE HARMED IN THE MAKING OF THIS ERROR *
        </p>
      </main>
    </div>
  );
}
