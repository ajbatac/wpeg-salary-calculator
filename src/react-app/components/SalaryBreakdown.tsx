import { TrendingUp, TrendingDown, DollarSign, MapPin } from 'lucide-react';
import { SalaryBreakdown } from '@/shared/types';

interface SalaryBreakdownProps {
  breakdown: SalaryBreakdown;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPayFrequency(frequency: string): string {
  switch (frequency) {
    case 'annual':
      return 'per year';
    case 'monthly':
      return 'per month';
    case 'bi-weekly':
      return 'bi-weekly';
    case 'weekly':
      return 'per week';
    default:
      return frequency;
  }
}

export default function SalaryBreakdownComponent({ breakdown }: SalaryBreakdownProps) {
  const deductionItems = [
    { label: 'Federal Tax', amount: breakdown.federalTax, color: 'bg-red-500/20 text-red-400 border-red-500/20' },
    { label: 'Manitoba Provincial Tax', amount: breakdown.provincialTax, color: 'bg-orange-500/20 text-orange-400 border-orange-500/20' },
    { label: 'CPP Contributions', amount: breakdown.cpp, color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
    { label: 'EI Premiums', amount: breakdown.ei, color: 'bg-green-500/20 text-green-400 border-green-500/20' },
    ...(breakdown.rrsp > 0 ? [{ label: 'RRSP Contributions', amount: breakdown.rrsp, color: 'bg-purple-500/20 text-purple-400 border-purple-500/20' }] : []),
    ...(breakdown.unionDues > 0 ? [{ label: 'Union Dues', amount: breakdown.unionDues, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' }] : []),
    ...(breakdown.otherDeductions > 0 ? [{ label: 'Other Deductions', amount: breakdown.otherDeductions, color: 'bg-gray-500/20 text-gray-400 border-gray-500/20' }] : []),
  ];

  const effectiveTaxRate = ((breakdown.federalTax + breakdown.provincialTax) / breakdown.grossAnnual * 100).toFixed(1);
  const totalDeductionRate = (breakdown.totalDeductions / breakdown.grossAnnual * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gross Income */}
        <div className="theme-card border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 theme-gradient-primary rounded-[var(--radius)] shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-sans">Gross Income</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-primary">{formatCurrency(breakdown.grossPerPeriod)}</p>
            <p className="text-sm text-muted-foreground">{formatPayFrequency(breakdown.payFrequency)}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(breakdown.grossAnnual)} annually</p>
          </div>
        </div>

        {/* Net Income */}
        <div className="theme-card border border-green-400/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 theme-gradient-success rounded-[var(--radius)] shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-sans">Net Take-Home</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-400">{formatCurrency(breakdown.netPerPeriod)}</p>
            <p className="text-sm text-muted-foreground">{formatPayFrequency(breakdown.payFrequency)}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(breakdown.netAnnual)} annually</p>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="theme-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground font-serif">Winnipeg, Manitoba Tax Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 theme-surface rounded-[var(--radius)] border border-border">
            <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
            <p className="text-2xl font-bold text-foreground">{effectiveTaxRate}%</p>
          </div>
          <div className="text-center p-4 clay-surface rounded-2xl border border-white/10">
            <p className="text-sm text-muted-foreground">Total Deductions</p>
            <p className="text-2xl font-bold text-foreground">{totalDeductionRate}%</p>
          </div>
          <div className="text-center p-4 clay-surface rounded-2xl border border-white/10">
            <p className="text-sm text-muted-foreground">Net Rate</p>
            <p className="text-2xl font-bold text-green-400">{(100 - parseFloat(totalDeductionRate)).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="theme-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 theme-gradient-secondary rounded-[var(--radius)] shadow-lg">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground font-serif">Deduction Breakdown</h3>
        </div>

        <div className="space-y-4">
          {deductionItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 px-4 rounded-[var(--radius)] theme-surface border hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${item.color}`}>
                  {item.label}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-muted-foreground">annual</p>
              </div>
            </div>
          ))}
          
          {/* Total Deductions */}
          <div className="flex items-center justify-between py-4 px-4 rounded-[var(--radius)] bg-red-500/20 border-2 border-red-500/30 font-bold backdrop-blur-sm">
            <span className="text-red-400">Total Deductions</span>
            <span className="text-red-400 text-lg">{formatCurrency(breakdown.totalDeductions)}</span>
          </div>
        </div>
      </div>

      {/* Deduction Perspective */}
      <div className="theme-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 theme-gradient-warning rounded-[var(--radius)] shadow-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground font-serif">Deduction Perspective</h3>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Federal income tax of <strong className="text-foreground">{formatCurrency(breakdown.federalTax)} a year</strong> is roughly equal to <strong className="text-primary">{Math.round(breakdown.federalTax / 1353)} months</strong> of average city rent (the median apartment sat at C$1,353 in August 2025), so your federal bill alone could keep a typical one-bedroom roof overhead from January through {(() => {
              const months = Math.round(breakdown.federalTax / 1353);
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              return monthNames[Math.min(months - 1, 11)];
            })()}.
          </p>

          <p>
            Manitoba's provincial tax bite of <strong className="text-foreground">{formatCurrency(breakdown.provincialTax)}</strong> would buy a caffeine fiend more than <strong className="text-primary">{Math.round(breakdown.provincialTax / 3.53).toLocaleString()} cappuccinos</strong> at Winnipeg's going rate of $3.53 each—one foamy pick-me-up every workday for <strong className="text-primary">{Math.round((breakdown.provincialTax / 3.53) / 250)} full years</strong>.
          </p>

          <p>
            Your annual CPP contribution of <strong className="text-foreground">{formatCurrency(breakdown.cpp)}</strong> converts to about <strong className="text-primary">{Math.round(breakdown.cpp / 3.53).toLocaleString()} cappuccinos</strong>, or enough lattes to fuel the morning commute for every Bomber fan in the north-end grandstand on game day.
          </p>

          <p>
            The <strong className="text-foreground">{formatCurrency(breakdown.ei)}</strong> in EI premiums is the price of just under <strong className="text-primary">{Math.round(breakdown.ei / 3.53)} cappuccinos</strong>—think of it as an emergency stash that would keep you caffeinated from the first snowfall to playoff hockey season.
          </p>

          <p>
            When you add everything up, total deductions of <strong className="text-foreground">{formatCurrency(breakdown.totalDeductions)}</strong> equal roughly <strong className="text-primary">{Math.round(breakdown.totalDeductions / 1353 * 10) / 10} months</strong> of average Winnipeg rent or more than <strong className="text-primary">{Math.round(breakdown.totalDeductions / 3.53).toLocaleString()} cappuccinos</strong>. Put another way, your withholdings could fund the city's entire daily Slurpee habit (about 190,000 cups) for more than <strong className="text-primary">{Math.round(breakdown.totalDeductions / (190000 * 2))} weeks</strong>, underscoring just how much of your paycheque is redirected before it ever hits your bank account.
          </p>
        </div>

        {/* Winnipeg Salary Trivia */}
        {(() => {
          const triviaFacts = [
            "Winnipeg has more trees per capita than any other prairie city, with over 400,000 boulevard trees—that's roughly one tree for every two residents.",
            "The city's underground walkway system spans 30 blocks, originally built in the 1970s to help workers escape winter temperatures that can drop to -40°C.",
            "Winnipeg's Portage and Main intersection was once called 'the windiest corner in Canada' due to unique wind tunnel effects between buildings.",
            "The Royal Canadian Mint produces coins for over 75 countries worldwide right here in Winnipeg, including Canada's own currency.",
            "Winnipeg is home to the world's longest naturally frozen skating trail at 10 kilometers along the Red and Assiniboine rivers.",
            "The city consumes more Slurpees per capita than anywhere else in the world—even during winter months when temperatures plummet.",
            "Winnipeg's Exchange District has the largest collection of heritage buildings in North America, with over 150 heritage structures.",
            "The city experiences more sunshine hours annually than Vancouver, Toronto, or Montreal despite its harsh winter reputation.",
            "Winnipeg's Grand Beach was rated as one of the world's best beaches by Playboy magazine in the 1960s for its fine white sand.",
            "The Forks Market sits at the historic meeting point of two rivers and has been a trading post for over 6,000 years.",
            "Winnipeg Transit operates one of North America's most extensive rapid transit systems for a city its size.",
            "The city is home to Canada's oldest ballet company, the Royal Winnipeg Ballet, founded in 1939.",
            "Winnipeg's Assiniboine Park Zoo houses the Journey to Churchill exhibit, one of the world's most comprehensive northern species displays.",
            "The city's Centennial Concert Hall was the first concert hall in Canada designed specifically for both orchestra and opera performances.",
            "Winnipeg has produced more NHL players per capita than any other Canadian city, earning it the nickname 'Hockey Capital of Canada.'",
            "The Red River flows north to Hudson Bay, making Winnipeg one of the few major cities where the river doesn't flow to the nearest ocean.",
            "Winnipeg's Chinatown is the oldest in Western Canada, established in the 1890s by Chinese railway workers.",
            "The city's mosquito population is so legendary that locals joke about the 'Manitoba air force'—but the season only lasts about 6 weeks.",
            "Winnipeg's Canadian Museum for Human Rights is the only national museum outside of Ottawa, featuring a striking glass cloud design.",
            "The city experiences more hours of daylight in summer than Miami, with nearly 17 hours of daylight during peak summer solstice."
          ];

          const colors = [
            'bg-purple-600/30 text-purple-100 border-purple-400/40',
            'bg-emerald-600/30 text-emerald-100 border-emerald-400/40',
            'bg-cyan-600/30 text-cyan-100 border-cyan-400/40',
            'bg-rose-600/30 text-rose-100 border-rose-400/40',
            'bg-amber-600/30 text-amber-100 border-amber-400/40',
            'bg-teal-600/30 text-teal-100 border-teal-400/40',
            'bg-indigo-600/30 text-indigo-100 border-indigo-400/40',
            'bg-pink-600/30 text-pink-100 border-pink-400/40',
            'bg-lime-600/30 text-lime-100 border-lime-400/40',
            'bg-violet-600/30 text-violet-100 border-violet-400/40'
          ];

          const randomIndex = Math.floor(Math.random() * triviaFacts.length);
          const randomColorIndex = Math.floor(Math.random() * colors.length);
          const selectedTrivia = triviaFacts[randomIndex];
          const selectedColor = colors[randomColorIndex];

          return (
            <div className={`mt-6 p-6 rounded-[var(--radius)] border backdrop-blur-sm ${selectedColor} hover:scale-[1.01] transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-[var(--radius)] shadow-lg">
                  <MapPin className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Winnipeg Trivia</h3>
              </div>
              
              <div className="text-sm text-slate-900 leading-relaxed">
                <p className="font-medium text-slate-900">
                  {selectedTrivia}
                </p>
                <p className="mt-3 text-xs italic text-slate-700">
                  Refresh the page to see another fun fact about Canada's most interesting prairie city.
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
