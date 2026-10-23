/**
 * Pure Quantitative Finance & Prop Trading Calculation Utilities
 * BoltIQ Markets (boltiqmarkets.com)
 */

export interface PropChallengeConfig {
  accountSize: number;
  step: 'one-step' | 'two-step';
  profitTargetPhase1Pct: number;
  profitTargetPhase2Pct: number | null;
  dailyLossLimitPct: number;
  maxDrawdownPct: number;
  minTradingDays: number;
  maxTradingDays: number | 'Unlimited';
  simulatedPayoutSplit: number; // e.g. 0.85 (85%)
  leverage: string;
  refundableFee: number;
}

export function calculateSharpeRatio(returns: number[], riskFreeRateDaily: number = 0.0001): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((acc, r) => acc + r, 0) / returns.length;
  const variance = returns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return 0;
  // Annualized using sqrt(252 trading days)
  const dailySharpe = (mean - riskFreeRateDaily) / stdDev;
  return Number((dailySharpe * Math.sqrt(252)).toFixed(2));
}

export function calculateSortinoRatio(returns: number[], riskFreeRateDaily: number = 0.0001): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((acc, r) => acc + r, 0) / returns.length;
  const downsideReturns = returns.filter(r => r < riskFreeRateDaily);
  if (downsideReturns.length === 0) return 3.5; // High cap when virtually no downside
  const downsideVariance = downsideReturns.reduce((acc, r) => acc + Math.pow(r - riskFreeRateDaily, 2), 0) / downsideReturns.length;
  const downsideStd = Math.sqrt(downsideVariance);
  if (downsideStd === 0) return 0;
  return Number(((mean - riskFreeRateDaily) / downsideStd * Math.sqrt(252)).toFixed(2));
}

export function calculateMaxDrawdown(equityCurve: number[]): { maxDrawdownPct: number; peakVal: number; troughVal: number } {
  if (equityCurve.length === 0) return { maxDrawdownPct: 0, peakVal: 0, troughVal: 0 };
  let peak = equityCurve[0];
  let maxDd = 0;
  let peakAtMaxDd = peak;
  let troughAtMaxDd = peak;

  for (let i = 0; i < equityCurve.length; i++) {
    const val = equityCurve[i];
    if (val > peak) {
      peak = val;
    }
    const dd = (peak - val) / peak;
    if (dd > maxDd) {
      maxDd = dd;
      peakAtMaxDd = peak;
      troughAtMaxDd = val;
    }
  }

  return {
    maxDrawdownPct: Number((maxDd * 100).toFixed(2)),
    peakVal: peakAtMaxDd,
    troughVal: troughAtMaxDd,
  };
}

export function calculateProfitFactor(trades: { pnl: number }[]): number {
  if (trades.length === 0) return 0;
  let grossProfit = 0;
  let grossLoss = 0;
  for (const t of trades) {
    if (t.pnl > 0) grossProfit += t.pnl;
    else if (t.pnl < 0) grossLoss += Math.abs(t.pnl);
  }
  if (grossLoss === 0) return grossProfit > 0 ? 9.99 : 0;
  return Number((grossProfit / grossLoss).toFixed(2));
}

export function calculatePropChallengeRules(accountSize: number, step: 'one-step' | 'two-step'): PropChallengeConfig {
  const isOneStep = step === 'one-step';
  const feeMap: Record<number, { oneStep: number; twoStep: number }> = {
    25000: { oneStep: 199, twoStep: 169 },
    50000: { oneStep: 329, twoStep: 289 },
    100000: { oneStep: 549, twoStep: 499 },
    200000: { oneStep: 999, twoStep: 899 },
  };

  const selectedTier = feeMap[accountSize] || { oneStep: 299, twoStep: 249 };

  return {
    accountSize,
    step,
    profitTargetPhase1Pct: isOneStep ? 10 : 8,
    profitTargetPhase2Pct: isOneStep ? null : 5,
    dailyLossLimitPct: isOneStep ? 4 : 5,
    maxDrawdownPct: isOneStep ? 6 : 10,
    minTradingDays: isOneStep ? 4 : 5,
    maxTradingDays: 'Unlimited',
    simulatedPayoutSplit: isOneStep ? 0.80 : 0.85,
    leverage: isOneStep ? '1:30' : '1:50',
    refundableFee: isOneStep ? selectedTier.oneStep : selectedTier.twoStep,
  };
}

/**
 * Deterministic PRNG for reliable backtest curve generation in tests and UI
 */
export function generateDeterministicCurve(
  initialBalance: number,
  points: number,
  winRatePct: number,
  volatilityPct: number,
  seed = 42
): { equity: number[]; drawdowns: number[] } {
  const equity: number[] = [initialBalance];
  const drawdowns: number[] = [0];
  let current = initialBalance;
  let peak = initialBalance;

  let s = seed;
  const pseudoRandom = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  for (let i = 1; i < points; i++) {
    const isWin = pseudoRandom() * 100 < winRatePct;
    const magnitude = pseudoRandom() * volatilityPct * 0.01;
    const delta = isWin ? current * magnitude * 1.4 : -current * magnitude;
    current = Math.max(current * 0.5, current + delta);
    equity.push(Math.round(current * 100) / 100);

    if (current > peak) peak = current;
    const dd = ((peak - current) / peak) * 100;
    drawdowns.push(Math.round(dd * 100) / 100);
  }

  return { equity, drawdowns };
}
