import { useState } from 'react';
import { Activity, BarChart2, ShieldAlert, Cpu, Layers, RefreshCw } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'regimes' | 'orderflow' | 'latency' | 'risk'>('regimes');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateRefresh = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <section id="analytics" className="py-20 bg-[#050811] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
              <span>Quantitative AI Telemetry</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Order Flow & Regimes</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Demonstration Environment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              AI-Powered Trading Analytics Dashboard
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Real-time market regime classification, microsecond order flow imbalance detection, and dynamic institutional risk telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateRefresh}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#0b1220] border border-slate-700/80 rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSimulating ? 'Updating Feeds...' : 'Refresh Telemetry'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Shell */}
        <div className="mt-8 bg-[#090f1d] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Top Control Bar */}
          <div className="px-6 py-4 bg-[#0d1627] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('regimes')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  activeTab === 'regimes'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Market Regime Classification
              </button>
              <button
                onClick={() => setActiveTab('orderflow')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  activeTab === 'orderflow'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Order Flow Imbalance
              </button>
              <button
                onClick={() => setActiveTab('latency')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  activeTab === 'latency'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Execution & Latency Audit
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  activeTab === 'risk'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                4. Portfolio VaR & Exposure
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="text-slate-300">Model Engine:</span>
              <span className="text-amber-400">BoltIQ-Markov-Quant</span>
            </div>
          </div>

          {/* View Tab 1: Market Regime Classification */}
          {activeTab === 'regimes' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#060b14] border border-amber-400/40">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">EUR/USD Regime</span>
                    <span className="text-slate-400">Confidence 91%</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">Mean-Reverting Range</div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Compressed ATR (8.4 pips) with low directional drift. VoltMatrix Mean Reversion strategy operating at optimal signal fidelity.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300 flex justify-between">
                    <span>Target Alpha Mode:</span>
                    <span className="text-emerald-400">Active (100% Sizing)</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#060b14] border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">XAU/USD (Gold) Regime</span>
                    <span className="text-slate-400">Confidence 86%</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">Volatile Trend Expansion</div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Expanding volume profile following NY session overlap. AeroBreak breakout triggers primed above session high ($2,642.10).
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300 flex justify-between">
                    <span>Target Alpha Mode:</span>
                    <span className="text-amber-400">Breakout Long</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#060b14] border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">NAS100 Index Regime</span>
                    <span className="text-slate-400">Confidence 89%</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">Pre-Open Compression</div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Tight consolidation channel ahead of cash opening bell. Auto-blackout filter active until 14:30 UTC cash liquidity entry.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300 flex justify-between">
                    <span>Target Alpha Mode:</span>
                    <span className="text-slate-400">Standby (News Filter)</span>
                  </div>
                </div>
              </div>

              {/* Regime Transition Probability Matrix */}
              <div className="bg-[#060b14] p-5 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">Regime Transition Probability (Hidden Markov Model)</span>
                  <span className="text-slate-500">Sample: 50,000 Historical Ticks</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
                  <div className="bg-[#0b1220] p-3 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">P(Range → Range)</span>
                    <span className="text-base font-bold text-emerald-400 tabular-nums">76.4%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">High Persistence</span>
                  </div>
                  <div className="bg-[#0b1220] p-3 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">P(Range → Expansion)</span>
                    <span className="text-base font-bold text-amber-300 tabular-nums">18.2%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Moderate Drift</span>
                  </div>
                  <div className="bg-[#0b1220] p-3 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">P(Range → Shock Spike)</span>
                    <span className="text-base font-bold text-slate-400 tabular-nums">5.4%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Filtered by Blackout</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Tab 2: Order Flow Imbalance */}
          {activeTab === 'orderflow' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#060b14] p-4 rounded-lg border border-slate-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-300 block">
                    Cumulative Volume Delta (CVD) — XAU/USD
                  </span>
                  <div className="h-44 bg-[#090f1d] rounded p-2 relative flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                      <path
                        d="M 0 60 L 50 65 L 100 50 L 150 45 L 200 30 L 250 25 L 300 15"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#334155" strokeDasharray="3 3" />
                    </svg>
                    <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400">
                      Aggressive Buyer Delta: +4,820 oz
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Bid Absorptions: <strong className="text-slate-200">1,210 lots</strong></span>
                    <span>Ask Sweeps: <strong className="text-emerald-400">2,640 lots</strong></span>
                  </div>
                </div>

                <div className="bg-[#060b14] p-4 rounded-lg border border-slate-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-300 block">
                    Institutional Liquidity Clusters
                  </span>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded bg-[#0b1220] border border-slate-800/80">
                      <span className="text-red-400">Resistance Pool (Sell Stops)</span>
                      <span className="text-white font-bold">$2,648.50</span>
                      <span className="text-slate-400">Estimated $18.4M</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-amber-500/10 border border-amber-500/30">
                      <span className="text-amber-300">Spot Fair Value (VWAP)</span>
                      <span className="text-white font-bold">$2,642.10</span>
                      <span className="text-amber-400">Active Equilibrium</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-[#0b1220] border border-slate-800/80">
                      <span className="text-emerald-400">Support Pool (Buy Stops)</span>
                      <span className="text-white font-bold">$2,634.00</span>
                      <span className="text-slate-400">Estimated $22.1M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Tab 3: Execution & Latency Audit */}
          {activeTab === 'latency' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-[#060b14] p-4 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">VPS Gateway Ping</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">0.68 ms</div>
                  <span className="text-slate-500 text-[10px] block mt-1">LD4 London Equinix cross-connect</span>
                </div>

                <div className="bg-[#060b14] p-4 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Average Fill Slippage</span>
                  <div className="text-xl font-bold text-slate-200 mt-1 tabular-nums">0.32 Pips</div>
                  <span className="text-slate-500 text-[10px] block mt-1">94% filled within limit tolerance</span>
                </div>

                <div className="bg-[#060b14] p-4 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Rejected Orders</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">0.00%</div>
                  <span className="text-slate-500 text-[10px] block mt-1">Zero requotes on ECN tick bridge</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#060b14] border border-slate-800 text-xs font-mono text-slate-300">
                <div className="font-bold text-amber-400 mb-1">Execution Quality Assurance:</div>
                <p className="text-slate-400 leading-relaxed">
                  BoltIQ Expert Advisors monitor live tick intervals to detect server slippage or feed freezes. If the latency between broker quote tick and order acknowledgement exceeds 15ms, pending market orders are automatically converted to limit executions or cancelled.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#060b14] p-3 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Value at Risk (99% VaR)</span>
                  <span className="text-base font-bold text-amber-300 tabular-nums">1.45% ($1,450)</span>
                  <span className="text-[10px] text-slate-500 block">Daily 1-day horizon</span>
                </div>

                <div className="bg-[#060b14] p-3 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Current Exposure</span>
                  <span className="text-base font-bold text-slate-200 tabular-nums">1.8 Lots Open</span>
                  <span className="text-[10px] text-slate-500 block">3 Active Positions</span>
                </div>

                <div className="bg-[#060b14] p-3 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Margin Utilization</span>
                  <span className="text-base font-bold text-emerald-400 tabular-nums">4.2%</span>
                  <span className="text-[10px] text-slate-500 block">Conservative 1:30</span>
                </div>

                <div className="bg-[#060b14] p-3 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Drawdown Buffer</span>
                  <span className="text-base font-bold text-emerald-400 tabular-nums">8.2% Remaining</span>
                  <span className="text-[10px] text-slate-500 block">To 10% Prop Firm Cap</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer of the Dashboard */}
          <div className="px-6 py-3 bg-[#080d18] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Demonstration Feed · BoltIQ Analytics Engine</span>
            <span>MetaTrader 5 Native API Bridge</span>
          </div>
        </div>
      </div>
    </section>
  );
}
