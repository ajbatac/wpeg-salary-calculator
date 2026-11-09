import { useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { SalaryBreakdown } from '@/shared/types';
import { formatCurrency } from '@/react-app/utils/format';

interface ShareButtonProps {
  breakdown: SalaryBreakdown;
}

/** Triggers a client-side download of the given content as a file. */
function downloadFile(filename: string, content: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function ShareButton({ breakdown }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareText = () =>
    `💰 My Winnipeg Salary Breakdown 2026

Gross Income: ${formatCurrency(breakdown.grossAnnual)}
Federal Tax: ${formatCurrency(breakdown.federalTax)}
Provincial Tax: ${formatCurrency(breakdown.provincialTax)}
CPP: ${formatCurrency(breakdown.cpp)}
EI: ${formatCurrency(breakdown.ei)}
Total Deductions: ${formatCurrency(breakdown.totalDeductions)}
Net Take-Home: ${formatCurrency(breakdown.netAnnual)}

Calculated with WPEG Salary Calculator
https://portal.wpeg.app/`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadAsText = () => {
    downloadFile(`salary-breakdown-${breakdown.grossAnnual}.txt`, generateShareText(), 'text/plain');
    setShowMenu(false);
  };

  const downloadAsJSON = () => {
    const data = {
      ...breakdown,
      generatedDate: new Date().toISOString(),
    };
    downloadFile(
      `salary-breakdown-${breakdown.grossAnnual}.json`,
      JSON.stringify(data, null, 2),
      'application/json',
    );
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 theme-button hover:scale-105 transition-all duration-300"
        aria-label="Share salary breakdown"
        aria-expanded={showMenu}
      >
        <Share2 className="w-4 h-4" />
        Share Results
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} aria-hidden="true" />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 theme-surface border border-border rounded-[var(--radius)] shadow-xl z-20">
            <div className="py-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={downloadAsText}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download as Text</span>
              </button>

              <button
                type="button"
                onClick={downloadAsJSON}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download as JSON</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors border-t border-border"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                <span>Print</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
