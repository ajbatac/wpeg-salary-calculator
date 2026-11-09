import { useState } from 'react';
import { Calculator, DollarSign, Calendar, Briefcase, Plus, Minus } from 'lucide-react';
import { SalaryInput, PayFrequency, EmploymentType, DEFAULT_SALARY_INPUT } from '@/shared/types';

interface SalaryFormProps {
  onInputChange: (input: SalaryInput) => void;
}

const NUMERIC_FIELDS: ReadonlySet<keyof SalaryInput> = new Set([
  'grossSalary',
  'additionalIncome',
  'rrspContributions',
  'unionDues',
  'otherDeductions',
]);

/** Parses raw input into a finite, non-negative number (empty or invalid -> 0). */
const parseAmount = (raw: string): number => Math.max(0, parseFloat(raw) || 0);

export default function SalaryForm({ onInputChange }: SalaryFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [input, setInput] = useState<SalaryInput>(DEFAULT_SALARY_INPUT);

  const handleInputChange = (field: keyof SalaryInput, value: string | PayFrequency | EmploymentType) => {
    const newValue = NUMERIC_FIELDS.has(field) ? parseAmount(value as string) : value;
    const newInput = { ...input, [field]: newValue };
    setInput(newInput);
    onInputChange(newInput);
  };

  return (
    <div className="theme-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 theme-gradient-primary rounded-[var(--radius)] shadow-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground font-serif tracking-tight">Salary Information</h2>
      </div>

      <div className="space-y-6">
        {/* Gross Salary */}
        <div>
          <label htmlFor="gross-salary" className="block text-sm font-semibold text-foreground mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Gross Salary
          </label>
          <input
            id="gross-salary"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={input.grossSalary}
            onChange={(e) => handleInputChange('grossSalary', e.target.value)}
            className="w-full theme-input text-xl font-medium text-foreground placeholder:text-muted-foreground"
            placeholder="Enter your gross salary"
            aria-label="Gross Salary"
            aria-required="true"
          />
        </div>

        {/* Pay Frequency */}
        <div>
          <label htmlFor="pay-frequency" className="block text-sm font-semibold text-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Pay Frequency
          </label>
          <select
            id="pay-frequency"
            value={input.payFrequency}
            onChange={(e) => handleInputChange('payFrequency', e.target.value as PayFrequency)}
            className="w-full theme-input text-xl font-medium text-foreground"
            aria-label="Pay Frequency"
          >
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="employment-type" className="block text-sm font-semibold text-foreground mb-2">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Employment Type
          </label>
          <select
            id="employment-type"
            value={input.employmentType}
            onChange={(e) => handleInputChange('employmentType', e.target.value as EmploymentType)}
            className="w-full theme-input text-xl font-medium text-foreground"
            aria-label="Employment Type"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-6 py-3 text-primary hover:text-primary/80 font-medium transition-all duration-300 theme-button hover:scale-105"
          aria-expanded={showAdvanced}
          aria-controls="advanced-options"
        >
          {showAdvanced ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdvanced ? 'Hide' : 'Show'} Additional Options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div id="advanced-options" className="space-y-4 pt-4 border-t border-white/10">
            <div>
              <label htmlFor="additional-income" className="block text-sm font-semibold text-foreground mb-2">
                Additional Income (bonuses, overtime)
              </label>
              <input
                id="additional-income"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={input.additionalIncome}
                onChange={(e) => handleInputChange('additionalIncome', e.target.value)}
                className="w-full theme-input text-foreground placeholder:text-muted-foreground"
                placeholder="0"
                aria-label="Additional Income"
              />
            </div>

            <div>
              <label
                htmlFor="rrsp-contributions"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                RRSP Contributions
              </label>
              <input
                id="rrsp-contributions"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={input.rrspContributions}
                onChange={(e) => handleInputChange('rrspContributions', e.target.value)}
                className="w-full theme-input text-foreground placeholder:text-muted-foreground"
                placeholder="0"
                aria-label="RRSP Contributions"
              />
            </div>

            <div>
              <label htmlFor="union-dues" className="block text-sm font-semibold text-foreground mb-2">
                Union Dues
              </label>
              <input
                id="union-dues"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={input.unionDues}
                onChange={(e) => handleInputChange('unionDues', e.target.value)}
                className="w-full theme-input text-foreground placeholder:text-muted-foreground"
                placeholder="0"
                aria-label="Union Dues"
              />
            </div>

            <div>
              <label htmlFor="other-deductions" className="block text-sm font-semibold text-foreground mb-2">
                Other Deductions
              </label>
              <input
                id="other-deductions"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={input.otherDeductions}
                onChange={(e) => handleInputChange('otherDeductions', e.target.value)}
                className="w-full theme-input text-foreground placeholder:text-muted-foreground"
                placeholder="0"
                aria-label="Other Deductions"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
