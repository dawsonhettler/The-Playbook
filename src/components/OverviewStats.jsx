import React from 'react';
import { getSkillAverages, getWeakestSkill } from '../utils/dailyManager';
import { Award, Flame, TrendingUp, ShieldCheck, Zap, Share2, BookOpen } from 'lucide-react';

export default function OverviewStats({ stats, sessionHistory, onPlayNow, onSwitchTab }) {
  const skillAvgs = getSkillAverages();
  const { weakest, score: weakestScore } = getWeakestSkill();

  const skillLabels = {
    pricing: 'Pricing Strategy',
    positioning: 'Brand Positioning',
    hiring: 'Team & Hiring',
    cash_flow: 'Cash Flow & Runway',
    conflict: 'Conflict & PR',
    growth: 'Viral Growth & GTM',
    operations: 'Operations & Sales'
  };

  const handleShare = () => {
    const text = `THE PLAYBOOK 🏛️\nWeakest Skill to Drill: ${skillLabels[weakest] || weakest}\nStreak: ${stats.streak} Days 🔥\ntheplaybook.app`;
    navigator.clipboard.writeText(text);
    alert("Skill profile copied to clipboard!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fade-in-up font-sans">
      
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADDC6]/15 pb-4">
        <div>
          <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#C5A880]">Skill Competency Matrix</span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F4EFE6] mt-0.5">
            Founder Skill Profile & Radar
          </h2>
        </div>

        <button
          onClick={handleShare}
          className="self-start sm:self-auto px-4 py-2 rounded-xl glass-panel text-xs font-mono-code text-[#F4EFE6] hover:border-[#C5A880] transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[#C5A880] inline mr-1.5" />
          <span>Share Skill Profile</span>
        </button>
      </div>

      {/* WEAKEST SKILL CALLOUT */}
      <div className="p-6 bg-[#0D162B] border border-amber-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono-code uppercase tracking-widest text-amber-400 font-semibold">
            ⚡ Diagnostic Recommendation
          </span>
          <div className="font-editorial text-2xl text-[#F4EFE6]">
            Weakest skill: <strong className="text-amber-300 capitalize">{skillLabels[weakest] || weakest}</strong> ({weakestScore} pts avg)
          </div>
          <p className="text-xs text-[#C5BEB3]">
            Focus your next daily runs on mastering this concept in the Improve Ideas academy.
          </p>
        </div>
        <button
          onClick={() => onSwitchTab('tips')}
          className="px-6 py-3 rounded-xl glass-button text-xs uppercase font-mono-code tracking-wider shrink-0 cursor-pointer"
        >
          Drill Frameworks ➔
        </button>
      </div>

      {/* 7 SKILL COMPETENCY BREAKDOWN BARS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <h3 className="font-editorial text-2xl text-[#F4EFE6]">Per-Skill Mastery Breakdown</h3>
          <span className="text-xs font-mono-code text-[#C5A880]">7 Core Founder Pillars</span>
        </div>

        <div className="space-y-4 text-xs font-mono-code">
          {Object.entries(skillAvgs).map(([skillKey, score]) => (
            <div key={skillKey} className="space-y-1.5">
              <div className="flex justify-between text-[#F4EFE6]">
                <span className="font-medium">{skillLabels[skillKey] || skillKey}</span>
                <span className={score >= 85 ? 'text-emerald-400 font-bold' : score >= 70 ? 'text-[#C5A880] font-bold' : 'text-amber-400 font-bold'}>
                  {score} / 100 PTS
                </span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-1000 ${score >= 85 ? 'bg-emerald-400' : score >= 70 ? 'bg-[#C5A880]' : 'bg-amber-400'}`} 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
