import React, { useState } from 'react';
import DailyArena from './components/DailyArena';
import OverviewStats from './components/OverviewStats';
import PlaybookTips from './components/PlaybookTips';
import { Flame, Sparkles, BarChart2, BookOpen, Home, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('arena');

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('playbook_player_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { streak: 1, avgScore: 88 };
  });

  const [sessionHistory, setSessionHistory] = useState([]);

  const handleRecordScore = (newScore) => {
    setSessionHistory(prev => [...prev, newScore]);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#F4EFE6] flex flex-col font-sans selection:bg-[#C5A880] selection:text-[#060913]">
      
      {/* TOP LIQUID GLASS NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#050811]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo (Clicks Home) */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('arena')}>
          <div className="w-8 h-8 rounded-lg bg-[#0E1629] border border-[#C5A880]/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Terminal className="w-4 h-4 text-[#C5A880]" />
          </div>
          <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#F4EFE6]">
            The Playbook<span className="text-[#C5A880]">.</span>
          </span>
        </div>

        {/* 3 Integrated Tabs with Glassmorphism */}
        <div className="flex items-center gap-1 bg-[#090D18]/90 border border-white/10 p-1 rounded-full text-xs shadow-inner">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 uppercase tracking-wider font-semibold cursor-pointer font-mono-code ${
              activeTab === 'arena' ? 'glass-button text-[#060913] shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Daily Run</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 uppercase tracking-wider font-semibold cursor-pointer font-mono-code ${
              activeTab === 'overview' ? 'glass-button text-[#060913] shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 uppercase tracking-wider font-semibold cursor-pointer font-mono-code ${
              activeTab === 'tips' ? 'glass-button text-[#060913] shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Improve Ideas</span>
          </button>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('arena')}
            className="p-2 rounded-xl bg-[#0E1629] border border-white/10 text-[#C5A880] hover:text-[#F4EFE6] transition-all cursor-pointer shadow-sm"
            title="Return to Home"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#0E1629] border border-white/10 text-[#C5A880] font-mono-code">
            <Flame className="w-3.5 h-3.5 fill-[#C5A880]" />
            <span>{stats.streak} Streak</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#0E1629] border border-[#C5A880]/30 flex items-center justify-center font-editorial text-sm font-semibold text-[#F4EFE6] shadow-sm">
            D
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col justify-start">
        {activeTab === 'arena' && (
          <DailyArena 
            onRecordScore={handleRecordScore}
            onSwitchTab={setActiveTab}
            onGoHome={() => setActiveTab('arena')}
            stats={stats}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewStats 
            stats={stats}
            sessionHistory={sessionHistory}
            onPlayNow={() => setActiveTab('arena')}
          />
        )}

        {activeTab === 'tips' && (
          <PlaybookTips 
            onPlayNow={() => setActiveTab('arena')}
          />
        )}
      </main>

      {/* LUXURY EDITORIAL FOOTER */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs tracking-wider uppercase font-mono-code text-[#8C857B]">
        <span>The Playbook • Institutional Strategy Terminal for Founders & Operators</span>
      </footer>

    </div>
  );
}
