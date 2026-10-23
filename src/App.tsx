/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EAMarketplace from './components/EAMarketplace';
import BacktestLaboratory from './components/BacktestLaboratory';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PropEvaluation from './components/PropEvaluation';
import RiskManagementSection from './components/RiskManagementSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import StrategyModal from './components/StrategyModal';
import { ExpertAdvisor } from './data/marketData';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [selectedStrategy, setSelectedStrategy] = useState<ExpertAdvisor | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenWaitlist = () => {
    scrollToSection('prop-evaluation');
  };

  const handleLaunchLab = () => {
    scrollToSection('laboratory');
  };

  const handleExploreEAs = () => {
    scrollToSection('marketplace');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onOpenWaitlist={handleOpenWaitlist}
        onLaunchLab={handleLaunchLab}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreEAs={handleExploreEAs}
          onLaunchLab={handleLaunchLab}
        />

        {/* Professional MT5 EA Marketplace */}
        <EAMarketplace
          onSelectStrategy={(strategy) => setSelectedStrategy(strategy)}
        />

        {/* Quantitative Backtesting Laboratory */}
        <BacktestLaboratory />

        {/* AI-Powered Trading Analytics Telemetry */}
        <AnalyticsDashboard />

        {/* Proprietary Trading Evaluation Platform */}
        <PropEvaluation />

        {/* Risk Management Architecture & Hard Stop-Loss Engine */}
        <RiskManagementSection />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Institutional Footer */}
      <Footer
        onOpenWaitlist={handleOpenWaitlist}
        onLaunchLab={handleLaunchLab}
      />

      {/* Strategy Audit & Code Specification Modal */}
      {selectedStrategy && (
        <StrategyModal
          strategy={selectedStrategy}
          onClose={() => setSelectedStrategy(null)}
        />
      )}

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
