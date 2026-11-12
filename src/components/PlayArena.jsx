import React, { useState, useEffect } from 'react';
import { FICTIONAL_CASES } from '../data/fictionalCases';
import { evaluateStrategy } from '../utils/aiScorer';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Award, 
  Share2, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Send,
  Zap,
  TrendingUp,
  BrainCircuit,
  Compass
} from 'lucide-react';

export default function PlayArena({ onFinishGame, onBackToLobby }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [sessionScores, setSessionScores] = useState([]);
  const [copiedShare, setCopiedShare] = useState(false);

  const activeCase = FICTIONAL_CASES[caseIndex];
  const isLastCase = caseIndex >= FICTIONAL_CASES.length - 1;
  const isFinished = evaluationResult && isLastCase && sessionScores.length === FICTIONAL_CASES.length;

  // Bloomberg Countdown Timer (60s tick)
  useEffect(() => {
    if (evaluationResult || isEvaluating || isFinished) return;

    if (timeLeft <= 0) {
      handleTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, evaluationResult, isEvaluating, isFinished]);

  const handleTimeExpired = () => {
    // If time expires, evaluate whatever the player typed
    runEvaluation(userInput || "Time expired before strategy could be submitted.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isEvaluating) return;
    runEvaluation(userInput);
  };

  const runEvaluation = (textToEvaluate) => {
    setIsEvaluating(true);

    setTimeout(() => {
      const result = evaluateStrategy(textToEvaluate, activeCase);
      setEvaluationResult(result);
      setSessionScores(prev => [...prev, {
        caseNumber: activeCase.caseNumber,
        company: activeCase.company,
        score: result.totalScore,
        axes: result.axes
      }]);
      setIsEvaluating(false);
    }, 1200);
  };

  const handleNextCase = () => {
    if (!isLastCase) {
      setCaseIndex(prev => prev + 1);
      setUserInput("");
      setEvaluationResult(null);
      setTimeLeft(60);
    }
  };

  // Metrics
  const totalScore = sessionScores.reduce((acc, curr) => acc + curr.score, 0);
  const avgScore = sessionScores.length > 0 ? Math.round(totalScore / sessionScores.length) : 0;

  const handleShare = () => {
    const text = `PLAYBOOK ARENA #26 🏛️\nDaily Founder IQ: ${avgScore}/100 (Top ${100 - avgScore + 4}%)\nCases Solved: 5/5 under 60s ticker\n⚡ Play at: theplaybook.app`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-6 font-sans select-none">
      
      {/* ========================================================= */}
      {/* BLOOMBERG TERMINAL TICKER BAR                             */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#C5BEB3] border-b border-[#EADDC6]/15 pb-3">
        
        <div className="flex items-center gap-2">
          <span className="text-[#C5A880] font-bold">CASE {caseIndex + 1} OF {FICTIONAL_CASES.length}</span>
          <span>•</span>
          <span className="text-[#F4EFE6] font-semibold">{activeCase.company}</span>
          <span className="text-[#8C857B]">({activeCase.sector})</span>
        </div>

        {/* 60-Second Bloomberg Clock Ticker */}
        {!evaluationResult && !isFinished && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded border font-mono font-bold tracking-widest text-xs transition-all ${
            timeLeft <= 15
              ? 'bg-red-950/60 border-red-500/80 text-red-300 animate-pulse'
              : 'bg-[#111C35] border-[#EADDC6]/20 text-[#F4EFE6]'
          }`}>
            <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft} TICK</span>
          </div>
        )}

        {/* Case Progression Dots */}
        <div className="flex items-center gap-1.5">
          {FICTIONAL_CASES.map((_, i) => (
            <span
              key={i}
              className={`w-5 h-1.5 rounded-full transition-all ${
                i < sessionScores.length
                  ? 'bg-[#F4EFE6]'
                  : i === caseIndex
                  ? 'bg-[#C5A880] animate-pulse'
                  : 'bg-stone-800'
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* THE DILEMMA CARD                                          */}
      {/* ========================================================= */}
      {!isFinished && (
        <section className="bg-[#0D162B] border border-[#EADDC6]/15 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#8C857B]">
            <span className="px-2.5 py-1 bg-black/40 rounded border border-[#EADDC6]/10 text-[#EADDC6]">
              Runway Status: <strong className="text-red-300">{activeCase.runwayRemaining}</strong>
            </span>
            <span>Target: <strong className="text-[#F4EFE6]">High-Leverage Founder Move</strong></span>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#F4EFE6] leading-snug">
              {activeCase.company}
            </h2>
            <p className="text-sm sm:text-base text-[#D4CBBF] leading-relaxed font-sans">
              {activeCase.context}
            </p>
          </div>

          {/* ======================================================= */}
          {/* USER TACTICAL INPUT CONSOLE                             */}
          {/* ======================================================= */}
          {!evaluationResult && (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#9E978C]">
                  <span className="flex items-center gap-1.5 text-[#F4EFE6]">
                    <BrainCircuit className="w-4 h-4 text-[#C5A880]" />
                    What is your tactical move? (Type in plain English)
                  </span>
                  <span>{userInput.length}/350 chars</span>
                </div>

                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  maxLength={350}
                  disabled={isEvaluating}
                  autoFocus
                  placeholder="e.g. Instead of paying the factory $68,000, I would hand-fill 100 sample vials and pre-sell them as a VIP beta..."
                  rows={4}
                  className="w-full bg-[#080D1A] border border-[#EADDC6]/20 focus:border-[#F4EFE6] rounded-xl p-4 text-sm sm:text-base text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none transition-all resize-none font-sans shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-[#8C857B] hidden sm:inline">
                  Press Enter or click Submit. Evaluates Innovation, Capital, Speed & Moat.
                </span>

                <button
                  type="submit"
                  disabled={userInput.trim().length < 5 || isEvaluating}
                  className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-2 transition-all shadow-md ${
                    userInput.trim().length >= 5 && !isEvaluating
                      ? 'bg-[#F4EFE6] hover:bg-[#EADDC6] text-[#0A1128] cursor-pointer'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-[#0A1128]" />
                      <span>Benchmarking Tactical Play...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Move ↵</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* DETAILED AI EVALUATION & COACHING REVEAL                */}
          {/* ======================================================= */}
          {evaluationResult && (
            <div className="space-y-6 pt-4 border-t border-[#EADDC6]/15 animate-in fade-in duration-300">
              
              {/* OVERALL SCORE & BENCHMARK BANNER */}
              <div className="bg-[#090F1E] border border-[#EADDC6]/15 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                    Tactical IQ Evaluation
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#F4EFE6] font-mono">
                      {evaluationResult.totalScore}
                    </span>
                    <span className="text-sm text-[#8C857B] font-mono">/ 100 PTS</span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-[#EADDC6]">
                  <div className="text-[#8C857B] text-[10px] uppercase">Leaderboard Benchmark</div>
                  <div className="text-[#F4EFE6] font-bold text-sm">
                    Top {100 - evaluationResult.percentile + 5}% of operators
                  </div>
                </div>
              </div>

              {/* 4-AXIS RUBRIC BREAKDOWN */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-3 bg-[#111C35] rounded border border-[#EADDC6]/10">
                  <div className="text-[10px] text-[#8C857B]">1. Wedge & Innovation</div>
                  <div className="text-base font-bold text-[#F4EFE6] mt-0.5">{evaluationResult.axes.wedge} / 25</div>
                </div>
                <div className="p-3 bg-[#111C35] rounded border border-[#EADDC6]/10">
                  <div className="text-[10px] text-[#8C857B]">2. Capital Efficiency</div>
                  <div className="text-base font-bold text-[#F4EFE6] mt-0.5">{evaluationResult.axes.capital} / 25</div>
                </div>
                <div className="p-3 bg-[#111C35] rounded border border-[#EADDC6]/10">
                  <div className="text-[10px] text-[#8C857B]">3. Speed to Data</div>
                  <div className="text-base font-bold text-[#F4EFE6] mt-0.5">{evaluationResult.axes.speed} / 25</div>
                </div>
                <div className="p-3 bg-[#111C35] rounded border border-[#EADDC6]/10">
                  <div className="text-[10px] text-[#8C857B]">4. Distribution Moat</div>
                  <div className="text-base font-bold text-[#F4EFE6] mt-0.5">{evaluationResult.axes.moat} / 25</div>
                </div>
              </div>

              {/* IDEA DEV COACHING: STRENGTH & BLIND SPOT */}
              <div className="space-y-3 font-sans">
                <div className="p-4 bg-[#111C35]/60 rounded-xl border border-[#EADDC6]/15 space-y-2">
                  <div className="text-xs font-mono text-[#C5A880] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#F4EFE6]" />
                    <span>Tactical Strength</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#D4CBBF] leading-relaxed">
                    {evaluationResult.strengthHighlight}
                  </p>
                </div>

                <div className="p-4 bg-[#141B2D]/60 rounded-xl border border-[#EADDC6]/15 space-y-2">
                  <div className="text-xs font-mono text-[#EADDC6] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-[#C5A880]" />
                    <span>Hidden Blind Spot / Execution Risk</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#D4CBBF] leading-relaxed">
                    {evaluationResult.blindSpot}
                  </p>
                </div>
              </div>

              {/* THE 100-POINT MASTERMIND MOVE */}
              <div className="space-y-2 bg-gradient-to-r from-[#142347] to-transparent border-l-2 border-[#C5A880] p-4 rounded-r-lg">
                <div className="text-xs font-mono text-[#F4EFE6] uppercase tracking-wider font-semibold">
                  The 100-Point Mastermind Play:
                </div>
                <p className="text-sm text-[#EADDC6] leading-relaxed font-sans">
                  {evaluationResult.benchmarkMove}
                </p>
              </div>

              {/* OPERATOR PLAYBOOK TAKEAWAY */}
              <div className="text-xs font-mono text-[#9E978C] bg-black/40 p-3.5 rounded border border-[#EADDC6]/10">
                💡 <strong className="text-[#F4EFE6]">Permanent Rule:</strong> {evaluationResult.operatorTakeaway}
              </div>

              {/* NEXT ACTION */}
              <button
                onClick={handleNextCase}
                className="w-full py-4 bg-[#F4EFE6] hover:bg-[#EADDC6] text-[#0A1128] font-bold text-xs font-mono uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-0.5"
              >
                <span>{isLastCase ? 'Finalize Daily Session Scorecard ➔' : 'Proceed to Next Case ➔'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </section>
      )}

      {/* ========================================================= */}
      {/* FINAL SCOREBOARD & PERCENTILE SUMMARY                     */}
      {/* ========================================================= */}
      {isFinished && (
        <section className="bg-[#0D162B] border border-[#EADDC6]/15 rounded-3xl p-6 sm:p-10 space-y-8 text-center shadow-2xl">
          
          <div className="inline-flex p-4 rounded-full bg-[#14203D] border border-[#EADDC6]/30 text-[#F4EFE6]">
            <Award className="w-10 h-10 text-[#C5A880]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#C5A880]">
              DAILY ARENA COMPLETED
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F4EFE6] tracking-tight">
              Tactical IQ Calibrated.
            </h2>
            <p className="text-sm text-[#C5BEB3]">
              You solved 5 critical founder bottlenecks under the 60-second ticker.
            </p>
          </div>

          {/* OVERALL PERCENTILE STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto font-mono text-left">
            <div className="p-4 bg-[#090F1E] rounded-xl border border-[#EADDC6]/15 space-y-1">
              <span className="text-[10px] text-[#8C857B] block uppercase">Composite Tactical IQ</span>
              <span className="text-3xl font-bold text-[#F4EFE6]">{avgScore} / 100</span>
            </div>

            <div className="p-4 bg-[#090F1E] rounded-xl border border-[#EADDC6]/15 space-y-1">
              <span className="text-[10px] text-[#8C857B] block uppercase">Global Percentile</span>
              <span className="text-3xl font-bold text-[#C5A880]">Top {Math.max(3, 100 - avgScore + 4)}%</span>
            </div>

            <div className="p-4 bg-[#090F1E] rounded-xl border border-[#EADDC6]/15 space-y-1">
              <span className="text-[10px] text-[#8C857B] block uppercase">Streak Kept</span>
              <span className="text-3xl font-bold text-[#F4EFE6]">1 Day 🔥</span>
            </div>
          </div>

          {/* CASE BY CASE TABLE */}
          <div className="max-w-xl mx-auto space-y-2 text-left font-mono text-xs">
            <div className="text-[11px] text-[#8C857B] uppercase tracking-wider pb-1">
              Session Breakdown:
            </div>
            {sessionScores.map((s, idx) => (
              <div key={idx} className="p-3 bg-[#090F1E] rounded-lg border border-[#EADDC6]/10 flex items-center justify-between">
                <div>
                  <span className="text-[#8C857B] mr-2">#{s.caseNumber}</span>
                  <span className="text-[#F4EFE6] font-bold">{s.company}</span>
                </div>
                <div className="font-bold text-[#C5A880]">{s.score} pts</div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="max-w-md mx-auto space-y-3 pt-2">
            <button
              onClick={handleShare}
              className="w-full py-4 bg-[#F4EFE6] hover:bg-[#EADDC6] text-[#0A1128] font-bold font-mono text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_25px_rgba(244,239,230,0.15)]"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? 'Copied to Clipboard! 🎉' : 'Share Score on X / LinkedIn'}</span>
            </button>

            <button
              onClick={onBackToLobby}
              className="w-full py-2.5 bg-transparent border border-[#EADDC6]/20 text-[#C5BEB3] hover:text-white rounded-xl font-mono text-xs uppercase transition-all"
            >
              Return to Lobby
            </button>
          </div>

        </section>
      )}

    </div>
  );
}
