import { Link } from 'react-router';
import { Rss, Sparkles, Check, ArrowLeft, MapPin } from 'lucide-react';
import DarkModeToggle from '@/react-app/components/DarkModeToggle';
import ColorThemeSelector from '@/react-app/components/ColorThemeSelector';

const CANONICAL_URL = 'https://salary.wpeg.app';

interface Release {
  version: string;
  date: string;
  isLatest: boolean;
  headline: string;
  items: { icon: 'star' | 'check'; text: string }[];
}

const RELEASES: readonly Release[] = [
  {
    version: 'v1.1.0',
    date: 'November 9, 2026',
    isLatest: true,
    headline: 'The big 2026 accuracy update',
    items: [
      {
        icon: 'star',
        text: 'Corrected every tax figure to the official 2026 federal and Manitoba rates — including the new lowest federal tax rate, basic personal amount credits, the enhanced CPP2 tier, and updated EI premiums and ceilings.',
      },
      {
        icon: 'star',
        text: 'Refreshed brand colours with stronger contrast, and added 22 selectable colour themes with full light and dark mode support.',
      },
      {
        icon: 'star',
        text: 'Added an "On this page" jump menu on desktop so you can hop straight to any section.',
      },
      {
        icon: 'star',
        text: 'Every rate now cites its official government source, linked directly to the CRA and Manitoba Finance pages.',
      },
      {
        icon: 'check',
        text: 'Fixed the rent-to-income and perspective cards at $0 salary, and the Slurpee math in the deduction perspective.',
      },
      {
        icon: 'check',
        text: 'Faster, cleaner, and more accessible under the hood — zero console errors and AA contrast throughout.',
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'August 2025',
    isLatest: false,
    headline: 'Initial release',
    items: [
      {
        icon: 'check',
        text: 'Winnipeg salary calculator with federal and Manitoba tax, CPP and EI estimates, dark mode, one-click sharing, and a healthy dose of Winnipeg fun facts.',
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="theme-surface border-b border-border sticky top-0 z-10 backdrop-blur-xl print:static print:border-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
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
                  <Link to="/">WPEG Salary Calculator</Link>
                </h1>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Part of the WPEG family · Manitoba, Canada</span>
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

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground font-serif tracking-tight mb-4">
            Changelog
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            New features, fixes, and improvements to the Winnipeg Salary Calculator — newest first.
          </p>
          <a
            href={`${CANONICAL_URL}/changelog/rss.xml`}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <Rss className="w-4 h-4" />
            Subscribe to this feed
          </a>
        </div>

        {/* Releases */}
        <div className="space-y-6">
          {RELEASES.map((release) => (
            <article key={release.version} className="theme-card" id={release.version.slice(1)}>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold border bg-primary/10 text-primary border-primary/30">
                  {release.version}
                </span>
                {release.isLatest && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
                    Latest
                  </span>
                )}
                <time className="text-sm text-muted-foreground">{release.date}</time>
              </div>
              <h3 className="text-2xl font-bold text-foreground font-serif mb-4">{release.headline}</h3>
              <ul className="space-y-3">
                {release.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {item.icon === 'star' ? (
                      <Sparkles className="w-4 h-4 mt-1 text-primary flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <Check className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className="text-sm leading-relaxed text-foreground/90">{item.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 theme-button text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to the calculator
          </Link>
        </div>
      </main>
    </div>
  );
}
