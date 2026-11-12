import React, { useState, useEffect } from 'react';
import { evaluateStrategy } from '../utils/aiScorer';
import { 
  getTodayKey, 
  hasCompletedToday, 
  getTodayResults, 
  saveTodayResults, 
  getTimeUntilMidnight,
  getPlaybookDayNumber,
  getPlayerRank,
  getLifetimeAverage
} from '../utils/dailyManager';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Eye, 
  Edit3, 
  StickyNote, 
  Compass, 
  Flame, 
  CornerDownRight, 
  ShieldCheck,
  Bot,
  Share2,
  Lock,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function DailyArena({ onRecordScore, onSwitchTab, onGoHome, stats }) {
  const [dailyCases, setDailyCases] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [caseIndex, setCaseIndex] = useState(0);

  const [isCompletedToday, setIsCompletedToday] = useState(hasCompletedToday());
  const [todayCompletedData, setTodayCompletedData] = useState(getTodayResults());
  const [timeUntilMidnight, setTimeUntilMidnight] = useState(getTimeUntilMidnight());

  // Game Phases: 'WELCOME' | 'READING' | 'TYPING' | 'FEEDBACK' | 'COMPLETE'
  const [phase, setPhase] = useState('WELCOME');
  const [readingTime, setReadingTime] = useState(25);
  const [typingTime, setTypingTime] = useState(30);

  const [scratchpadNotes, setScratchpadNotes] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sessionScores, setSessionScores] = useState([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [expandedRound, setExpandedRound] = useState(null);

  const activeCase = dailyCases[caseIndex] || null;
  const isLastCase = caseIndex >= dailyCases.length - 1;

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  // Load Today's Unique Cases
  useEffect(() => {
    const todayKey = getTodayKey();
    const cachedKey = `playbook_daily_cases_${todayKey}`;
    const cached = localStorage.getItem(cachedKey);

    if (cached) {
      try {
        setDailyCases(JSON.parse(cached));
        setIsLoadingCases(false);
        return;
      } catch (e) {}
    }

    fetch(`/api/daily-cases?date=${todayKey}`)
      .then(res => res.json())
      .then(cases => {
        setDailyCases(cases);
        localStorage.setItem(cachedKey, JSON.stringify(cases));
        setIsLoadingCases(false);
      })
      .catch(() => setIsLoadingCases(false));
  }, []);

  // Midnight Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = getTimeUntilMidnight();
      setTimeUntilMidnight(nextTime);
      if (nextTime.hours === '00' && nextTime.minutes === '00' && nextTime.seconds === '00') {
        setIsCompletedToday(false);
        setTodayCompletedData(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reading Timer (25s)
  useEffect(() => {
    if (phase !== 'READING' || isCompletedToday) return;
    if (readingTime <= 0) {
      setPhase('TYPING');
      return;
    }
    const timer = setInterval(() => setReadingTime(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, readingTime, isCompletedToday]);

  // Typing Timer (30s)
  useEffect(() => {
    if (phase !== 'TYPING' || isEvaluating || isCompletedToday) return;
    if (typingTime <= 0) {
      handleForceSubmit();
      return;
    }
    const timer = setInterval(() => setTypingTime(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, typingTime, isEvaluating, isCompletedToday]);

  const handleStartSession = () => {
    if (isCompletedToday) return;
    setCaseIndex(0);
    setReadingTime(25);
    setTypingTime(30);
    setScratchpadNotes("");
    setUserInput("");
    setEvaluationResult(null);
    setErrorMessage(null);
    setSessionScores([]);
    setPhase('READING');
  };

  const handleForceSubmit = () => {
    runEvaluation(userInput || scratchpadNotes || "Time expired without strategy.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isEvaluating) return;
    runEvaluation(userInput);
  };

  const runEvaluation = async (text) => {
    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const result = await evaluateStrategy(text, activeCase);
      setEvaluationResult(result);
      setPhase('FEEDBACK');
      
      const newScoreObj = {
        caseNumber: activeCase.caseNumber,
        company: activeCase.company,
        score: result.totalScore,
        axes: result.axes,
        userStrategy: text,
        strength: result.strengthHighlight,
        blindSpot: result.blindSpot
      };

      const updatedScores = [...sessionScores, newScoreObj];
      setSessionScores(updatedScores);
      onRecordScore(newScoreObj);

      if (isLastCase) {
        const avg = Math.round(updatedScores.reduce((a, b) => a + b.score, 0) / updatedScores.length);
        const finalResults = {
          dateKey: getTodayKey(),
          avgScore: avg,
          scores: updatedScores
        };
        saveTodayResults(finalResults);
        setTodayCompletedData(finalResults);
        setIsCompletedToday(true);
      }
    } catch (err) {
      setErrorMessage(err.message || "Evaluation error.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextCase = () => {
    if (!isLastCase) {
      setCaseIndex(p => p + 1);
      setUserInput("");
      setScratchpadNotes("");
      setEvaluationResult(null);
      setErrorMessage(null);
      setReadingTime(25);
      setTypingTime(30);
      setPhase('READING');
    }
  };

  const handleShare = () => {
    const dayNum = getPlaybookDayNumber();
    const avg = todayCompletedData?.avgScore || 90;
    const squares = (todayCompletedData?.scores || []).map(s => {
      if (s.score >= 70) return '🟩';
      if (s.score >= 40) return '🟨';
      return '🟥';
    }).join('');

    const text = `The Playbook #${dayNum} · Tactical IQ ${avg} · ${squares} · 🔥 ${stats?.streak || 1} streak\ntheplaybook.app`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDevResetToday = () => {
    localStorage.removeItem(`playbook_session_${getTodayKey()}`);
    setIsCompletedToday(false);
    setTodayCompletedData(null);
    setPhase('WELCOME');
    setCaseIndex(0);
    setSessionScores([]);
  };

  const readingCircumference = 2 * Math.PI * 40;
  const readingProgress = (readingTime / 25) * readingCircumference;
  const typingCircumference = 2 * Math.PI * 34;
  const typingProgress = (typingTime / 30) * typingCircumference;

  // =======================================================================
  // LOCKED SCORECARD SCREEN (Krillion Share + Rank Progress + vs Average)
  // =======================================================================
  if (isCompletedToday && todayCompletedData) {
    const avg = todayCompletedData.avgScore;
    const percentileBeat = Math.max(3, 100 - avg + 4);
    const dayNum = getPlaybookDayNumber();
    const lifetimeAvg = getLifetimeAverage();
    const vsAvg = avg - lifetimeAvg;
    const playerRank = getPlayerRank(avg);

    const prevDayKey = Object.keys(localStorage).find(k => k.startsWith('playbook_session_') && k !== `playbook_session_${getTodayKey()}`);
    let yesterdayScore = lifetimeAvg;
    if (prevDayKey) {
      try { yesterdayScore = JSON.parse(localStorage.getItem(prevDayKey))?.avgScore || lifetimeAvg; } catch (e) {}
    }
    const diffScore = avg - yesterdayScore;

    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-8 animate-slow-glide font-sans">
        
        {/* Top Navigation Header */}
        <div className="flex items-center justify-between border-b border-[#EADDC6]/15 pb-4">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 text-xs uppercase font-mono-code tracking-widest text-[#C5A880] hover:text-[#F4EFE6] transition-all cursor-pointer font-semibold"
          >
            <Home className="w-4 h-4" />
            <span>Terminal Lobby</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs text-[#EADDC6] font-mono-code">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>DAY #{dayNum} · OFFICIAL SCORECARD LOCKED</span>
          </div>
        </div>

        {/* 1. TOP CENTER: NEXT CASE RELEASE CHRONOMETER */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3 text-center max-w-xl mx-auto shadow-2xl">
          <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#C5A880] flex items-center justify-center gap-1.5 font-semibold">
            <Clock className="w-4 h-4 text-[#C5A880]" />
            <span>Next Case Release</span>
          </div>
          <div className="font-editorial text-5xl sm:text-6xl font-bold tracking-tight text-[#F4EFE6] flex items-center justify-center gap-3 font-mono-code">
            <span>{timeUntilMidnight.hours}</span>
            <span className="text-[#C5A880] font-light">:</span>
            <span>{timeUntilMidnight.minutes}</span>
            <span className="text-[#C5A880] font-light">:</span>
            <span>{timeUntilMidnight.seconds}</span>
          </div>
          <p className="text-xs text-[#8C857B] font-mono-code">
            Midnight brings 5 brand new unique war-room cases.
          </p>
        </div>

        {/* 2. UNDERNEATH: MAIN SCORECARD & RANK PROGRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT HERO: TACTICAL IQ & KRILLION SHARE BUTTON (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#C5A880]">
                  THE PLAYBOOK #{dayNum} · SCORECARD
                </span>
                <div className="font-editorial text-6xl sm:text-7xl font-normal text-[#F4EFE6] mt-2 tracking-tight">
                  {avg} <span className="text-2xl font-sans font-light text-[#C5A880]">/ 100 PTS</span>
                </div>
                <p className="text-xs text-[#C5BEB3] font-mono-code mt-1">
                  Composite Tactical IQ · Top {percentileBeat}% Global Percentile
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono-code text-[#8C857B] block uppercase">Active Streak</span>
                <span className="text-lg font-bold text-amber-400 flex items-center gap-1 justify-end font-mono-code">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  {stats?.streak || 1} Days
                </span>
                {stats?.streakFreezes > 0 && (
                  <span className="text-[10px] font-mono-code text-blue-300 block">
                    🛡️ {stats.streakFreezes} Streak Freeze active
                  </span>
                )}
              </div>
            </div>

            {/* Rank Progress Bar */}
            <div className="p-4 bg-[#090F1E]/95 rounded-2xl border border-white/10 space-y-2 font-mono-code">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Rank: <strong className="text-[#F4EFE6]">{playerRank.title}</strong></span>
                <span className="text-[#C5A880]">{playerRank.progress}% to {playerRank.next || 'Max Rank'}</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-[#C5A880] to-[#F4EFE6] transition-all duration-1000" style={{ width: `${playerRank.progress}%` }}></div>
              </div>
            </div>

            {/* Krillion Style Wordle Share Button */}
            <button
              onClick={handleShare}
              className="w-full py-4 glass-button text-xs uppercase font-mono-code tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? 'Copied Playbook Share Grid! 🎉' : 'Share Result (Copy Wordle Grid)'}</span>
            </button>
          </div>

          {/* RIGHT COLUMN: VS AVERAGE & COMPARISON (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#C5A880]">
                Performance vs Lifetime Average
              </div>
              
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-xs text-[#8C857B] font-mono-code">Lifetime Avg</div>
                  <div className="font-editorial text-2xl text-stone-300">{lifetimeAvg} pts</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#C5A880] font-mono-code">+X vs Average</div>
                  <div className={`font-editorial text-3xl font-bold font-mono-code ${vsAvg >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {vsAvg >= 0 ? `+${vsAvg}` : vsAvg} pts
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs font-mono-code text-[#C5BEB3] border-t border-white/10 flex items-center justify-between">
                <span>vs Yesterday ({yesterdayScore} pts):</span>
                <strong className={diffScore >= 0 ? 'text-emerald-400 font-mono-code' : 'text-amber-400 font-mono-code'}>
                  {diffScore >= 0 ? `+${diffScore} pts` : `${diffScore} pts`}
                </strong>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 space-y-2 text-center">
              <div className="text-xs text-[#8C857B] font-mono-code uppercase">Operator Standing</div>
              <div className="font-editorial text-2xl text-[#F4EFE6]">Global Tier Active</div>
              <p className="text-xs text-[#C5BEB3]">Daily discipline compounds your tactical intuition.</p>
            </div>

          </div>

        </div>

        {/* 3. BOTTOM: ROUND BY ROUND BREAKDOWN */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-editorial text-2xl text-[#F4EFE6]">Round by Round Tactical Breakdown</h3>
            <span className="text-xs font-mono-code text-[#C5A880]">5 of 5 Cases Analyzed</span>
          </div>

          <div className="space-y-2.5">
            {todayCompletedData.scores.map((s, idx) => {
              const isExpanded = expandedRound === idx;
              return (
                <div key={idx} className="bg-[#090F1E]/90 border border-white/10 rounded-2xl overflow-hidden transition-all">
                  <div 
                    onClick={() => setExpandedRound(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-mono-code text-xs text-[#C5A880] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white font-editorial text-base">{s.company}</div>
                        <div className="text-xs text-stone-400 italic line-clamp-1 font-sans">"{s.userStrategy}"</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-mono-code font-bold px-2.5 py-1 rounded ${s.score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                        {s.score} / 100
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 text-xs font-sans animate-fade-in-up">
                      <div className="p-3 bg-white/5 rounded-xl space-y-1 border border-white/5">
                        <span className="text-[10px] font-mono-code uppercase text-[#C5A880] font-semibold">Your Executed Strategy:</span>
                        <p className="text-stone-200 italic">"{s.userStrategy}"</p>
                      </div>

                      <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono-code uppercase text-emerald-400 font-semibold">AI Tactical Analysis:</span>
                        <p className="text-stone-300">{s.strength}</p>
                      </div>

                      <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono-code uppercase text-amber-400 font-semibold">Operational Risk:</span>
                        <p className="text-stone-300">{s.blindSpot}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-right">
            <button 
              onClick={handleDevResetToday}
              className="text-[11px] font-mono-code text-stone-500 hover:text-stone-300 underline cursor-pointer"
            >
              [Dev Reset Lock for Testing]
            </button>
          </div>
        </div>

      </div>
    );
  }

  if (isLoadingCases || !activeCase) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center space-y-3 font-mono-code">
        <Sparkles className="w-8 h-8 text-[#C5A880] animate-spin mx-auto" />
        <h3 className="font-editorial text-2xl text-[#F4EFE6]">Synthesizing Terminal Cases...</h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 px-4 space-y-6">
      
      {/* 0. WELCOME LOBBY */}
      {phase === 'WELCOME' && (
        <div className="space-y-8 py-4 sm:py-8 animate-slow-glide">
          <div className="relative w-full h-36 flex items-center justify-center overflow-hidden">
            <div className="absolute w-72 h-72 bg-[#C5A880]/10 rounded-full blur-[90px] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[#EADDC6]/20 bg-gradient-to-b from-[#14203D] to-[#0A1128] flex items-center justify-center shadow-xl">
                <Compass className="w-8 h-8 text-[#F4EFE6] stroke-[1.25]" />
              </div>
              <div className="mt-2.5 flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-[10px] font-mono-code tracking-widest text-[#EADDC6]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DAILY TERMINAL ACTIVE · 1 RUN ALLOWED TODAY</span>
              </div>
            </div>
          </div>

          <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="text-[11px] font-mono-code tracking-[0.25em] uppercase text-[#C5A880] flex items-center gap-2 font-medium">
                  <span className="text-[#F4EFE6] font-bold">DAILY FLIGHT</span>
                  <span>•</span>
                  <span>{todayDateFormatted}</span>
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-[#F4EFE6] leading-[1.08]">
                  Get as close as you can<span className="text-[#C5A880]">.</span>
                </h1>
              </div>

              <p className="text-[#C5BEB3] text-sm leading-relaxed max-w-lg font-sans">
                5 targets a day. Type your strategic move under the 25s reading and 30s typing clock, and watch your operator score climb through the terminal.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#EADDC6] font-mono-code">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#C5A880] fill-[#C5A880]" />
                  <span className="font-bold text-[#F4EFE6]">{stats?.streak || 1}-day streak</span>
                </div>
                <div className="text-[#9E978C]">
                  Target Benchmark: <strong className="text-[#F4EFE6]">85+ Tactical IQ</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#090F1E]/90 border border-white/10 rounded-2xl p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-inner">
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono-code tracking-widest uppercase text-[#C5A880] flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>TODAY'S MISSION</span>
                </div>
                <div className="text-xs text-[#C5BEB3] font-sans">
                  • Climb to 400+ tactical score in a single session
                </div>
              </div>

              <button
                onClick={handleStartSession}
                className="w-full py-4 px-6 glass-button rounded-xl flex items-center justify-between cursor-pointer text-sm font-sans"
              >
                <div className="text-left">
                  <div className="font-semibold tracking-wide">Play Daily Run ↵</div>
                  <div className="text-[11px] font-normal opacity-75 font-mono-code">5 cases • about 3 min</div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] font-mono-code text-[#8C857B] flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[#F4EFE6]">Strict Once-a-Day Rule</span>
                <span className="text-emerald-400 font-semibold">Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAMEPLAY HEADER */}
      {phase !== 'WELCOME' && (
        <div className="flex items-center justify-between border-b border-[#EADDC6]/15 pb-3 text-xs tracking-wider uppercase text-[#C5BEB3] font-mono-code">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPhase('WELCOME')}
              className="flex items-center gap-1 text-[#C5A880] hover:text-[#F4EFE6] transition-all cursor-pointer font-semibold"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lobby</span>
            </button>
            <span>•</span>
            <span className="text-[#C5A880] font-semibold">CASE {caseIndex + 1} OF {dailyCases.length}</span>
            <span>•</span>
            <span className="text-[#F4EFE6] font-medium">{activeCase.company}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {dailyCases.map((_, idx) => (
              <span
                key={idx}
                className={`w-6 h-1 rounded-full transition-all duration-300 ${
                  idx < sessionScores.length
                    ? 'bg-[#F4EFE6]'
                    : idx === caseIndex
                    ? 'bg-[#C5A880]'
                    : 'bg-white/10'
                }`}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* 1. READING STAGE (25s) */}
      {phase === 'READING' && (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl animate-slow-glide relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs uppercase font-mono-code tracking-widest text-[#C5A880] font-semibold">
              <Eye className="w-4 h-4" />
              <span>STAGE 1: 25-SECOND ANALYSIS ROOM</span>
            </div>

            <button
              onClick={() => setPhase('TYPING')}
              className="px-5 py-2 rounded-xl border border-white/20 hover:border-[#F4EFE6] text-[#F4EFE6] text-xs font-mono-code uppercase tracking-wider transition-all flex items-center gap-1.5 hover:bg-white/5 cursor-pointer"
            >
              <span>Ready to Answer ➔</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-block px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono-code uppercase tracking-wider text-[#EADDC6]">
                Scenario: <strong className="text-red-300 ml-1">{activeCase.runwayRemaining}</strong>
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl text-[#F4EFE6] tracking-tight leading-snug">
                {activeCase.company}
              </h2>

              <p className="text-base sm:text-lg text-[#D4CBBF] font-light leading-relaxed font-sans">
                {activeCase.context}
              </p>

              <div className="pt-2 text-xs font-mono-code text-[#8C857B]">
                {readingTime <= 10 ? (
                  <span className="text-red-300 font-semibold animate-pulse">
                    ⚠️ 10 seconds left. Answer box will open automatically.
                  </span>
                ) : (
                  <span>Take 25 seconds to absorb constraints before committing to a strategy.</span>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center space-y-6">
              <div className="relative w-32 h-32 flex items-center justify-center select-none font-mono-code">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#16223F" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={readingTime <= 10 ? '#EF4444' : '#C5A880'}
                    strokeWidth="6"
                    strokeDasharray={readingCircumference}
                    strokeDashoffset={readingCircumference - readingProgress}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`font-editorial text-4xl sm:text-5xl font-bold tracking-tight transition-colors ${
                    readingTime <= 10 ? 'text-red-400 animate-pulse' : 'text-[#F4EFE6]'
                  }`}>
                    {readingTime}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#8C857B] -mt-1 font-mono-code">
                    SECONDS
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#FAF5EB] text-[#1E1915] p-4 rounded-xl shadow-xl border-t-4 border-[#C5A880] rotate-[-1deg] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-code font-semibold text-[#665D52] uppercase tracking-wider border-b border-[#E3D9C8] pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Founder Scratchpad</span>
                  </span>
                  <span className="text-[9px] text-[#8C827B]">Autosaved</span>
                </div>

                <textarea
                  value={scratchpadNotes}
                  onChange={(e) => setScratchpadNotes(e.target.value)}
                  placeholder="Jot gut thoughts while reading..."
                  rows={4}
                  className="w-full bg-transparent text-xs text-[#2B241C] placeholder-[#8C8275] focus:outline-none resize-none leading-relaxed font-sans"
                />

                <div className="text-[10px] text-[#8C8275] italic text-right font-mono-code">
                  Notes carry over to typing stage
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. TYPING STAGE (30s) */}
      {phase === 'TYPING' && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slow-glide">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#C5A880] font-semibold flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" />
                <span>STAGE 2: TACTICAL EXECUTION (30 SECONDS)</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#F4EFE6] mt-0.5">
                {activeCase.company}
              </h2>
            </div>

            <div className="flex items-center gap-3 bg-[#090F1E] border border-white/10 px-4 py-2 rounded-2xl shadow-inner font-mono-code">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" stroke="#16223F" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={typingTime <= 10 ? '#EF4444' : '#C5A880'}
                    strokeWidth="5"
                    strokeDasharray={typingCircumference}
                    strokeDashoffset={typingCircumference - typingProgress}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <span className={`absolute font-editorial text-lg font-bold ${
                  typingTime <= 10 ? 'text-red-400 animate-pulse' : 'text-[#F4EFE6]'
                }`}>
                  {typingTime}s
                </span>
              </div>
              <div className="text-left text-xs">
                <span className="text-[#8C857B] uppercase tracking-wider block text-[9px]">Runway Clock</span>
                <span className="text-[#F4EFE6] font-bold">
                  {typingTime <= 10 ? 'CRITICAL BURN' : 'TICKING DOWN'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#090F1E] border border-white/10 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-mono-code text-[#8C857B] uppercase tracking-wider">
              <span>The Dilemma</span>
              <span className="text-red-300 font-semibold">{activeCase.runwayRemaining}</span>
            </div>
            <p className="text-sm text-[#D4CBBF] leading-relaxed font-sans">
              {activeCase.context}
            </p>
          </div>

          {scratchpadNotes.trim() && (
            <div className="p-3 bg-[#FAF5EB]/10 border border-white/10 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
              <div className="flex items-center gap-2 text-[#EADDC6] truncate">
                <StickyNote className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span className="truncate italic">"{scratchpadNotes}"</span>
              </div>
              <button
                type="button"
                onClick={() => setUserInput(p => p ? `${p} ${scratchpadNotes}` : scratchpadNotes)}
                className="px-3 py-1 rounded bg-[#EADDC6]/20 hover:bg-[#EADDC6]/30 text-[#F4EFE6] text-[11px] font-semibold shrink-0 flex items-center gap-1 transition-all cursor-pointer font-mono-code"
              >
                <span>Insert Notes</span>
                <CornerDownRight className="w-3 h-3" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-code text-[#9E978C]">
                <span className="text-[#F4EFE6] font-medium">Type your tactical strategy:</span>
                <span>{userInput.length}/350 chars</span>
              </div>

              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                maxLength={350}
                disabled={isEvaluating}
                autoFocus
                placeholder="What would you do? Explain your instinct..."
                rows={4}
                className="w-full bg-[#050811] border border-white/15 focus:border-[#C5A880] rounded-xl p-4 text-sm sm:text-base text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none transition-all resize-none shadow-inner leading-relaxed font-sans"
              />
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-950/70 border border-red-500/80 rounded-xl text-xs text-red-200 font-mono-code">
                <strong>Backend Error:</strong> {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-xs text-[#8C857B] hidden sm:inline font-mono-code">
                Graded live by Margin institutional AI engine.
              </span>

              <button
                type="submit"
                disabled={userInput.trim().length < 2 || isEvaluating}
                className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                  userInput.trim().length >= 2 && !isEvaluating
                    ? 'glass-button cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span className="font-mono-code">Evaluating Strategy...</span>
                  </>
                ) : (
                  <>
                    <span className="font-mono-code">Submit Strategy ↵</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 3. AI EVALUATION REVEAL */}
      {phase === 'FEEDBACK' && evaluationResult && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slow-glide">
          <div className="bg-[#090F1E] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-inner">
            <div>
              <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#C5A880] flex items-center gap-1.5 font-semibold">
                <Bot className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Tactical IQ Score</span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-editorial text-4xl sm:text-5xl font-bold text-[#F4EFE6]">
                  {evaluationResult.totalScore}
                </span>
                <span className="text-xs tracking-wider text-[#8C857B] font-mono-code">/ 100 PTS</span>
              </div>
            </div>

            <div className="text-right text-xs font-mono-code">
              <div className="text-[#8C857B] text-[10px] uppercase tracking-wider">Benchmark</div>
              <div className="text-[#F4EFE6] font-semibold text-sm mt-0.5">
                Top {evaluationResult.percentile}% of operators
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-code">
            <div className="p-3 bg-[#111C35] rounded-xl border border-white/10">
              <div className="text-[10px] text-[#8C857B] uppercase tracking-wider">1. Wedge & Angle</div>
              <div className="text-sm font-bold text-[#F4EFE6] mt-1">{evaluationResult.axes.wedge} / 25</div>
            </div>
            <div className="p-3 bg-[#111C35] rounded-xl border border-white/10">
              <div className="text-[10px] text-[#8C857B] uppercase tracking-wider">2. Capital Preserved</div>
              <div className="text-sm font-bold text-[#F4EFE6] mt-1">{evaluationResult.axes.capital} / 25</div>
            </div>
            <div className="p-3 bg-[#111C35] rounded-xl border border-white/10">
              <div className="text-[10px] text-[#8C857B] uppercase tracking-wider">3. Execution Speed</div>
              <div className="text-sm font-bold text-[#F4EFE6] mt-1">{evaluationResult.axes.speed} / 25</div>
            </div>
            <div className="p-3 bg-[#111C35] rounded-xl border border-white/10">
              <div className="text-[10px] text-[#8C857B] uppercase tracking-wider">4. Moat / Leverage</div>
              <div className="text-sm font-bold text-[#F4EFE6] mt-1">{evaluationResult.axes.moat} / 25</div>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <div className="p-4 bg-[#111C35]/70 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#F4EFE6]" />
                <span>Tactical Analysis</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D4CBBF] leading-relaxed">
                {evaluationResult.strengthHighlight}
              </p>
            </div>

            <div className="p-4 bg-[#141B2D]/70 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#EADDC6] flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-[#C5A880]" />
                <span>Operational Risk</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D4CBBF] leading-relaxed">
                {evaluationResult.blindSpot}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#142347] to-transparent border-l-2 border-[#C5A880] p-4 rounded-r-xl space-y-1.5 font-sans">
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#F4EFE6] font-semibold">
              The Mastermind Operator Play:
            </div>
            <p className="text-sm text-[#EADDC6] leading-relaxed">
              {evaluationResult.benchmarkMove}
            </p>
          </div>

          <button
            onClick={handleNextCase}
            className="w-full py-4 glass-button text-xs font-mono-code uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLastCase ? 'Lock In Today’s Official Scorecard ➔' : 'Proceed to Next Case (25s Read) ➔'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

    </div>
  );
}
