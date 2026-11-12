import React, { useState } from 'react';
import { ArrowRight, Sparkles, Compass, Flame, Clock } from 'lucide-react';
import { FICTIONAL_CASES } from '../data/fictionalCases';

export default function DailyArena({ onStartDaily, stats }) {
  const [phase, setPhase] = useState('WELCOME');

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 font-sans text-[#F4EFE6] animate-in fade-in duration-500">
      {phase === 'WELCOME' && (
        <div className="space-y-8 flex flex-col items-center">
          {/* Compass Logo Visual */}
          <div className="relative flex flex-col items-center mt-10">
            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-[#0d162b] shadow-2xl">
              <Compass className="w-10 h-10 text-[#C5A880]" />
            </div>
            <div className="mt-4 px-4 py-1 rounded-full bg-[#0d162b] border border-white/10 text-[10px] uppercase tracking-widest text-[#C5A880]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2 animate-pulse"></span>
              BLOOMBERG RUNWAY ENGINE • ACTIVE
            </div>
          </div>

          {/* Main Hero Card */}
          <div className="w-full bg-[#0d162b] border border-white/10 rounded-3xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#8C857B]">Case Session #26 · Thursday, Nov 12</div>
                <h1 className="font-editorial text-5xl leading-[1.1] tracking-tight">Think under pressure. Build the empire.</h1>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                5 real founder bottlenecks a day. 60-second ticker per case. Type your strategic moves in plain English, let AI analyze your tactical instincts, and see how your score compares to others.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#C5A880]">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>1-day streak</span>
                <span className="text-stone-600">● ● ○ ○</span>
                <span className="text-stone-400">Avg Tactical IQ: 86 pts</span>
              </div>
            </div>

            <div className="bg-[#111c35] p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="text-[10px] uppercase tracking-widest text-[#C5A880] flex items-center gap-2">
                <Clock className="w-4 h-4" /> The 60-second ticker run
              </div>
              <p className="text-xs text-stone-300">5 high-stakes scenarios. 1 minute on the clock for each dilemma. Rapid-fire tactical conviction.</p>
              
              <button onClick={() => setPhase('PLAY')} className="w-full bg-[#F4EFE6] text-[#080D1A] py-4 rounded-xl flex items-center justify-between px-6 font-bold hover:opacity-90 transition-all group">
                <div className="text-left">
                  <div className="text-sm">Enter Arena ↵</div>
                  <div className="text-[10px] font-normal opacity-70">5 cases • 60s ticker each</div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex justify-between text-[10px] uppercase text-stone-500 pt-2 border-t border-white/5">
                <span>Daily Target: 85+ Tactical IQ</span>
                <span>0 / 5</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Play logic goes here when active */}
    </div>
  );
}
