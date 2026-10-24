import { useState, useId } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, HelpCircle, AlertCircle, Sparkles, Database } from 'lucide-react';
import { calculatePropChallengeRules } from '../utils/quantCalculations';

interface WaitlistEntry {
  id?: string;
  name: string;
  email: string;
  accountSize: number;
  step: string;
  provider?: string;
  timestamp: string;
}

export default function PropEvaluation() {
  const [selectedAccountSize, setSelectedAccountSize] = useState<number>(100000);
  const [challengeStep, setChallengeStep] = useState<'one-step' | 'two-step'>('two-step');
  
  // Waitlist form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registeredData, setRegisteredData] = useState<WaitlistEntry | null>(null);
  const [formError, setFormError] = useState('');

  const emailInputId = useId();
  const nameInputId = useId();
  const consentInputId = useId();

  const rules = calculatePropChallengeRules(selectedAccountSize, challengeStep);

  const profitTargetPhase1Dollar = (selectedAccountSize * rules.profitTargetPhase1Pct) / 100;
  const profitTargetPhase2Dollar = rules.profitTargetPhase2Pct
    ? (selectedAccountSize * rules.profitTargetPhase2Pct) / 100
    : null;
  const dailyLossLimitDollar = (selectedAccountSize * rules.dailyLossLimitPct) / 100;
  const maxDrawdownDollar = (selectedAccountSize * rules.maxDrawdownPct) / 100;

  const handleSubmitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setFormError('Please provide a valid institutional or personal email address.');
      return;
    }
    if (!privacyConsent) {
      setFormError('Please accept the privacy policy to receive evaluation cohort access.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim() || 'Anonymous Trader',
        email: email.trim().toLowerCase(),
        accountSize: selectedAccountSize,
        step: challengeStep,
        privacyConsent: true,
        website: honeypot, // Spam honeypot
      };

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // 503: Database not configured — be honest, never fake confirmation
      if (res.status === 503) {
        setFormError('Waitlist applications are temporarily unavailable. Our evaluation database is not yet configured. Please check back soon.');
        setIsSubmitting(false);
        return;
      }

      // Duplicate submission (idempotent replay)
      if (res.status === 200 && !data.success && data.provider === 'unavailable') {
        setFormError('You have already submitted an application for this account tier. We will contact you shortly.');
        setIsSubmitting(false);
        return;
      }

      if (!res.ok || data.success !== true || data.persisted !== true || !data.id) {
        setFormError(data.error || 'Failed to submit application. Please check your details and try again.');
        return;
      }

      const confirmedEntry: WaitlistEntry = {
        id: data.id,
        name: payload.name,
        email: payload.email,
        accountSize: payload.accountSize,
        step: payload.step,
        provider: data.provider,
        timestamp: new Date().toISOString(),
      };

      setRegisteredData(confirmedEntry);
      setFormSubmitted(true);
    } catch (err: any) {
      setFormError(err.message || 'Submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="prop-evaluation" className="py-20 bg-[#070d18] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
              <span>Upcoming Platform Feature</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Simulated Trading Challenges</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Transparent Risk Mandate</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Proprietary Trading Evaluation Platform
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Transparent, algorithm-friendly simulated trading challenges with zero hidden breach traps, realistic drawdowns, and up to a 90% simulated payout split.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0a1122] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChallengeStep('two-step')}
              className={`px-4 py-2 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                challengeStep === 'two-step'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2-Step Institutional
            </button>
            <button
              onClick={() => setChallengeStep('one-step')}
              className={`px-4 py-2 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                challengeStep === 'one-step'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1-Step Rapid
            </button>
          </div>
        </div>

        {/* Account Size Tier Selector */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a1122] p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-slate-300 uppercase">
            Select Simulated Capital Balance:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[25000, 50000, 100000, 200000].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedAccountSize(size)}
                className={`px-5 py-2.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                  selectedAccountSize === size
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-[#060b14] text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white'
                }`}
              >
                ${(size / 1000).toLocaleString()},000 USD
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Breakdown & Interactive Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Rules Table */}
          <div className="lg:col-span-8 bg-[#090f1d] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-6 bg-[#0d1627] border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 block uppercase">
                  Simulated Evaluation Rules: ${selectedAccountSize.toLocaleString()} ({challengeStep === 'two-step' ? '2-Step' : '1-Step'})
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Transparent Risk Objectives
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Refundable Fee</span>
                <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                  ${rules.refundableFee} USD
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs font-mono">
              {/* Profit Target Phase 1 */}
              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div>
                  <span className="text-slate-200 font-semibold block">Profit Target — Phase 1</span>
                  <span className="text-slate-400 text-[11px]">
                    Simulated gain required to pass initial stage
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 block tabular-nums">
                    {rules.profitTargetPhase1Pct}% (${profitTargetPhase1Dollar.toLocaleString()})
                  </span>
                  <span className="text-[10px] text-slate-400">Virtual balance</span>
                </div>
              </div>

              {/* Profit Target Phase 2 (if applicable) */}
              {challengeStep === 'two-step' && (
                <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                  <div>
                    <span className="text-slate-200 font-semibold block">Profit Target — Phase 2</span>
                    <span className="text-slate-400 text-[11px]">
                      Verification stage consistency target
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400 block tabular-nums">
                      {rules.profitTargetPhase2Pct}% (${profitTargetPhase2Dollar?.toLocaleString()})
                    </span>
                    <span className="text-[10px] text-slate-400">Virtual balance</span>
                  </div>
                </div>
              )}

              {/* Daily Loss Limit */}
              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div>
                  <span className="text-slate-200 font-semibold block">Daily Loss Limit (Balance/Equity)</span>
                  <span className="text-slate-400 text-[11px]">
                    Resets daily at 00:00 UTC server time
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-400 block tabular-nums">
                    {rules.dailyLossLimitPct}% (${dailyLossLimitDollar.toLocaleString()})
                  </span>
                  <span className="text-[10px] text-slate-400">Daily threshold</span>
                </div>
              </div>

              {/* Max Overall Drawdown */}
              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div>
                  <span className="text-slate-200 font-semibold block">
                    Maximum Total Drawdown ({challengeStep === 'two-step' ? 'Static Balance' : 'Trailing'})
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Absolute hard stop buffer against account breach
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-200 block tabular-nums">
                    {rules.maxDrawdownPct}% (${maxDrawdownDollar.toLocaleString()})
                  </span>
                  <span className="text-[10px] text-slate-400">Total risk envelope</span>
                </div>
              </div>

              {/* Trading Days */}
              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div>
                  <span className="text-slate-200 font-semibold block">Minimum / Maximum Trading Days</span>
                  <span className="text-slate-400 text-[11px]">No arbitrary time pressure</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white block">
                    {rules.minTradingDays} Days Min / Unlimited Max
                  </span>
                  <span className="text-[10px] text-emerald-400">Trade at your own pace</span>
                </div>
              </div>

              {/* Leverage & Simulated Payout Split */}
              <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div>
                  <span className="text-slate-200 font-semibold block">Simulated Profit Split & Leverage</span>
                  <span className="text-slate-400 text-[11px]">
                    Refund of fee included with first simulated payout
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-300 block">
                    {(rules.simulatedPayoutSplit * 100)}% Split · {rules.leverage} Leverage
                  </span>
                  <span className="text-[10px] text-emerald-400">100% Fee Refund</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#080d18] border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Expert Advisors & Automated Strategies Permitted</span>
              <span className="text-slate-300">MetaTrader 5 Platform</span>
            </div>
          </div>

          {/* Early Access / Waitlist Registration */}
          <div className="lg:col-span-4 bg-[#090f1d] border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cohort Registration</span>
              </div>

              <h3 className="text-xl font-bold text-white">
                Join the Evaluation Waitlist
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Be the first to access the BoltIQ proprietary evaluation launch. First 250 verified participants receive a 20% discount on evaluation fees and free access to our MT5 risk manager plugin.
              </p>

              {formSubmitted ? (
                <div className="mt-6 p-4 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 space-y-2.5">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Application Recorded Successfully</span>
                  </div>
                  <p className="text-[11px] font-mono text-emerald-200/90 leading-relaxed">
                    Thank you, {registeredData?.name || name || 'Trader'}. Your evaluation cohort application for the ${(registeredData?.accountSize || selectedAccountSize).toLocaleString()} USD tier has been validated and queued for <code className="text-white">{registeredData?.email || email}</code>.
                  </p>
                  <div className="p-2 bg-[#060b14]/70 rounded border border-emerald-800/40 text-[10px] text-slate-300 font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Queue ID:</span>
                      <span className="text-amber-400">{registeredData?.id || 'QUEUED_STAGING'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Persistence Status:</span>
                      <span className="text-emerald-400">Server API Validated ({registeredData?.provider || 'serverless-buffer'})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setName('');
                      setEmail('');
                      setPrivacyConsent(false);
                    }}
                    className="text-[11px] font-mono text-amber-400 hover:underline pt-1 block cursor-pointer"
                  >
                    Register another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitWaitlist} className="mt-6 space-y-4">
                  {/* Honeypot Spam Prevention Field */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label htmlFor={nameInputId} className="block text-xs font-mono text-slate-400 mb-1">
                      Full Name:
                    </label>
                    <input
                      id={nameInputId}
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#060b14] border border-slate-700 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor={emailInputId} className="block text-xs font-mono text-slate-400 mb-1">
                      Trading Email <span className="text-amber-400">*</span>:
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      required
                      placeholder="alex@quantfirm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#060b14] border border-slate-700 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Desired Account Tier:
                    </label>
                    <div className="text-xs font-mono text-amber-300 font-semibold bg-[#060b14] border border-slate-700 rounded p-2">
                      ${selectedAccountSize.toLocaleString()} USD ({challengeStep === 'two-step' ? '2-Step' : '1-Step'})
                    </div>
                  </div>

                  {/* Privacy Policy Consent Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id={consentInputId}
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 accent-amber-400 rounded cursor-pointer"
                    />
                    <label htmlFor={consentInputId} className="text-[11px] text-slate-300 leading-snug cursor-pointer">
                      I agree to receive simulated evaluation challenge invitations and accept the WorkFusionApp, Inc.{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline underline-offset-2">Privacy Policy</a>.
                    </label>
                  </div>

                  {formError && (
                    <div className="text-[11px] font-mono text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-md shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{isSubmitting ? 'Submitting to Server...' : 'Reserve Evaluation Spot'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 leading-tight">
              Evaluation challenges are conducted in simulated virtual environments. BoltIQ Markets does not accept deposits or act as a broker.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
