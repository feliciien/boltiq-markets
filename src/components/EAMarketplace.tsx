import { useState } from 'react';
import { SlidersHorizontal, ArrowUpRight, ShieldCheck, Download, Code2, Search, Check } from 'lucide-react';
import { EXPERT_ADVISORS, ExpertAdvisor } from '../data/marketData';

interface EAMarketplaceProps {
  onSelectStrategy: (strategy: ExpertAdvisor) => void;
}

export default function EAMarketplace({ onSelectStrategy }: EAMarketplaceProps) {
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const assetFilters = ['All', 'Forex', 'Metals', 'Indices', 'Multi-Asset'];

  const filteredEAs = EXPERT_ADVISORS.filter((ea) => {
    const matchesAsset = selectedAssetFilter === 'All' || ea.assetClass === selectedAssetFilter;
    const matchesSearch =
      ea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ea.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ea.strategyType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAsset && matchesSearch;
  });

  const handleDownloadPreset = (e: React.MouseEvent, ea: ExpertAdvisor) => {
    e.stopPropagation();
    setDownloadToast(`Generated MT5 preset archive for ${ea.name}`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <section id="marketplace" className="py-20 bg-[#060b14] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-slate-800/80">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
              <span>Algorithmic Catalog</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>MetaTrader 5 MQL5</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Prop-Firm Optimized</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Professional MT5 Expert Advisor Marketplace
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Audited quantitative trading algorithms engineered with strict risk parameters, 99.9% real-tick modeling, zero martingale discipline, and calibrated .set preset packages.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex min-w-0 max-w-full flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search strategies, pairs, logic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-[#0b1220] border border-slate-700 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>

            {/* Segmented Filter Buttons (allowed interactive filter control) */}
            <div className="flex min-w-0 max-w-full items-center gap-1 p-1 bg-[#0b1220] rounded-md border border-slate-800 overflow-x-auto">
              {assetFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedAssetFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    selectedAssetFilter === filter
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {filteredEAs.map((ea) => (
            <div
              key={ea.id}
              onClick={() => onSelectStrategy(ea)}
              className="group bg-[#090f1d] hover:bg-[#0c1426] border border-slate-800 hover:border-slate-700/80 rounded-xl p-6 transition-all shadow-lg hover:shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Clean unboxed metadata header (NO PILLS) */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">{ea.assetClass}</span>
                    <span aria-hidden="true" className="text-slate-600">/</span>
                    <span>{ea.strategyType}</span>
                    <span aria-hidden="true" className="text-slate-600">/</span>
                    <span>TF: {ea.timeframe}</span>
                  </div>
                  <span className="text-slate-400">{ea.riskClass} Risk</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {ea.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 block">Sim. Monthly Return</span>
                    <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                      {ea.monthlySimulatedPnl}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {ea.tagline}
                </p>

                {/* Key Audited Quantitative Indicators */}
                <div className="grid grid-cols-4 gap-2 mt-5 py-3 border-y border-slate-800/80 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Sharpe</span>
                    <span className="text-sm font-bold text-amber-300 tabular-nums">{ea.sharpeRatio}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Profit F.</span>
                    <span className="text-sm font-bold text-slate-200 tabular-nums">{ea.profitFactor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Max DD</span>
                    <span className="text-sm font-bold text-slate-200 tabular-nums">{ea.maxDrawdownPct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Win Rate</span>
                    <span className="text-sm font-bold text-emerald-400 tabular-nums">{ea.historicalWinRatePct}%</span>
                  </div>
                </div>

                {/* Architecture Highlights */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Stop-Loss Mandate: {ea.executionModel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Backtest Baseline: {ea.backtestPeriod}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <span className="text-xs font-mono text-slate-400">
                  {ea.compatibility}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDownloadPreset(e, ea)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded border border-slate-700/60 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Presets (.set)</span>
                  </button>

                  <button
                    onClick={() => onSelectStrategy(ea)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                  >
                    <span>Audit & Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search filters out everything */}
        {filteredEAs.length === 0 && (
          <div className="text-center py-12 bg-[#090f1d] border border-slate-800 rounded-xl mt-6">
            <p className="text-sm text-slate-400">No Expert Advisors match your current filter query.</p>
            <button
              onClick={() => {
                setSelectedAssetFilter('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Download notification toast */}
        {downloadToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0d172a] border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-mono animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Institutional Disclosure Box */}
        <div className="mt-12 p-4 rounded-lg bg-[#080d18] border border-slate-800/80 text-xs text-slate-400 leading-relaxed font-mono">
          <p>
            <strong className="text-slate-300">Strategy Tester Verification:</strong> All Expert Advisors listed in the BoltIQ marketplace undergo algorithmic stress testing across volatile news releases and holiday roll-over periods. Preset (.set) configurations are calibrated to safeguard equity against fast slippage events and illiquid hours.
          </p>
        </div>
      </div>
    </section>
  );
}
