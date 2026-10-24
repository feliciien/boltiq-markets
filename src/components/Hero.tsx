import { useState } from 'react';
import heroImage from '../assets/images/hero_fintech_terminal_1792773584526.jpg';
import { ArrowRight, Activity, Terminal, Shield, Cpu, Play, Check } from 'lucide-react';

interface HeroProps {
  onExploreEAs: () => void;
  onLaunchLab: () => void;
}

export default function Hero({ onExploreEAs, onLaunchLab }: HeroProps) {
  const [selectedDemoTab, setSelectedDemoTab] = useState<'EURUSD' | 'XAUUSD' | 'NAS100'>('EURUSD');

  const demoStats = {
    EURUSD: {
      strategy: 'VoltMatrix MR Pro (M15)',
      netReturn: '+78.4%',
      sharpe: '2.34',
      maxDd: '5.4%',
      profitFactor: '2.18',
      trades: '1,248',
      curveSvg: 'M 0 80 Q 50 70, 100 65 T 200 50 T 300 40 T 400 25 T 500 15',
    },
    XAUUSD: {
      strategy: 'AeroBreak Gold Flow (M5)',
      netReturn: '+114.5%',
      sharpe: '2.12',
      maxDd: '6.8%',
      profitFactor: '2.05',
      trades: '1,682',
      curveSvg: 'M 0 85 Q 60 75, 120 58 T 240 45 T 340 32 T 420 22 T 500 10',
    },
    NAS100: {
      strategy: 'TitanMomentum Cash Open (M15)',
      netReturn: '+136.9%',
      sharpe: '1.98',
      maxDd: '7.2%',
      profitFactor: '1.92',
      trades: '940',
      curveSvg: 'M 0 88 Q 70 78, 140 60 T 260 48 T 360 30 T 440 18 T 500 8',
    },
  };

  const activeStat = demoStats[selectedDemoTab];

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-[#050811] via-[#070d1a] to-[#050811]">
      {/* Subtle background radial glow in warm gold and deep navy */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-amber-500/5 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[400px] bg-blue-600/5 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Subtitle / Kicker */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-4 tracking-wider uppercase">
          <span>Institutional MetaTrader 5 Engineering</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Quantitative Research Lab</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>boltiqmarkets.com</span>
        </div>

        {/* Hero Title & Subheading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.12] text-balance">
              Precision MT5 Expert Advisors & Quantitative Research Laboratory.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              BoltIQ Markets engineers systematic, institutional-grade algorithmic strategies for MetaTrader 5. Backtested on simulated 99.9% real-tick feeds with strictly audited mathematical risk controls—engineered for professional traders and simulated proprietary evaluation challenges.
            </p>

            {/* Zero-Pill Bullet Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Zero Martingale · Zero Endless Grid</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>99.9% Simulated Tick-Data Precision</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Hard Stop-Loss & Max Daily Loss Filters</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Designed for 1-Step & 2-Step Prop Rules</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreEAs}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 cursor-pointer whitespace-nowrap"
              >
                <span>Explore EA Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchLab}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 bg-[#0d1627] hover:bg-[#142038] border border-slate-700/80 rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Launch Backtest Simulator</span>
              </button>
            </div>

            {/* Labeling Note */}
            <p className="text-[11px] text-slate-400 leading-tight">
              Notice: All performance figures are derived from audited historical simulations on MetaTrader 5 Strategy Tester. Past performance does not guarantee future results.
            </p>
          </div>

          {/* Interactive Terminal Showcase with High-Fidelity Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-slate-800 bg-[#0a101f] shadow-2xl overflow-hidden">
              {/* Terminal Window Header */}
              <div className="px-4 py-3 bg-[#0d1527] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    MT5.QuantTelemetry // v2026.4
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audited Simulation</span>
                </div>
              </div>

              {/* Terminal Image Container */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
                <img
                  src={heroImage}
                  alt="BoltIQ Markets Quantitative Trading Terminal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101f] via-[#0a101f]/40 to-transparent" />
                <div className="absolute top-3 left-3 bg-[#050811]/90 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-slate-300">
                  Terminal Status: <span className="text-amber-400">Live Strategy Model</span>
                </div>
              </div>

              {/* Interactive Model Switcher */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">Select Model Curve:</span>
                  <div className="flex items-center gap-1 bg-[#060b14] p-1 rounded border border-slate-800">
                    {(['EURUSD', 'XAUUSD', 'NAS100'] as const).map((sym) => (
                      <button
                        key={sym}
                        onClick={() => setSelectedDemoTab(sym)}
                        className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                          selectedDemoTab === sym
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategy Identity */}
                <div>
                  <div className="text-xs text-amber-400/90 font-mono">{activeStat.strategy}</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5 tabular-nums">
                    Simulated Return: <span className="text-emerald-400">{activeStat.netReturn}</span>
                  </div>
                </div>

                {/* SVG Mini Equity Curve Visualizer */}
                <div className="relative h-20 w-full bg-[#060b14] rounded border border-slate-800/80 p-2 overflow-hidden">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${activeStat.curveSvg} L 500 100 L 0 100 Z`}
                      fill="url(#curveGradient)"
                    />
                    <path
                      d={activeStat.curveSvg}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-400">
                    5-Year Real Tick Replay
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-[#0e172a] p-2 rounded border border-slate-800/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Sharpe</div>
                    <div className="text-xs font-bold font-mono text-amber-300 tabular-nums">{activeStat.sharpe}</div>
                  </div>
                  <div className="bg-[#0e172a] p-2 rounded border border-slate-800/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Max DD</div>
                    <div className="text-xs font-bold font-mono text-slate-200 tabular-nums">{activeStat.maxDd}</div>
                  </div>
                  <div className="bg-[#0e172a] p-2 rounded border border-slate-800/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Profit F.</div>
                    <div className="text-xs font-bold font-mono text-slate-200 tabular-nums">{activeStat.profitFactor}</div>
                  </div>
                  <div className="bg-[#0e172a] p-2 rounded border border-slate-800/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Trades</div>
                    <div className="text-xs font-bold font-mono text-slate-200 tabular-nums">{activeStat.trades}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Institutional Rigor Strip */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-200">Zero Toxic Recovery</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every system enforces a definitive hard stop-loss. No martingale, no grid doubling, and no infinite hedging.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-200">99.9% Simulated Real-Tick Precision</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulated against variable broker spreads and real execution slippage modeled across 5+ years of historical data.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-200">Native MetaTrader 5</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean compiled MQL5 architecture optimized for low-latency VPS hosting, multi-thread testing, and live execution.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-200">Prop Firm Calibrated</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parameters configured specifically to comply with 4-5% daily loss limits and 8-10% maximum drawdown evaluation rules.
            </p>
          </div>
        </div>

        {/* Simulated Data Disclosure */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 p-4 rounded-lg bg-[#080d18] border border-slate-800/80 text-xs text-slate-400 leading-relaxed font-mono">
          <p>
            <strong className="text-slate-300">Important Disclosure:</strong> All performance metrics, backtest results, and quantitative data shown throughout this site are based on simulated historical or hypothetical calculations. Hypothetical or simulated performance results have inherent limitations; unlike an actual performance record, simulated results do not represent actual trading and do not guarantee future profitability. All Expert Advisors are provided as software tools for MetaTrader 5 and are not investment advice. BoltIQ Markets and WorkFusionApp, Inc. are not registered broker-dealers or investment advisors.
          </p>
        </div>
      </div>
    </section>
  );
}
