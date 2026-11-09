import { Link } from 'react-router';
import { ArrowUpRight, Snowflake } from 'lucide-react';
import { APP_VERSION, PORTAL_URL } from '@/shared/constants';

interface FooterLink {
  label: string;
  url: string;
  /** Internal routes render as router links; everything else opens a new tab. */
  internal?: boolean;
}

/** Mirrors the portal footer (portal.wpeg.app): Company, Legal, Connect. */
const COMPANY_LINKS: readonly FooterLink[] = [
  { label: 'About Us', url: `${PORTAL_URL}/about` },
  { label: 'WPEG Changelog', url: `${PORTAL_URL}/changelog` },
];

const LEGAL_LINKS: readonly FooterLink[] = [
  { label: 'Terms of Service', url: `${PORTAL_URL}/terms` },
  { label: 'Privacy Policy', url: `${PORTAL_URL}/privacy` },
  { label: 'DMCA Policy', url: `${PORTAL_URL}/dmca` },
  { label: 'Cookie Policy', url: `${PORTAL_URL}/cookies` },
  { label: 'Disclaimer', url: `${PORTAL_URL}/disclaimer` },
  { label: 'UGC Disclaimer', url: `${PORTAL_URL}/ugc` },
];

const TOOL_LINKS: readonly FooterLink[] = [
  { label: 'WPEG Jobs', url: 'https://jobs.wpeg.app' },
  { label: 'Mortgage Calculator', url: 'https://mortgage.wpeg.app' },
  { label: 'Invoice Generator', url: 'https://invoice.wpeg.app' },
  { label: 'Winnipeg Classifieds', url: 'https://classifieds.wpeg.ca' },
  { label: 'Winnipeg Trip Planner', url: 'https://explore.wpeg.ca' },
  { label: 'Colours of Winnipeg', url: 'https://kulay.ca' },
  { label: 'QR Code Generator', url: 'https://qrky.site' },
  { label: 'WPEG Newsletter', url: 'https://wpeg.beehiiv.com' },
];

/**
 * Social chips use typographic monograms (not brand marks): lucide v1 ships no
 * brand icons, and a drawn look-alike of a real logo is worse than honest type.
 * Threads keeps the AtSign glyph it actually uses.
 */
const SOCIAL_LINKS = [
  { label: 'Facebook', url: 'https://www.facebook.com/wpegca', monogram: 'F' },
  { label: 'Instagram', url: 'https://www.instagram.com/wpeg.ca', monogram: 'IG' },
  { label: 'Threads', url: 'https://threads.com/@wpeg.ca', monogram: '@' },
  { label: 'YouTube', url: 'https://www.youtube.com/@WPEGCA', monogram: 'YT' },
];

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.url}>
            {link.internal ? (
              <Link to={link.url} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                {link.label}
              </Link>
            ) : (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="theme-surface border-t border-border mt-12 print:hidden">
      {/* Giant watermark wordmark */}
      <div className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-8 left-1/2 -translate-x-1/2 font-serif font-bold leading-none text-[26vw] xl:text-[19rem] text-foreground/[0.04] whitespace-nowrap"
        >
          WPEG
        </span>

        <div className="relative max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pt-16 pb-10">
          {/* Brand block */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.6fr] gap-12 lg:gap-16 pb-12 border-b border-border">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-card rounded-[var(--radius)] border border-border shadow-lg">
                  <img
                    src="/logo.png"
                    alt="WPEG Salary Calculator logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="text-muted-foreground font-serif text-2xl" aria-hidden="true">
                  ×
                </span>
                <a
                  href={PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-card rounded-[var(--radius)] border border-border hover:border-primary/50 transition-colors"
                  aria-label="WPEG.app — visit the portal"
                >
                  <img src="/wpeg-logo.png" alt="WPEG.app wordmark" className="h-8 w-auto object-contain" />
                </a>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-foreground font-serif tracking-tight mb-4 leading-tight">
                Part of the <span className="text-primary">WPEG</span> family.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                This salary calculator is one of many free Winnipeg tools from the team behind WPEG.app — your
                central hub for city services and local attractions, all in one place.
              </p>

              <a
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 theme-button text-sm"
              >
                Explore WPEG.app
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {/* Connect: social row, mirroring the portal */}
              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Connect
                </h3>
                <div className="flex items-center gap-2">
                  {SOCIAL_LINKS.map(({ label, url, monogram }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WPEG on ${label}`}
                      className="w-10 h-10 flex items-center justify-center rounded-[var(--radius)] bg-card border border-border hover:border-primary/50 hover:text-primary transition-colors text-sm font-semibold"
                    >
                      {monogram}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <FooterColumn
                title="This Tool"
                links={[
                  { label: 'Salary Calculator', url: '/', internal: true },
                  { label: 'Changelog', url: '/changelog', internal: true },
                  { label: 'Sources & References', url: '/#sources', internal: true },
                ]}
              />
              <FooterColumn title="Company" links={COMPANY_LINKS} />
              <FooterColumn title="Legal" links={LEGAL_LINKS} />
              <div className="col-span-2 md:col-span-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  More Free WPEG Tools
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2.5">
                  {TOOL_LINKS.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-sm text-muted-foreground">
            <p>© 2026 WPEG.app. All rights reserved.</p>
            <p className="inline-flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-primary" aria-hidden="true" />
              Made in Winnipeg, Manitoba
            </p>
            <Link
              to="/changelog"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Version ${APP_VERSION} — view the changelog`}
            >
              {APP_VERSION}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
