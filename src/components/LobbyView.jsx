import React from 'react';
import { Flame, ArrowRight, Compass, ShieldCheck, Clock, Award, Terminal } from 'lucide-react';

export default function LobbyView({ onStartDaily, stats }) {
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center space-y-10 py-8 sm:py-16 px-4 select-none">
      
      {/* FLOATING AMBIENT CENTERPIECE (Deep Navy & Creme Atmosphere) */}
      <div className="relative w-full h-40 sm:h-48 flex items-center justify-center overflow-hidden">
        {/* Navy/Champagne ambient glow */}
        <div className="absolute w-80 h-80 bg-[#C5A880]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute w-[30rem] h-[30rem] bg-[#0E1B38]/60 rounded-full blur-[120px] pointer-events-none"></div>

        {/* High-Tech Founder Monolith Emblem */}
        <div className="relative z-10 flex flex-col items-center group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#EADDC6]/20 bg-gradient-to-b from-[#14203D] to-[#0A1128] backdrop-blur-md flex items-center justify-center shadow-[0_0_60px_rgba(14,27,56,0.8)] group-hover:scale-105 transition-transform duration-700">
            <Compass className="w-10 h-10 text-[#F4EFE6] stroke-[1.25]" />
          </div>
          <div className="mt-3 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111C35] border border-[#EADDC6]/20 text-[10px] font-mono tracking-widest text-[#EADDC6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse"></span>
            <span>BLOOMBERG RUNWAY ENGINE • ACTIVE</span>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD HERO CARD (Plain. Framing + Burberry Luxury) */}
      <div className="w-full bg-[#0D162B]/95 backdrop-blur-xl border border-[#EADDC6]/15 rounded-3xl p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.6)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: HERO HEADLINE & STATS */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#C5A880] flex items-center gap-2">
              <span className="text-[#F4EFE6] font-bold">CASE SESSION #26</span>
              <span>•</span>
              <span>{todayDate}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F4EFE6] leading-[1.08]">
              Think under pressure. Build the empire<span className="text-[#C5A880]">.</span>
            </h1>
          </div>

          <p className="text-[#C5BEB3] text-sm sm:text-base leading-relaxed font-sans max-w-lg">
            5 real founder bottlenecks a day. 60-second ticker per case. Type your strategic moves in plain English, let AI analyze your tactical instincts, and see how your score compares to others.
          </p>

          {/* BENCHMARK STATS */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-[#EADDC6]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#C5A880] fill-[#C5A880]" />
              <span className="font-bold text-[#F4EFE6] text-sm">{stats.streak}-day streak</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4EFE6]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4EFE6]"></span>
              <span className="w-2.5 h-2.5 rounded-full border border-stone-600"></span>
              <span className="w-2.5 h-2.5 rounded-full border border-stone-600"></span>
              <span className="w-2.5 h-2.5 rounded-full border border-stone-600"></span>
            </div>

            <div className="text-[#9E978C]">
              Avg Tactical IQ: <strong className="text-[#F4EFE6] font-mono">{stats.avgScore || 85} pts</strong>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TODAY'S RUN CARD */}
        <div className="lg:col-span-5 bg-[#090F1E] border border-[#EADDC6]/15 rounded-2xl p-6 sm:p-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>THE 60-SECOND TICKER RUN</span>
            </div>
            <div className="text-xs text-[#C5BEB3] font-sans leading-relaxed">
              5 high-stakes scenarios. 1 minute on the clock for each dilemma. Rapid-fire tactical conviction.
            </div>
          </div>

          {/* CREME HIGH-CONTRAST ACTION BUTTON */}
          <button
            onClick={onStartDaily}
            className="w-full py-4 px-6 bg-[#F4EFE6] hover:bg-[#EADDC6] active:scale-[0.98] text-[#0A1128] font-sans font-bold text-base rounded-xl flex items-center justify-between transition-all shadow-[0_4px_25px_rgba(244,239,230,0.15)] group"
          >
            <div className="text-left">
              <div className="text-sm font-semibold tracking-wide">Enter Arena ↵</div>
              <div className="text-[11px] font-normal opacity-75 font-mono">5 cases • 60s ticker each</div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="text-[11px] font-mono text-[#8C857B] flex items-center justify-between border-t border-[#EADDC6]/10 pt-4">
            <span>🎯 Daily Target: 85+ Tactical IQ</span>
            <span className="text-[#F4EFE6]">0 / 5</span>
          </div>
        </div>

      </div>

    </div>
  );
}
