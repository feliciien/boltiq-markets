import { useState } from 'react';
import { X, ShieldCheck, Download, Code, Sliders, CheckCircle2, FileText } from 'lucide-react';
import { ExpertAdvisor } from '../data/marketData';

interface StrategyModalProps {
  strategy: ExpertAdvisor | null;
  onClose: () => void;
}

export default function StrategyModal({ strategy, onClose }: StrategyModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'audit'>('overview');

  if (!strategy) return null;

  const handleDownloadPreset = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="strategy-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-3xl bg-[#090f1d] border border-slate-700 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0d1527] border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>{strategy.assetClass} Systems</span>
              <span aria-hidden="true">·</span>
              <span>{strategy.strategyType}</span>
              <span aria-hidden="true">·</span>
              <span>Timeframe: {strategy.timeframe}</span>
            </div>
            <h2 id="strategy-modal-title" className="text-xl font-bold text-white mt-1">
              {strategy.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close strategy details modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-[#090f1d]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveTab('parameters')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'parameters'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            MQL5 Parameters & Inputs ({strategy.parameters.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Tick Audit & Risk Specs
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-sm text-slate-300 leading-relaxed">
                {strategy.description}
              </p>

              {/* Key Quantitative Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0e172a] p-3 rounded border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Sharpe Ratio</span>
                  <p className="text-lg font-bold font-mono text-amber-300 mt-0.5 tabular-nums">
                    {strategy.sharpeRatio}
                  </p>
                  <span className="text-[10px] text-slate-400">Risk-adjusted return</span>
                </div>

                <div className="bg-[#0e172a] p-3 rounded border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Max Drawdown</span>
                  <p className="text-lg font-bold font-mono text-slate-200 mt-0.5 tabular-nums">
                    {strategy.maxDrawdownPct}%
                  </p>
                  <span className="text-[10px] text-slate-400">Peak-to-trough drop</span>
                </div>

                <div className="bg-[#0e172a] p-3 rounded border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Profit Factor</span>
                  <p className="text-lg font-bold font-mono text-slate-200 mt-0.5 tabular-nums">
                    {strategy.profitFactor}
                  </p>
                  <span className="text-[10px] text-slate-400">Gross win / gross loss</span>
                </div>

                <div className="bg-[#0e172a] p-3 rounded border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Historical Win Rate</span>
                  <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                    {strategy.historicalWinRatePct}%
                  </p>
                  <span className="text-[10px] text-slate-400">Simulated fill sample</span>
                </div>
              </div>

              {/* Strategy Features */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Engineered Risk & Execution Architecture</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {strategy.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Execution Constraints */}
              <div className="bg-[#060b14] p-4 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Compatibility:</span>
                  <span className="text-slate-200 font-semibold">{strategy.compatibility}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Recommended Deposit:</span>
                  <span className="text-slate-200 font-semibold">{strategy.recommendedDeposit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Recommended Leverage:</span>
                  <span className="text-slate-200 font-semibold">{strategy.recommendedLeverage}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Backtest Horizon:</span>
                  <span className="text-amber-300 font-semibold">{strategy.backtestPeriod}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  All BoltIQ MT5 Expert Advisors include verified preset (<code className="text-amber-400">.set</code>) files. Each input parameter can be optimized or fine-tuned directly in the MetaTrader 5 Inputs dialog.
                </p>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0d1627] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Parameter Name</th>
                      <th className="py-2.5 px-3">Default Value</th>
                      <th className="py-2.5 px-3">Functional Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#090f1d] text-slate-300">
                    {strategy.parameters.map((param) => (
                      <tr key={param.name} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-amber-300">{param.name}</td>
                        <td className="py-2.5 px-3 tabular-nums text-slate-200">{param.defaultValue}</td>
                        <td className="py-2.5 px-3 text-slate-400">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#060b14] border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>MetaTrader 5 Strategy Tester Audit Certification</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This model was tested using Dukascopy and Tickmill real tick database feeds from 2019 to 2026. Every tick event was rendered with millisecond precision, including real variable spread expansion during market open and roll-over sessions.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="border border-slate-800/80 p-2.5 rounded bg-[#0b1220]">
                    <span className="text-slate-400">Data Modeling Quality:</span>
                    <div className="text-sm font-bold text-emerald-400">99.90% Real Ticks</div>
                  </div>
                  <div className="border border-slate-800/80 p-2.5 rounded bg-[#0b1220]">
                    <span className="text-slate-400">Execution Slippage:</span>
                    <div className="text-sm font-bold text-slate-200">Modeled (0.5 – 1.5 pips)</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-200/90 leading-relaxed">
                <strong>Simulated Model Disclaimer:</strong> Hypothetical or simulated performance results have certain inherent limitations. Unlike an actual performance record, simulated results do not represent actual trading. Also, since trades have not actually been executed, results may have under- or over-compensated for the impact of market factors, such as lack of liquidity.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0d1527] border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            License includes: <span className="text-slate-200">2 MT5 Account Activations + .SET Presets</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPreset}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Preset Package Prepared (.zip)' : 'Download Demo Preset (.set)'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="px-6 py-2 bg-emerald-950/80 border-t border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Simulated demo package: {strategy.name} calibrated presets (.set) generated for MetaTrader 5 Strategy Tester.</span>
          </div>
        )}
      </div>
    </div>
  );
}
