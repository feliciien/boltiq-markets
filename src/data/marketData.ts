export interface ExpertAdvisor {
  id: string;
  name: string;
  tagline: string;
  assetClass: 'Forex' | 'Metals' | 'Indices' | 'Multi-Asset';
  strategyType: 'Mean Reversion' | 'Order Flow' | 'Session Momentum' | 'Arbitrage';
  timeframe: string;
  sharpeRatio: number;
  profitFactor: number;
  maxDrawdownPct: number;
  historicalWinRatePct: number;
  backtestPeriod: string;
  executionModel: string;
  compatibility: string;
  rating: number;
  monthlySimulatedPnl: string;
  recommendedLeverage: string;
  recommendedDeposit: string;
  riskClass: 'Conservative' | 'Moderate' | 'Dynamic';
  description: string;
  features: string[];
  parameters: { name: string; defaultValue: string; description: string }[];
}

export const EXPERT_ADVISORS: ExpertAdvisor[] = [
  {
    id: 'voltmatrix-mean-reversion',
    name: 'VoltMatrix MR Pro MT5',
    tagline: 'Statistical Bollinger & VWAP dispersion engine for FX majors',
    assetClass: 'Forex',
    strategyType: 'Mean Reversion',
    timeframe: 'M15',
    sharpeRatio: 2.34,
    profitFactor: 2.18,
    maxDrawdownPct: 5.4,
    historicalWinRatePct: 68.2,
    backtestPeriod: '2019 – 2026 (99.9% Real Ticks)',
    executionModel: 'Strict stop-loss per position, no martingale, no grid',
    compatibility: 'MetaTrader 5 (Build 3900+)',
    rating: 4.9,
    monthlySimulatedPnl: '+3.8% – +6.2%',
    recommendedLeverage: '1:30 – 1:100',
    recommendedDeposit: '$1,000 min ($10,000 recommended)',
    riskClass: 'Conservative',
    description: 'VoltMatrix utilizes non-parametric volatility envelopes and volume-weighted average price (VWAP) mean reversion signals during low-spread Asian and pre-London market transitions. Features hard equity circuit breakers and automatic spread widening filters.',
    features: [
      'Calculates multi-timeframe standard deviation bands',
      'Dynamic lot allocation based on account equity and ATR',
      'Automatic news blackout filter 30 min before/after high-impact releases',
      'Built-in slippage tolerance detector with max 1.2 pip deviation',
      'Includes 6 calibrated .SET preset files for EURUSD, GBPUSD, AUDUSD'
    ],
    parameters: [
      { name: 'Risk_Percent_Per_Trade', defaultValue: '1.0%', description: 'Capital allocation per signal' },
      { name: 'ATR_StopLoss_Multiplier', defaultValue: '1.85', description: 'Dynamic trailing stop calculation' },
      { name: 'Max_Allowed_Spread_Pips', defaultValue: '1.4', description: 'Blocks entry during illiquid roll' },
      { name: 'Friday_Close_Hour_UTC', defaultValue: '20:00', description: 'Closes active exposure before weekend' },
    ]
  },
  {
    id: 'aerobreak-orderflow-xau',
    name: 'AeroBreak XAU Gold Flow',
    tagline: 'Institutional liquidity sweep & order flow breakout system for Spot Gold',
    assetClass: 'Metals',
    strategyType: 'Order Flow',
    timeframe: 'M5 / M15',
    sharpeRatio: 2.12,
    profitFactor: 2.05,
    maxDrawdownPct: 6.8,
    historicalWinRatePct: 61.4,
    backtestPeriod: '2020 – 2026 (Tickmill / Dukascopy Ticks)',
    executionModel: 'Partial take-profit scaling with break-even trailing',
    compatibility: 'MetaTrader 5',
    rating: 4.8,
    monthlySimulatedPnl: '+4.5% – +7.9%',
    recommendedLeverage: '1:50 – 1:100',
    recommendedDeposit: '$2,500 min',
    riskClass: 'Moderate',
    description: 'Engineered specifically for the high-liquidity volatility of Spot Gold (XAUUSD). Identifies liquidity sweeps around daily session highs/lows and institutional volume absorptions during the London and New York overlaps.',
    features: [
      'Identifies fakeout institutional liquidity grabs with volume validation',
      '2-stage partial profit-taking (50% at 1.5R, remainder trails to 3.5R)',
      'Asymmetric slippage mitigation for fast gold spikes',
      'Optimized for London AM & NY Opening momentum windows'
    ],
    parameters: [
      { name: 'Liquidity_Lookback_Bars', defaultValue: '48', description: 'Session range threshold evaluation' },
      { name: 'Min_Volume_Threshold_ZScore', defaultValue: '2.1', description: 'Volume surge confirmation' },
      { name: 'BreakEven_Trigger_R', defaultValue: '1.2', description: 'Moves stop loss to entry price' },
      { name: 'Max_Daily_Risk_Cap', defaultValue: '3.0%', description: 'Halts trading if daily limit reached' },
    ]
  },
  {
    id: 'titan-session-momentum',
    name: 'TitanMomentum Indices MT5',
    tagline: 'Session breakout model tailored for US Tech 100 (NAS100) & DAX40',
    assetClass: 'Indices',
    strategyType: 'Session Momentum',
    timeframe: 'M15',
    sharpeRatio: 1.98,
    profitFactor: 1.92,
    maxDrawdownPct: 7.2,
    historicalWinRatePct: 57.8,
    backtestPeriod: '2019 – 2026 (Real Exchange Ticks)',
    executionModel: 'Time-window momentum with trailing ATR stops',
    compatibility: 'MetaTrader 5',
    rating: 4.8,
    monthlySimulatedPnl: '+5.2% – +8.4%',
    recommendedLeverage: '1:20 – 1:50',
    recommendedDeposit: '$2,000 min',
    riskClass: 'Moderate',
    description: 'Captures sustained directional institutional flow at cash open (09:30 EST for US Equities and 09:00 CET for Frankfurt). Filters false breakouts using relative strength indexing and tick imbalance thresholds.',
    features: [
      'Cash open volatility filtering with pre-market volume analysis',
      'Configurable session windows with automatic holiday detection',
      'Time-decay exit strategy if target not reached within 4 hours',
      'Low correlation with traditional FX and commodities portfolios'
    ],
    parameters: [
      { name: 'Session_Opening_Hour', defaultValue: '14:30 UTC', description: 'US Market open start trigger' },
      { name: 'ATR_Expansion_Factor', defaultValue: '1.45', description: 'Minimum volatility expansion needed' },
      { name: 'Trailing_Stop_Step_Pts', defaultValue: '250', description: 'Dynamic trailing step for index points' },
    ]
  },
  {
    id: 'statarb-grid-sentinel',
    name: 'StatArb Neutral Sentinel',
    tagline: 'Co-integrated synthetic pair arbitrage with strict basket stop-out',
    assetClass: 'Multi-Asset',
    strategyType: 'Arbitrage',
    timeframe: 'H1',
    sharpeRatio: 2.65,
    profitFactor: 2.42,
    maxDrawdownPct: 4.2,
    historicalWinRatePct: 74.1,
    backtestPeriod: '2021 – 2026 (Multi-currency tick synchronization)',
    executionModel: 'Synthetic hedge basket with portfolio delta cap',
    compatibility: 'MetaTrader 5',
    rating: 4.9,
    monthlySimulatedPnl: '+2.9% – +4.8%',
    recommendedLeverage: '1:30',
    recommendedDeposit: '$5,000 min',
    riskClass: 'Conservative',
    description: 'Simultaneously trades cointegrated currency triplets (e.g. EURUSD, GBPUSD, EURGBP) capitalizing on transient synthetic pricing divergences. Uses mathematical mean-reversion with absolute portfolio stop-loss protection.',
    features: [
      'Real-time Engle-Granger cointegration testing on terminal ticks',
      'Market neutral exposure minimizing broader macro trend risk',
      'Tight correlation monitoring that disables trading during divergence shocks',
      'Zero overnight rollover bias on matched currency legs'
    ],
    parameters: [
      { name: 'Cointegration_Z_Score_Entry', defaultValue: '2.35', description: 'Threshold for basket entry' },
      { name: 'Basket_Stop_Loss_Pct', defaultValue: '2.5%', description: 'Absolute worst-case portfolio cutoff' },
      { name: 'Max_Open_Baskets', defaultValue: '2', description: 'Limits concurrent arbitrage legs' },
    ]
  }
];

export interface BacktestPreset {
  id: string;
  name: string;
  symbol: string;
  period: string;
  initialBalance: number;
  finalBalance: number;
  netProfitPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  profitFactor: number;
  maxDrawdownPct: number;
  winRatePct: number;
  totalTrades: number;
  avgTradeTime: string;
}

export const BACKTEST_PRESETS: BacktestPreset[] = [
  {
    id: 'eurusd-mr',
    name: 'VoltMatrix MR Pro — EUR/USD (M15)',
    symbol: 'EURUSD',
    period: '2021 – 2026 (5 Years)',
    initialBalance: 100000,
    finalBalance: 178420,
    netProfitPct: 78.42,
    sharpeRatio: 2.34,
    sortinoRatio: 3.12,
    profitFactor: 2.18,
    maxDrawdownPct: 5.4,
    winRatePct: 68.2,
    totalTrades: 1248,
    avgTradeTime: '3h 42m'
  },
  {
    id: 'xauusd-flow',
    name: 'AeroBreak Flow — XAU/USD (M5)',
    symbol: 'XAUUSD',
    period: '2021 – 2026 (5 Years)',
    initialBalance: 100000,
    finalBalance: 214580,
    netProfitPct: 114.58,
    sharpeRatio: 2.12,
    sortinoRatio: 2.85,
    profitFactor: 2.05,
    maxDrawdownPct: 6.8,
    winRatePct: 61.4,
    totalTrades: 1682,
    avgTradeTime: '1h 18m'
  },
  {
    id: 'nas100-momentum',
    name: 'TitanMomentum — US Tech 100 (M15)',
    symbol: 'NAS100',
    period: '2021 – 2026 (5 Years)',
    initialBalance: 100000,
    finalBalance: 236890,
    netProfitPct: 136.89,
    sharpeRatio: 1.98,
    sortinoRatio: 2.64,
    profitFactor: 1.92,
    maxDrawdownPct: 7.2,
    winRatePct: 57.8,
    totalTrades: 940,
    avgTradeTime: '2h 55m'
  },
  {
    id: 'statarb-portfolio',
    name: 'StatArb Sentinel — Triplet Portfolio (H1)',
    symbol: 'PORTFOLIO',
    period: '2021 – 2026 (5 Years)',
    initialBalance: 100000,
    finalBalance: 164200,
    netProfitPct: 64.20,
    sharpeRatio: 2.65,
    sortinoRatio: 3.82,
    profitFactor: 2.42,
    maxDrawdownPct: 4.2,
    winRatePct: 74.1,
    totalTrades: 812,
    avgTradeTime: '12h 10m'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How do BoltIQ Markets Expert Advisors run on MetaTrader 5?',
    answer: 'Our Expert Advisors are written in optimized MQL5 and packaged as compiled .ex5 files and customizable .set preset parameter files. Simply copy the EA into your MT5 "MQL5/Experts" directory, attach it to the recommended chart timeframe, and load our audited preset configuration. Comprehensive video and PDF installation guides are provided with each system.'
  },
  {
    question: 'How are the backtesting results validated and verified?',
    answer: 'All backtests hosted in the BoltIQ Laboratory are executed using MetaTrader 5 Strategy Tester with 99.9% real tick data (Tick Data Suite & Dukascopy real tick feeds), including real floating spreads, realistic slippage modeling (0.5 to 1.5 pips), and commission deductions. We do not use fixed-spread approximations or generic OHLC ticks.'
  },
  {
    question: 'Do any BoltIQ strategies utilize Martingale or endless grid mechanisms?',
    answer: 'Strictly zero. BoltIQ adheres to an institutional risk mandate: every single trade executes with a predefined hard stop-loss calculated at order entry. Strategies never double down on losing positions, never use infinite grid recovery, and enforce maximum daily equity loss caps to ensure compliance with strict prop firm and institutional drawdown rules.'
  },
  {
    question: 'When will the BoltIQ Proprietary Trading Evaluation platform launch?',
    answer: 'Our proprietary evaluation program is currently completing infrastructure testing with institutional liquidity providers. We are currently accepting applications for the Early Access Evaluation Cohort. Registered participants will receive priority access, waived setup fees on their first challenge, and direct access to our automated MT5 risk dashboard.'
  },
  {
    question: 'Can I use BoltIQ Expert Advisors on external proprietary trading firms?',
    answer: 'Yes. Our EAs are engineered to meet the strict risk rules of top proprietary trading firms (FTMO, FundedNext, Alpha Capital, 5ers, etc.). They feature customizable daily loss limits, weekend closing timers, maximum spread filters, and news event blackout settings to protect your evaluation credentials.'
  },
  {
    question: 'What is the refund and license policy for digital software and presets?',
    answer: 'Each EA purchase includes lifetime license activation keys for up to two MT5 live or demo accounts, future algorithm updates, and access to the quantitative backtesting lab. For proprietary trading challenges, 100% of the evaluation fee is refunded upon reaching the first simulated profit milestone.'
  }
];
