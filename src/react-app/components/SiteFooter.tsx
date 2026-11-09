import { Link } from 'react-router';
import { ArrowUpRight, Snowflake, Camera, AtSign, ThumbsUp, Play } from 'lucide-react';
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
 * Lucide v1 ships no brand icons, so each platform gets lucide's closest
 * semantic glyph plus a visible label, never a drawn look-alike logo.
 * Threads genuinely uses the @ glyph.
 */
const SOCIAL_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/wpeg.app/', Icon: Camera },
  { label: 'Threads', url: 'https://www.threads.com/@wpeg.app', Icon: AtSign },
  { label: 'Facebook', url: 'https://www.facebook.com/wpegapp', Icon: ThumbsUp },
  { label: 'YouTube', url: 'https://www.youtube.com/@WPEGapp', Icon: Play },
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
                  className="p-2 bg-card rounded-[var(--radius)] border border-border hover:border-primary/50 transition-colors"
                  aria-label="Visit the WPEG.app portal"
                >
                  <img src="/wpeg-logo.png" alt="WPEG.app wordmark" className="h-12 w-auto object-contain" />
                </a>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-foreground font-serif tracking-tight mb-4 leading-tight">
                Part of the <span className="text-primary">WPEG</span> family.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                This salary calculator is one of many free Winnipeg tools from the team behind WPEG.app, your
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
                <div className="flex flex-wrap items-center gap-2">
                  {SOCIAL_LINKS.map(({ label, url, Icon }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WPEG on ${label}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius)] bg-card border border-border text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {label}
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
                  { label: 'References', url: '/#sources', internal: true },
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
              aria-label={`Version ${APP_VERSION}: view the changelog`}
            >
              {APP_VERSION}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
