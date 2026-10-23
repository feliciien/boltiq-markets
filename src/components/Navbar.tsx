import { useState } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenWaitlist: () => void;
  onLaunchLab: () => void;
}

export default function Navbar({ onOpenWaitlist, onLaunchLab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'EA Marketplace', href: '#marketplace' },
    { label: 'Backtest Lab', href: '#laboratory' },
    { label: 'AI Analytics', href: '#analytics' },
    { label: 'Prop Evaluation', href: '#prop-evaluation' },
    { label: 'Risk Architecture', href: '#risk-framework' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050811]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      {/* Top Disclaimer / Regulatory Notice Bar */}
      <div className="w-full bg-[#090e1c] border-b border-slate-800/60 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium text-slate-300">BoltIQ Markets Research:</span>
          <span>All Expert Advisors and backtest metrics represent simulated historical models for MetaTrader 5.</span>
          <span className="hidden md:inline text-slate-600">·</span>
          <span className="hidden md:inline text-amber-300/90 font-mono">boltiqmarkets.com</span>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-slate-100 font-bold tracking-tight text-lg whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors">
                BoltIQ <span className="text-amber-400 font-light">Markets</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">
                Quant MT5 Lab
              </span>
            </div>
          </a>

          {/* Zone 2: 4–6 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-amber-400/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onLaunchLab}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors whitespace-nowrap shrink-0"
            >
              Simulate Lab
            </button>
            <button
              onClick={onOpenWaitlist}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-md hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/10 transition-all hover:shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Prop Evaluation Waitlist</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={mobileMenuOpen ? 'Close main navigation' : 'Open main navigation'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#060b14] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchLab();
              }}
              className="w-full text-center px-4 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              Launch Backtest Simulator
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWaitlist();
              }}
              className="w-full text-center px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors"
            >
              Prop Evaluation Early Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
