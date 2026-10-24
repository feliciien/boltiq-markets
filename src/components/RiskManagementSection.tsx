import { Shield, AlertTriangle, Cpu, Clock, CheckCircle } from 'lucide-react';
import executionImage from '../assets/images/algo_execution_engine_1792773585644.jpg';

export default function RiskManagementSection() {
  const riskProtocols = [
    {
      title: 'Automated Daily Loss Circuit Breakers',
      description: 'Internal MQL5 watchdogs continuously tally realized plus unrealized intraday equity changes against the 00:00 UTC server benchmark. If loss reaches 4.0%, all pending and active orders are liquidated immediately, locking terminal execution until the next trading day.',
      metric: 'Hard 4.0% Equity Cutoff',
    },
    {
      title: 'Real-Time News Event Blackout Shield',
      description: 'Integrated ForexFactory and economic calendar API synchronization pauses EA entry triggers 30 minutes before and 30 minutes after tier-1 macroeconomic releases (CPI, NFP, FOMC rate decisions).',
      metric: '30-Min Pre/Post Blackout',
    },
    {
      title: 'Slippage & Spread Inflation Guards',
      description: 'Prevents entry during illiquid session transitions, rollover spread expansions, or broker quotes with artificial markup. If current spread exceeds user-defined threshold (e.g. 1.5 pips on EURUSD), orders are cancelled.',
      metric: 'Sub-Pip Deviation Check',
    },
    {
      title: 'Absolute Anti-Martingale Discipline',
      description: 'BoltIQ forbids mathematical martingale, lot multipliers upon losses, and infinite averaging. Every position features a deterministic stop-loss calculated directly from market volatility (Average True Range).',
      metric: '100% Deterministic Stops',
    },
  ];

  return (
    <section id="risk-framework" className="py-20 bg-[#050811] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
            <span>Risk Architecture</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Capital Preservation</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Zero Toxic Logic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Institutional Risk Management Framework
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
            In quantitative trading, longevity is determined not by peak profit periods, but by disciplined defense against statistical fat-tail events and volatility shocks.
          </p>
        </div>

        {/* 2-Column Split: Hardware/Execution Visual + Protocols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-stretch">
          {/* Left Column: Image Asset & Hardware Architecture */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#080e1a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
              <img
                src={executionImage}
                alt="BoltIQ Algorithmic Execution Module Hardware"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080e1a] via-[#080e1a]/30 to-transparent" />
              <div className="absolute top-3 left-3 bg-[#050811]/90 backdrop-blur border border-slate-700/80 rounded px-2.5 py-1 text-[11px] font-mono text-amber-400">
                Architecture: MQL5 Direct Memory Core
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-mono">
                Hardware-Level Latency Optimization
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Our Expert Advisors are written with zero high-overhead script wrappers. Direct C++/MQL5 memory arrays ensure market order evaluations execute within 0.8 milliseconds, protecting fills from front-running and broker routing lag.
              </p>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Memory Overhead</span>
                  <span className="text-slate-200 font-bold">&lt; 14 MB RAM</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">VPS Requirements</span>
                  <span className="text-slate-200 font-bold">1 vCPU · 1 GB RAM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Risk Protocol Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {riskProtocols.map((protocol, idx) => (
              <div
                key={idx}
                className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                    <span className="font-semibold">{protocol.metric}</span>
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {protocol.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {protocol.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Enforced on all BoltIQ EAs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
