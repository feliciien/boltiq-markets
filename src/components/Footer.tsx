import { ShieldCheck, ArrowUpRight, Github, Code, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenWaitlist: () => void;
  onLaunchLab: () => void;
}

export default function Footer({ onOpenWaitlist, onLaunchLab }: FooterProps) {
  return (
    <footer className="bg-[#03060c] text-slate-400 border-t border-slate-800 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Domain Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-xs shadow-sm shadow-amber-500/20">
                ⚡
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                BoltIQ <span className="text-amber-400 font-light">Markets</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Institutional quantitative trading technology, MetaTrader 5 Expert Advisor marketplace, and tick-data research laboratory for systematic traders.
            </p>

            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
              <div>Primary Domain: <span className="text-amber-300 font-semibold">boltiqmarkets.com</span></div>
              <div>Platform: <span className="text-slate-300">MetaTrader 5 (MQL5 Native)</span></div>
              <div>Repository Status: <span className="text-emerald-400">Production & GitHub Ready</span></div>
            </div>
          </div>

          {/* Column 1: Algorithmic Systems */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">
              EA Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#marketplace" className="hover:text-amber-400 transition-colors">VoltMatrix MR Pro (FX)</a></li>
              <li><a href="#marketplace" className="hover:text-amber-400 transition-colors">AeroBreak Gold Flow (XAU)</a></li>
              <li><a href="#marketplace" className="hover:text-amber-400 transition-colors">TitanMomentum US Tech 100</a></li>
              <li><a href="#marketplace" className="hover:text-amber-400 transition-colors">StatArb Neutral Sentinel</a></li>
              <li><a href="#marketplace" className="hover:text-amber-400 transition-colors">MQL5 Preset Files (.set)</a></li>
            </ul>
          </div>

          {/* Column 2: Quant Research */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">
              Research & Lab
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onLaunchLab} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Backtesting Simulator
                </button>
              </li>
              <li><a href="#laboratory" className="hover:text-amber-400 transition-colors">Monte Carlo Engine</a></li>
              <li><a href="#analytics" className="hover:text-amber-400 transition-colors">Regime Classification</a></li>
              <li><a href="#analytics" className="hover:text-amber-400 transition-colors">Order Flow Imbalance</a></li>
              <li><a href="#risk-framework" className="hover:text-amber-400 transition-colors">Circuit Breaker Specs</a></li>
            </ul>
          </div>

          {/* Column 3: Proprietary Evaluation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">
              Prop Evaluation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenWaitlist} className="hover:text-amber-400 transition-colors text-left cursor-pointer text-amber-300 font-medium">
                  Join Early Access Waitlist
                </button>
              </li>
              <li><a href="#prop-evaluation" className="hover:text-amber-400 transition-colors">2-Step Institutional Challenge</a></li>
              <li><a href="#prop-evaluation" className="hover:text-amber-400 transition-colors">1-Step Rapid Challenge</a></li>
              <li><a href="#prop-evaluation" className="hover:text-amber-400 transition-colors">Drawdown & Loss Rules</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">Evaluation FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Risk Disclosure Box */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 space-y-4 text-[11px] leading-relaxed text-slate-400">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>MANDATORY RISK & SIMULATED PERFORMANCE DISCLOSURE</span>
          </div>

          <p>
            <strong>Risk Warning:</strong> Trading foreign exchange, futures, and contracts for difference (CFDs) on margin involves a high level of risk and may not be suitable for all market participants. High leverage can amplify losses as well as profits. Before deciding to trade, you should carefully consider your objectives, financial situation, and level of experience.
          </p>

          <p>
            <strong>Simulated Performance Notice:</strong> All Expert Advisors, algorithmic strategies, backtests, and quantitative metrics provided at boltiqmarkets.com are based on simulated historical or hypothetical calculations. Hypothetical or simulated performance results have inherent limitations; unlike an actual performance record, simulated results do not represent actual trading and do not guarantee future profitability.
          </p>

          <p>
            <strong>Corporate & Technology Provider Notice:</strong> BoltIQ Markets is a proprietary financial technology software product and quantitative research brand developed by <strong>WorkFusionApp, Inc.</strong> BoltIQ Markets and WorkFusionApp, Inc. are not registered broker-dealers, investment advisors, asset managers, or commodity pool operators, and do not provide investment advice, broker execution, or custody of customer funds.
          </p>

          <p>
            <strong>Trademark Disclaimer:</strong> MetaTrader 5 and MQL5 are registered trademarks of MetaQuotes Software Corp. BoltIQ Markets is an independent software development laboratory and is not affiliated with or endorsed by MetaQuotes Software Corp.
          </p>
        </div>

        {/* Bottom copyright and legal bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>
            © {new Date().getFullYear()} <strong>WorkFusionApp, Inc.</strong> · BoltIQ Markets (<a href="https://boltiqmarkets.com" className="text-amber-400 hover:underline">boltiqmarkets.com</a> · <a href="https://www.boltiqmarkets.com" className="text-slate-300 hover:underline">www.boltiqmarkets.com</a>). All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="#faq" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#faq" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#faq" className="hover:text-slate-300 transition-colors">Risk Policy</a>
            <span>·</span>
            <span className="text-slate-400 font-mono">v1.0.0-prod</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
