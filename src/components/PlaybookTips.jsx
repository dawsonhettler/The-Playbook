import React from 'react';
import { PLAYBOOK_TIPS } from '../data/playbookTips';
import { BookOpen, Sparkles, ShieldCheck, Compass } from 'lucide-react';

export default function PlaybookTips({ onPlayNow }) {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="border-b border-[#EADDC6]/15 pb-4 space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-[#C5A880]">Tactical Knowledge Base</span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#F4EFE6]">
          How to Level Up Your Idea Development Skills
        </h2>
        <p className="text-xs sm:text-sm text-[#C5BEB3] max-w-xl">
          Top operators do not guess. They rely on four repeatable frameworks to solve founder bottlenecks under severe capital pressure.
        </p>
      </div>

      {/* THE 4 PLAYBOOK FRAMEWORK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLAYBOOK_TIPS.map((tip) => (
          <div key={tip.id} className="p-6 bg-[#0D162B] border border-[#EADDC6]/15 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded bg-black/40 border border-[#EADDC6]/15 text-[10px] uppercase tracking-wider text-[#C5A880]">
                {tip.tag}
              </span>
              <h3 className="font-editorial text-2xl text-[#F4EFE6] leading-tight">
                {tip.title}
              </h3>
              <p className="text-xs font-medium text-[#EADDC6] italic">
                "{tip.concept}"
              </p>
              <p className="text-xs text-[#C5BEB3] leading-relaxed pt-1">
                {tip.framework}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EADDC6]/10 text-xs text-[#8C857B]">
              <strong className="text-[#F4EFE6]">{tip.rule}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER CTA */}
      <div className="p-6 bg-[#0D162B] border border-[#EADDC6]/20 rounded-2xl text-center space-y-3">
        <h4 className="font-editorial text-2xl text-[#F4EFE6]">Apply These Frameworks Today</h4>
        <p className="text-xs text-[#C5BEB3] max-w-md mx-auto">
          Test these frameworks inside the Arena against today's 5 make-or-break cases.
        </p>
        <button
          onClick={onPlayNow}
          className="px-8 py-3 rounded-xl bg-[#F4EFE6] hover:bg-[#EADDC6] text-[#0A1128] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
        >
          Start Case 1 (25s Read) ➔
        </button>
      </div>

    </div>
  );
}
