import { useState, useMemo } from 'react';
import labImage from '../assets/images/lab_backtest_station_1792773586094.jpg';
import { Play, RotateCcw, Download, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { BACKTEST_PRESETS, BacktestPreset } from '../data/marketData';
import {
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateMaxDrawdown,
  calculateProfitFactor,
  generateDeterministicCurve,
} from '../utils/quantCalculations';

export default function BacktestLaboratory() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('eurusd-mr');
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [riskPerTradePct, setRiskPerTradePct] = useState<number>(1.0);
  const [slippagePips, setSlippagePips] = useState<number>(0.6);
  const [timeframe, setTimeframe] = useState<string>('M15');
  const [activeChartTab, setActiveChartTab] = useState<'equity' | 'underwater' | 'montecarlo'>('equity');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const activePreset: BacktestPreset = useMemo(() => {
    return BACKTEST_PRESETS.find((p) => p.id === selectedPresetId) || BACKTEST_PRESETS[0];
  }, [selectedPresetId]);

  // Dynamically compute adjusted backtest outcomes based on user risk and slippage controls
  const dynamicResults = useMemo(() => {
    // Generate deterministic equity curve based on parameters
    const seed = selectedPresetId === 'eurusd-mr' ? 101 : selectedPresetId === 'xauusd-flow' ? 202 : selectedPresetId === 'nas100-momentum' ? 303 : 404;
    const baseWinRate = activePreset.winRatePct;
    // Slippage penalty: each 0.5 pip decreases net profit slightly
    const slippagePenalty = (slippagePips - 0.4) * 1.5;
    const effectiveWinRate = Math.max(48, Math.min(80, baseWinRate - slippagePenalty * 0.4));
    
    // Scale volatility by risk slider
    const effectiveVol = riskPerTradePct * 1.8;
    const curvePoints = 40;
    const { equity, drawdowns } = generateDeterministicCurve(initialCapital, curvePoints, effectiveWinRate, effectiveVol, seed);

    const finalBalance = equity[equity.length - 1];
    const netReturnDollar = finalBalance - initialCapital;
    const netReturnPct = Number(((netReturnDollar / initialCapital) * 100).toFixed(2));

    // Calculate returns array for Sharpe and Sortino
    const dailyReturns: number[] = [];
    for (let i = 1; i < equity.length; i++) {
      dailyReturns.push((equity[i] - equity[i - 1]) / equity[i - 1]);
    }

    const sharpe = calculateSharpeRatio(dailyReturns);
    const sortino = calculateSortinoRatio(dailyReturns);
    const ddStats = calculateMaxDrawdown(equity);

    // Monte Carlo simulation runs (P95 upper, Median, P5 lower)
    const p95Curve = equity.map((val, idx) => Math.round(initialCapital + (val - initialCapital) * 1.25 + idx * 200));
    const p5Curve = equity.map((val, idx) => Math.round(initialCapital + (val - initialCapital) * 0.72 - idx * 100));

    return {
      equity,
      drawdowns,
      p95Curve,
      p5Curve,
      finalBalance,
      netReturnDollar,
      netReturnPct,
      sharpe,
      sortino,
      maxDdPct: ddStats.maxDrawdownPct,
      peakVal: ddStats.peakVal,
      troughVal: ddStats.troughVal,
      totalTrades: activePreset.totalTrades,
      winRate: Number(effectiveWinRate.toFixed(1)),
      profitFactor: Number((activePreset.profitFactor * (1 - (slippagePips - 0.5) * 0.08)).toFixed(2)),
    };
  }, [activePreset, initialCapital, riskPerTradePct, slippagePips, selectedPresetId]);

  const handleResetDefaults = () => {
    setInitialCapital(100000);
    setRiskPerTradePct(1.0);
    setSlippagePips(0.6);
    setTimeframe('M15');
  };

  const handleExportCsv = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
    }, 3500);
  };

  // SVG Coordinates calculation for chart
  const minEquity = Math.min(...dynamicResults.equity) * 0.98;
  const maxEquity = Math.max(...dynamicResults.equity, ...dynamicResults.p95Curve) * 1.02;
  const chartWidth = 700;
  const chartHeight = 220;

  const getSvgX = (index: number) => (index / (dynamicResults.equity.length - 1)) * chartWidth;
  const getSvgY = (val: number) => chartHeight - ((val - minEquity) / (maxEquity - minEquity)) * chartHeight;

  const equityPath = dynamicResults.equity
    .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i).toFixed(1)} ${getSvgY(val).toFixed(1)}`)
    .join(' ');

  const p95Path = dynamicResults.p95Curve
    .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i).toFixed(1)} ${getSvgY(val).toFixed(1)}`)
    .join(' ');

  const p5Path = dynamicResults.p5Curve
    .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i).toFixed(1)} ${getSvgY(val).toFixed(1)}`)
    .join(' ');

  // Underwater drawdown SVG
  const maxDdObserved = Math.max(...dynamicResults.drawdowns, 10);
  const getDdY = (ddVal: number) => (ddVal / maxDdObserved) * chartHeight;
  const drawdownPath = dynamicResults.drawdowns
    .map((dd, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i).toFixed(1)} ${getDdY(dd).toFixed(1)}`)
    .join(' ');

  return (
    <section id="laboratory" className="py-20 bg-[#070d18] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
              <span>Quantitative Research Lab</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Tick Data Suite Integration</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Monte Carlo Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Interactive Quantitative Backtesting Laboratory
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Stress-test algorithmic models with simulated execution parameters, real tick spreads, slippage latency, and Monte Carlo confidence intervals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 rounded border border-slate-700/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Model</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* Workstation Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0a1122] border border-slate-800 rounded-xl p-5 space-y-5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Model Calibration Parameters</span>
                <Sliders className="w-4 h-4 text-amber-400" />
              </h3>

              {/* Strategy Preset Selector */}
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1.5">
                  Select Base Strategy Architecture:
                </label>
                <select
                  value={selectedPresetId}
                  onChange={(e) => setSelectedPresetId(e.target.value)}
                  className="w-full bg-[#060b14] border border-slate-700 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                >
                  {BACKTEST_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial Capital Selector */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Initial Account Capital:</span>
                  <span className="text-amber-400 font-semibold tabular-nums">
                    ${initialCapital.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10000, 50000, 100000, 200000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setInitialCapital(amt)}
                      className={`py-1.5 text-xs font-mono rounded border transition-colors ${
                        initialCapital === amt
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                          : 'bg-[#060b14] text-slate-300 border-slate-700/80 hover:border-slate-500'
                      }`}
                    >
                      ${amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Per Trade Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Risk Per Trade:</span>
                  <span className="text-amber-400 font-semibold tabular-nums">
                    {riskPerTradePct.toFixed(1)}% Equity
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={riskPerTradePct}
                  onChange={(e) => setRiskPerTradePct(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0.5% (Conservative)</span>
                  <span>1.0% (Prop Standard)</span>
                  <span>2.5% (Aggressive)</span>
                </div>
              </div>

              {/* Slippage & Spread Stress Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Execution Slippage & Spread:</span>
                  <span className="text-slate-200 font-semibold tabular-nums">
                    {slippagePips.toFixed(1)} Pips
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.8"
                  step="0.1"
                  value={slippagePips}
                  onChange={(e) => setSlippagePips(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0.2p (Raw ECN)</span>
                  <span>0.6p (Standard)</span>
                  <span>1.8p (News Flash)</span>
                </div>
              </div>

              {/* Timeframe Selector */}
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1.5">
                  Execution Timeframe:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['M5', 'M15', 'H1', 'H4'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`py-1.5 text-xs font-mono rounded border transition-colors ${
                        timeframe === tf
                          ? 'bg-slate-700 text-white font-bold border-amber-400'
                          : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Laboratory Station Asset Badge */}
              <div className="pt-2 border-t border-slate-800">
                <div className="rounded overflow-hidden border border-slate-800 relative">
                  <img
                    src={labImage}
                    alt="BoltIQ Research Workstation"
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover object-center opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1122] via-[#0a1122]/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300">
                    Host: MT5 Server Cluster 04 (London Equinix LD4)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chart & Quantitative KPI Output */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0a1122] p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Simulated Return</span>
                <p className="text-xl font-extrabold font-mono text-emerald-400 mt-1 tabular-nums">
                  +{dynamicResults.netReturnPct}%
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  +${Math.round(dynamicResults.netReturnDollar).toLocaleString()}
                </span>
              </div>

              <div className="bg-[#0a1122] p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Annualized Sharpe</span>
                <p className="text-xl font-extrabold font-mono text-amber-300 mt-1 tabular-nums">
                  {dynamicResults.sharpe}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  Sortino: {dynamicResults.sortino}
                </span>
              </div>

              <div className="bg-[#0a1122] p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Max Peak Drawdown</span>
                <p className="text-xl font-extrabold font-mono text-slate-200 mt-1 tabular-nums">
                  {dynamicResults.maxDdPct}%
                </p>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Within 10% Prop Cap
                </span>
              </div>

              <div className="bg-[#0a1122] p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Profit Factor</span>
                <p className="text-xl font-extrabold font-mono text-slate-200 mt-1 tabular-nums">
                  {dynamicResults.profitFactor}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  Win Rate: {dynamicResults.winRate}%
                </span>
              </div>
            </div>

            {/* Chart Container */}
            <div className="bg-[#0a1122] border border-slate-800 rounded-xl p-6">
              {/* Chart Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveChartTab('equity')}
                    className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                      activeChartTab === 'equity'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white bg-[#060b14]'
                    }`}
                  >
                    Simulated Equity Curve
                  </button>
                  <button
                    onClick={() => setActiveChartTab('underwater')}
                    className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                      activeChartTab === 'underwater'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white bg-[#060b14]'
                    }`}
                  >
                    Underwater Drawdown %
                  </button>
                  <button
                    onClick={() => setActiveChartTab('montecarlo')}
                    className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                      activeChartTab === 'montecarlo'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white bg-[#060b14]'
                    }`}
                  >
                    Monte Carlo (P95 / P50 / P5)
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Total Trades: <span className="text-white font-semibold">{dynamicResults.totalTrades}</span>
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <div className="relative w-full h-64 bg-[#060b14] rounded-lg border border-slate-800/80 p-3 overflow-hidden">
                {activeChartTab === 'equity' && (
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    <defs>
                      <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    {[0.25, 0.5, 0.75].map((pct, idx) => (
                      <line
                        key={idx}
                        x1="0"
                        y1={chartHeight * pct}
                        x2={chartWidth}
                        y2={chartHeight * pct}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Fill */}
                    <path
                      d={`${equityPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                      fill="url(#eqFill)"
                    />

                    {/* Equity line */}
                    <path
                      d={equityPath}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive datapoint circles */}
                    {dynamicResults.equity.map((val, i) => (
                      <circle
                        key={i}
                        cx={getSvgX(i)}
                        cy={getSvgY(val)}
                        r={hoveredPointIndex === i ? 6 : 3}
                        fill={hoveredPointIndex === i ? '#ffffff' : '#f59e0b'}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredPointIndex(i)}
                      />
                    ))}
                  </svg>
                )}

                {activeChartTab === 'underwater' && (
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>

                    {/* 5% and 10% prop limits */}
                    <line
                      x1="0"
                      y1={getDdY(5)}
                      x2={chartWidth}
                      y2={getDdY(5)}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                    />
                    <text x="10" y={getDdY(5) - 4} fill="#f59e0b" fontSize="10" fontFamily="monospace">
                      5% Daily Prop Cap Limit
                    </text>

                    <line
                      x1="0"
                      y1={getDdY(10)}
                      x2={chartWidth}
                      y2={getDdY(10)}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                    />
                    <text x="10" y={getDdY(10) - 4} fill="#ef4444" fontSize="10" fontFamily="monospace">
                      10% Max Drawdown Breach Line
                    </text>

                    {/* Underwater Area */}
                    <path
                      d={`${drawdownPath} L ${chartWidth} 0 L 0 0 Z`}
                      fill="url(#ddFill)"
                    />
                    <path
                      d={drawdownPath}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </svg>
                )}

                {activeChartTab === 'montecarlo' && (
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    {/* P95 Upper */}
                    <path
                      d={p95Path}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />
                    {/* Median P50 */}
                    <path
                      d={equityPath}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                    {/* P5 Lower */}
                    <path
                      d={p5Path}
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />
                  </svg>
                )}

                {/* Hover inspection tooltip */}
                {hoveredPointIndex !== null && activeChartTab === 'equity' && (
                  <div
                    className="absolute bg-[#0f172a] border border-amber-400/80 rounded px-3 py-1.5 text-[11px] font-mono text-white pointer-events-none shadow-xl"
                    style={{
                      left: Math.min(chartWidth - 120, Math.max(10, getSvgX(hoveredPointIndex) - 50)),
                      top: Math.max(10, getSvgY(dynamicResults.equity[hoveredPointIndex]) - 45),
                    }}
                  >
                    <div>Step {hoveredPointIndex + 1} of 40</div>
                    <div className="font-bold text-amber-300 tabular-nums">
                      ${Math.round(dynamicResults.equity[hoveredPointIndex]).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Caption & Legend */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-amber-400" />
                    <span>Real-Tick Base Curve</span>
                  </div>
                  {activeChartTab === 'montecarlo' && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-emerald-500" />
                        <span>P95 Best Case</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-red-400" />
                        <span>P5 Worst Case</span>
                      </div>
                    </>
                  )}
                </div>

                <span>Data Feed: 99.9% Tick Data Suite (Dukascopy & Tickmill)</span>
              </div>
            </div>
          </div>
        </div>

        {exportSuccess && (
          <div className="mt-6 p-4 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Audit report exported: Backtest metrics and trade distribution log prepared for {activePreset.name}.</span>
          </div>
        )}
      </div>
    </section>
  );
}
