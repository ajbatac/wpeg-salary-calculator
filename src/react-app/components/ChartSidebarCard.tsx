import { Link } from 'react-router';
import { BarChart3, ArrowRight } from 'lucide-react';
import { SalaryInput } from '@/shared/types';
import { encodeSalaryInput } from '@/shared/query';

interface ChartSidebarCardProps {
  input: SalaryInput;
  className?: string;
}

/** Colourful call-to-action linking the current calculation to /chart. */
export default function ChartSidebarCard({ input, className = '' }: ChartSidebarCardProps) {
  return (
    <Link
      to={`/chart?${encodeSalaryInput(input)}`}
      className={`block theme-gradient-primary rounded-[var(--radius)] p-5 shadow-lg hover:scale-[1.02] transition-all duration-300 group ${className}`}
      aria-label="View my salary chart"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-2.5 bg-white/20 rounded-[var(--radius)]">
          <BarChart3 className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <ArrowRight
          className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform duration-300 mt-1"
          aria-hidden="true"
        />
      </div>
      <p className="mt-4 text-lg font-bold text-white font-serif leading-tight">View my salary chart</p>
      <p className="mt-1 text-sm text-white/80">Your money, in living colour</p>
    </Link>
  );
}
