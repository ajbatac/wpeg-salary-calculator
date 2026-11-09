import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import ColorThemeSelector from '@/react-app/components/ColorThemeSelector';
import DarkModeToggle from '@/react-app/components/DarkModeToggle';
import { APP_TITLE, PORTAL_URL } from '@/shared/constants';

interface SiteHeaderProps {
  /** Line under the title; defaults to the family tagline. */
  subtitle?: string;
  /** Page-specific controls rendered before the theme/dark toggles. */
  children?: React.ReactNode;
}

/**
 * The single global site header: skip link, brand lockup (calculator logo ×
 * WPEG wordmark), title linking home, and the shared controls. Pages extend
 * it through props/slots instead of re-implementing it.
 */
export default function SiteHeader({
  subtitle = 'Part of the WPEG family · Manitoba, Canada',
  children,
}: SiteHeaderProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

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
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-card rounded-[var(--radius)] border border-border hover:border-primary/50 transition-colors hidden sm:flex items-center"
                aria-label="WPEG.app, part of the WPEG family"
              >
                <img
                  src="/wpeg-logo.png"
                  alt="WPEG.app, part of the WPEG family"
                  className="h-6 w-auto object-contain"
                />
              </a>
              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl tracking-tight font-bold text-foreground font-serif">
                  <Link to="/">{APP_TITLE}</Link>
                </h1>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>{subtitle}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              {children}
              <ColorThemeSelector />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
