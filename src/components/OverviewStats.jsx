import React from 'react';
import { Award, Flame, TrendingUp, ShieldCheck, Zap, Share2 } from 'lucide-react';

export default function OverviewStats({ stats, sessionHistory, onPlayNow }) {
  const avgTactical = sessionHistory.length > 0
    ? Math.round(sessionHistory.reduce((a, b) => a + b.score, 0) / sessionHistory.length)
    : stats.avgScore || 85;

  const handleShare = () => {
    const text = `PLAYBOOK ARENA #26 🏛️\nOperator Tactical IQ: ${avgTactical}/100\nGlobal Percentile: Top ${Math.max(3, 100 - avgTactical + 4)}%\nStreak: ${stats.streak} Days 🔥\n⚡ Play at: theplaybook.app`;
    navigator.clipboard.writeText(text);
    alert("Scorecard copied to clipboard! Share on X or LinkedIn.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADDC6]/15 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A880]">Analytics & Benchmarking</span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F4EFE6] mt-0.5">
            Your Founder Operator Profile
          </h2>
        </div>

        <button
          onClick={handleShare}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#111C35] hover:bg-[#182645] border border-[#EADDC6]/20 text-[#F4EFE6] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Share Profile</span>
        </button>
      </div>

      {/* 3 HIGH-LEVEL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#0D162B] border border-[#EADDC6]/15 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-[#8C857B]">Tactical Average</span>
          <div className="font-editorial text-4xl text-[#F4EFE6]">{avgTactical} / 100</div>
          <span className="text-xs text-[#C5A880] font-semibold">Across all sessions</span>
        </div>

        <div className="p-5 bg-[#0D162B] border border-[#EADDC6]/15 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-[#8C857B]">Global Percentile</span>
          <div className="font-editorial text-4xl text-[#C5A880]">Top {Math.max(3, 100 - avgTactical + 4)}%</div>
          <span className="text-xs text-[#8C857B]">vs. 8,400+ founder runs</span>
        </div>

        <div className="p-5 bg-[#0D162B] border border-[#EADDC6]/15 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-[#8C857B]">Daily Active Streak</span>
          <div className="font-editorial text-4xl text-[#F4EFE6] flex items-center gap-2">
            <span>{stats.streak} Days</span>
            <Flame className="w-6 h-6 text-[#C5A880] fill-[#C5A880]" />
          </div>
          <span className="text-xs text-[#8C857B]">Consistency multiplier active</span>
        </div>
      </div>

      {/* 4-AXIS PERFORMANCE BREAKDOWN */}
      <div className="bg-[#0D162B] border border-[#EADDC6]/15 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="border-b border-[#EADDC6]/10 pb-3">
          <span className="text-[10px] uppercase tracking-widest text-[#C5A880]">Skill Competency</span>
          <h3 className="font-editorial text-2xl text-[#F4EFE6] mt-0.5">Tactical Dimensions</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-[#F4EFE6] font-medium mb-1.5">
              <span>Wedge & Innovation (Finding clever, uncrowded angles)</span>
              <span className="text-[#C5A880] font-bold">88%</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#C5A880]" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#F4EFE6] font-medium mb-1.5">
              <span>Capital Preservation (Protecting runway / spending $0)</span>
              <span className="text-[#F4EFE6] font-bold">92%</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#F4EFE6]" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#F4EFE6] font-medium mb-1.5">
              <span>Speed to Validation (Execution in under 48 hours)</span>
              <span className="text-[#C5A880] font-bold">84%</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#C5A880]" style={{ width: '84%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#F4EFE6] font-medium mb-1.5">
              <span>Distribution Moat (Creating non-replicable community leverage)</span>
              <span className="text-[#F4EFE6] font-bold">78%</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#F4EFE6]" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCH CALLOUT */}
      <div className="p-6 bg-[#111C35] border border-[#EADDC6]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-editorial text-xl text-[#F4EFE6]">Ready to calibrate your instincts?</h4>
          <p className="text-xs text-[#C5BEB3] mt-0.5">Solve today's 5 cases with the 25s reading and 30s typing timers.</p>
        </div>
        <button
          onClick={onPlayNow}
          className="px-6 py-3 rounded-xl bg-[#F4EFE6] hover:bg-[#EADDC6] text-[#0A1128] font-bold text-xs uppercase tracking-wider transition-all"
        >
          Enter Daily Arena ➔
        </button>
      </div>

    </div>
  );
}
