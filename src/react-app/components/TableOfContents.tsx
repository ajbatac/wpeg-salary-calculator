import { useEffect, useState } from 'react';
import { Info, Calculator, CupSoda, ShoppingBag, FileText, BookOpen, type LucideIcon } from 'lucide-react';

interface TocEntry {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** Document-order list of sections the rail can jump to. */
const ENTRIES: readonly TocEntry[] = [
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'tax-rates', label: 'Tax Rates', icon: Info },
  { id: 'important-notes', label: 'Important Notes', icon: FileText },
  { id: 'coffee-coin', label: 'Coffee Coin', icon: CupSoda },
  { id: 'could-buy', label: 'What Deductions Buy', icon: ShoppingBag },
  { id: 'sources', label: 'References', icon: BookOpen },
];

/** Fraction of the viewport from the top that counts as "the reading line". */
const SPY_LINE_RATIO = 0.35;

/**
 * Left-side jump menu for the page's sections, visible on xl+ screens.
 * Highlights the section currently in view via a lightweight scroll spy.
 */
export default function TableOfContents() {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const sections = ENTRIES.map((entry) => document.getElementById(entry.id)).filter(
      (section): section is HTMLElement => section !== null,
    );

    let frame = 0;
    const updateActive = () => {
      const readingLine = window.innerHeight * SPY_LINE_RATIO;
      // Deepest section (by on-screen position, not list order) above the reading line.
      const passed = sections
        .map((section) => ({ id: section.id, top: section.getBoundingClientRect().top }))
        .filter((section) => section.top <= readingLine)
        .sort((a, b) => a.top - b.top);
      setActiveId(passed.length > 0 ? passed[passed.length - 1].id : '');
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="toc-scroll print:hidden xl:theme-surface xl:rounded-[var(--radius)] xl:px-4 xl:pt-4 xl:pb-5 xl:shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 px-3">
        On this page
      </p>
      <ul className="space-y-1">
        {ENTRIES.map(({ id, label, icon: Icon }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`toc-link flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius)] text-sm transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
