import { useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { SalaryBreakdown } from '@/shared/types';

interface ShareButtonProps {
  breakdown: SalaryBreakdown;
}

export default function ShareButton({ breakdown }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateShareText = () => {
    return `💰 My Winnipeg Salary Breakdown 2026

Gross Income: ${formatCurrency(breakdown.grossAnnual)}
Federal Tax: ${formatCurrency(breakdown.federalTax)}
Provincial Tax: ${formatCurrency(breakdown.provincialTax)}
CPP: ${formatCurrency(breakdown.cpp)}
EI: ${formatCurrency(breakdown.ei)}
Total Deductions: ${formatCurrency(breakdown.totalDeductions)}
Net Take-Home: ${formatCurrency(breakdown.netAnnual)}

Calculated with WPEG Salary Calculator
https://portal.wpeg.app/`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadAsText = () => {
    const text = generateShareText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-breakdown-${breakdown.grossAnnual}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const downloadAsJSON = () => {
    const data = {
      grossAnnual: breakdown.grossAnnual,
      grossPerPeriod: breakdown.grossPerPeriod,
      federalTax: breakdown.federalTax,
      provincialTax: breakdown.provincialTax,
      cpp: breakdown.cpp,
      ei: breakdown.ei,
      rrsp: breakdown.rrsp,
      unionDues: breakdown.unionDues,
      otherDeductions: breakdown.otherDeductions,
      totalDeductions: breakdown.totalDeductions,
      netAnnual: breakdown.netAnnual,
      netPerPeriod: breakdown.netPerPeriod,
      payFrequency: breakdown.payFrequency,
      generatedDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-breakdown-${breakdown.grossAnnual}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
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
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 theme-surface border border-border rounded-[var(--radius)] shadow-xl z-20">
            <div className="py-2">
              <button
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
                onClick={downloadAsText}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download as Text</span>
              </button>

              <button
                onClick={downloadAsJSON}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download as JSON</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors border-t border-border"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
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
