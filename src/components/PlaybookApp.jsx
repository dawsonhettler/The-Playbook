import React, { useState, useEffect } from 'react';
import { PLAYBOOK_CASES } from '../data/playbookCases';
import { 
  Sparkles, 
  Flame, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Bookmark, 
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Info
} from 'lucide-react';

export default function PlaybookApp() {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Player Stats in LocalStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('playbook_stats_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { streak: 1, totalSolved: 0, correctCount: 0, completedCaseIds: [] };
  });

  useEffect(() => {
    localStorage.setItem('playbook_stats_v1', JSON.stringify(stats));
  }, [stats]);

  const activeCase = PLAYBOOK_CASES[currentCaseIndex];
  const isCorrect = selectedOption?.isFounderMove;

  const handleSelectOption = (opt) => {
    if (hasAnswered) return;
    setSelectedOption(opt);
    setHasAnswered(true);

    const isWin = opt.isFounderMove;
    const isFirstTime = !stats.completedCaseIds.includes(activeCase.id);

    if (isFirstTime) {
      setStats(prev => ({
        ...prev,
        totalSolved: prev.totalSolved + 1,
        correctCount: isWin ? prev.correctCount + 1 : prev.correctCount,
        streak: isWin ? prev.streak + 1 : prev.streak,
        completedCaseIds: [...prev.completedCaseIds, activeCase.id]
      }));
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex < PLAYBOOK_CASES.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setShowShareModal(true);
    }
  };

  const handleShare = () => {
    const text = `The Playbook Case #${activeCase.caseNumber} 🧠\n${activeCase.company} (${activeCase.year})\n${isCorrect ? '🟩 FOUNDER MOVE SPOTTED' : '🟧 CLOSE GUESS'}\nStreak: ${stats.streak} 🔥\nPlay at: theplaybook.app`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#E2D8C3] flex flex-col">
      
      {/* ========================================================= */}
      {/* 1. LUXURY EDITORIAL HEADER (Wordle / Krillion Style)      */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E7E2D8] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#141210]">
              The Playbook
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded border border-[#D5CDBD] text-[#736B5E] bg-[#F5EFE6]">
              DAILY CASE #{activeCase.caseNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-800 text-xs font-mono font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{stats.streak} Streak</span>
            </div>

            {/* Archive Library Toggle */}
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="p-1.5 rounded border border-[#D5CDBD] text-[#736B5E] hover:bg-[#EFE9DD] transition-all"
              title="All Cases"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. CASE ARCHIVE DRAWER (Play Any Case Anytime)           */}
      {/* ========================================================= */}
      {showArchive && (
        <div className="border-b border-[#E7E2D8] bg-[#F5EFE6] px-4 py-3 animate-in slide-in-from-top duration-200">
          <div className="max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#736B5E]">
              <span className="uppercase tracking-wider font-semibold">Founder Case Library</span>
              <button onClick={() => setShowArchive(false)} className="hover:text-black">Close ✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PLAYBOOK_CASES.map((c, idx) => {
                const isSolved = stats.completedCaseIds.includes(c.id);
                const isSelected = currentCaseIndex === idx;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCurrentCaseIndex(idx);
                      setSelectedOption(null);
                      setHasAnswered(false);
                      setShowArchive(false);
                    }}
                    className={`p-2 rounded text-left text-xs transition-all border ${
                      isSelected 
                        ? 'border-black bg-white font-bold shadow-sm' 
                        : 'border-[#D5CDBD] bg-white/60 hover:bg-white text-[#524B40]'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#8C827A]">#{c.caseNumber} {c.year}</div>
                    <div className="font-serif truncate">{c.company}</div>
                    {isSolved && <span className="text-[10px] text-emerald-700 font-mono">✓ Solved</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN PUZZLE CONTAINER                                 */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* CASE HERO CARD */}
        <section className="bg-white border border-[#E7E2D8] p-5 sm:p-6 rounded-none shadow-sm space-y-4">
          
          {/* Metadata pill bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EBE1] pb-3 text-xs font-mono text-[#8C827A]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#141210] uppercase tracking-wider">{activeCase.company}</span>
              <span>•</span>
              <span>{activeCase.year}</span>
              <span>•</span>
              <span className="text-[#655D52]">{activeCase.industry}</span>
            </div>
            <div className="px-2 py-0.5 bg-[#FAF7F2] rounded border border-[#E7E2D8] text-[11px]">
              Cash: <strong className="text-[#141210]">{activeCase.startingCapital}</strong>
            </div>
          </div>

          {/* Editorial Headline */}
          <div className="space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#141210] leading-snug">
              {activeCase.headline}
            </h1>
            <p className="text-xs text-[#8C827A] font-mono">
              Founder: <strong className="text-[#38332B]">{activeCase.founder}</strong>
            </p>
          </div>

          {/* The Dilemma / Bottleneck */}
          <div className="p-4 bg-[#FAF8F5] border-l-2 border-[#141210] text-sm text-[#4A443B] leading-relaxed">
            {activeCase.dilemma}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. THE 3 STRATEGIC CHOICES                                */}
        {/* ========================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C827A]">
            <span className="uppercase tracking-wider">What is your strategic move?</span>
            <span>Choose 1 of 3</span>
          </div>

          <div className="space-y-2.5">
            {activeCase.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              
              let cardStyle = "bg-white border-[#E7E2D8] hover:border-[#141210]";
              if (hasAnswered) {
                if (opt.isFounderMove) {
                  cardStyle = "bg-emerald-50/80 border-emerald-500 shadow-sm";
                } else if (isSelected && !opt.isFounderMove) {
                  cardStyle = "bg-amber-50/60 border-amber-500";
                } else {
                  cardStyle = "bg-white/50 border-[#E7E2D8] opacity-60";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 rounded-none border transition-all duration-200 flex items-start justify-between gap-3 group ${cardStyle}`}
                >
                  <div className="space-y-1">
                    <div className="font-serif text-base font-medium text-[#141210] flex items-center gap-2">
                      <span>{opt.title}</span>
                      {hasAnswered && opt.isFounderMove && (
                        <span className="text-[10px] font-mono uppercase bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                          The Real Move 🏆
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B6357] leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  {!hasAnswered && (
                    <ArrowRight className="w-4 h-4 text-[#A89F91] group-hover:text-[#141210] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. THE REVEAL & CASE DEBRIEF (Appears After Choice)       */}
        {/* ========================================================= */}
        {hasAnswered && (
          <section className="bg-white border border-[#E7E2D8] p-5 sm:p-6 rounded-none shadow-md space-y-5 animate-in fade-in duration-300">
            
            {/* Result Header Badge */}
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-mono font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>FOUNDER INSTINCT VERIFIED (+100 XP)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-800 font-mono font-bold text-sm">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span>PLAUSIBLE MOVE, BUT HERE'S WHAT ACTUALLY HAPPENED</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1 rounded border border-[#D5CDBD] hover:bg-[#F5EFE6] text-xs font-mono text-[#524B40] transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedText ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* What Actually Happened */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C827A]">
                The Untold History
              </span>
              <p className="text-sm text-[#2B2723] leading-relaxed font-sans">
                {activeCase.actualStory}
              </p>
            </div>

            {/* The Operator Tactic to Steal Today */}
            <div className="p-4 bg-[#F5EFE6] border-l-2 border-emerald-700 space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Operator Tactic to Steal Today</span>
              </div>
              <p className="text-xs text-[#4A443B] leading-relaxed">
                {activeCase.operatorTactic}
              </p>
            </div>

            {/* Founder Quote */}
            {activeCase.quote && (
              <p className="font-serif italic text-xs text-[#736B5E] border-t border-[#F0EBE1] pt-3">
                {activeCase.quote}
              </p>
            )}

            {/* Continue to Next Case Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleNextCase}
                className="flex-1 py-3 bg-[#141210] hover:bg-[#2B2723] text-white font-mono text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:translate-y-0.5"
              >
                <span>{currentCaseIndex < PLAYBOOK_CASES.length - 1 ? 'Next Case ➔' : 'Complete Daily Session'}</span>
              </button>
            </div>

          </section>
        )}

      </main>

      {/* ========================================================= */}
      {/* 6. SHARE & COMPLETION MODAL                               */}
      {/* ========================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-[#E7E2D8] p-6 rounded-none shadow-2xl space-y-5 text-center">
            
            <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A]">
                All Daily Cases Finished
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#141210]">
                Operator IQ Calibrated
              </h2>
              <p className="text-xs text-[#6B6357]">
                You reviewed 5 legendary founder make-or-break moves. Your tactical mental library is growing.
              </p>
            </div>

            {/* Stat Pill Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAF8F5] border border-[#E7E2D8] text-xs font-mono">
              <div>
                <span className="text-[9px] text-[#8C827A] block">Current Streak</span>
                <span className="text-amber-800 font-bold text-sm">{stats.streak} Days 🔥</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8C827A] block">Cases Solved</span>
                <span className="text-[#141210] font-bold text-sm">{stats.totalSolved}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8C827A] block">Founder Intuition</span>
                <span className="text-emerald-700 font-bold text-sm">
                  {stats.totalSolved > 0 ? Math.round((stats.correctCount / stats.totalSolved) * 100) : 100}%
                </span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="w-full py-3 bg-[#141210] hover:bg-[#2B2723] text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedText ? 'Copied to Clipboard! 🎉' : 'Share Score on X / LinkedIn'}</span>
            </button>

            <button
              onClick={() => {
                setShowShareModal(false);
                setCurrentCaseIndex(0);
                setSelectedOption(null);
                setHasAnswered(false);
              }}
              className="w-full py-2 border border-[#D5CDBD] text-xs font-mono uppercase text-[#736B5E] hover:bg-[#FAF8F5]"
            >
              Replay Cases
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#E7E2D8] py-4 px-4 text-center text-xs font-mono text-[#8C827A]">
        <span>The Playbook • A Daily Case Study for Founders & Builders</span>
      </footer>

    </div>
  );
}
