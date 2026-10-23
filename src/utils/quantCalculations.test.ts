import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateMaxDrawdown,
  calculateProfitFactor,
  calculatePropChallengeRules,
  generateDeterministicCurve,
} from './quantCalculations';

test('calculateSharpeRatio returns positive annualized ratio for positive returns', () => {
  const returns = [0.01, 0.005, 0.012, -0.002, 0.008, 0.015, -0.003, 0.009];
  const sharpe = calculateSharpeRatio(returns);
  assert.ok(sharpe > 0, 'Sharpe ratio should be positive');
  assert.ok(typeof sharpe === 'number');
});

test('calculateSharpeRatio returns 0 for empty or single element array', () => {
  assert.equal(calculateSharpeRatio([]), 0);
  assert.equal(calculateSharpeRatio([0.05]), 0);
});

test('calculateMaxDrawdown correctly calculates peak-to-trough decline percentage', () => {
  // Peak is 100, drops to 80 -> 20% drawdown
  const curve = [50, 75, 100, 90, 80, 85, 95, 110, 105];
  const result = calculateMaxDrawdown(curve);
  assert.equal(result.maxDrawdownPct, 20);
  assert.equal(result.peakVal, 100);
  assert.equal(result.troughVal, 80);
});

test('calculateMaxDrawdown handles zero or flat curves gracefully', () => {
  assert.equal(calculateMaxDrawdown([]).maxDrawdownPct, 0);
  assert.equal(calculateMaxDrawdown([100, 100, 100]).maxDrawdownPct, 0);
});

test('calculateProfitFactor sums gross profits and divides by gross losses', () => {
  const trades = [
    { pnl: 200 },
    { pnl: -100 },
    { pnl: 300 },
    { pnl: -50 },
  ];
  // Gross profit: 500, Gross loss: 150 -> 500 / 150 = 3.33
  const pf = calculateProfitFactor(trades);
  assert.equal(pf, 3.33);
});

test('calculatePropChallengeRules configures one-step vs two-step accurately', () => {
  const rules100kOne = calculatePropChallengeRules(100000, 'one-step');
  assert.equal(rules100kOne.accountSize, 100000);
  assert.equal(rules100kOne.step, 'one-step');
  assert.equal(rules100kOne.profitTargetPhase1Pct, 10);
  assert.equal(rules100kOne.profitTargetPhase2Pct, null);
  assert.equal(rules100kOne.dailyLossLimitPct, 4);
  assert.equal(rules100kOne.maxDrawdownPct, 6);
  assert.equal(rules100kOne.refundableFee, 549);

  const rules100kTwo = calculatePropChallengeRules(100000, 'two-step');
  assert.equal(rules100kTwo.profitTargetPhase1Pct, 8);
  assert.equal(rules100kTwo.profitTargetPhase2Pct, 5);
  assert.equal(rules100kTwo.dailyLossLimitPct, 5);
  assert.equal(rules100kTwo.maxDrawdownPct, 10);
  assert.equal(rules100kTwo.refundableFee, 499);
});

test('generateDeterministicCurve yields predictable reproducible data', () => {
  const curveA = generateDeterministicCurve(10000, 15, 60, 2, 999);
  const curveB = generateDeterministicCurve(10000, 15, 60, 2, 999);
  assert.deepEqual(curveA.equity, curveB.equity);
  assert.equal(curveA.equity.length, 15);
  assert.equal(curveA.equity[0], 10000);
});
