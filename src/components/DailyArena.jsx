import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Clock, Award, CheckCircle2, AlertTriangle, Send, Eye, Edit3, StickyNote, Compass, Flame, CornerDownRight, Home, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { getTodayKey, hasCompletedToday, getTodayResults, saveTodayResults, getTimeUntilMidnight, getPlaybookDayNumber, getPlayerRank, getLifetimeAverage } from '../utils/dailyManager';
import { evaluateStrategy } from '../utils/aiScorer';
import { FICTIONAL_CASES } from '../data/fictionalCases';

export default function DailyArena({ onRecordScore, onSwitchTab, onGoHome, stats }) {
  const [dailyCases, setDailyCases] = useState([]);
  const [caseIndex, setCaseIndex] = useState(0);
  const [phase, setPhase] = useState('WELCOME');
  const [readingTime, setReadingTime] = useState(25);
  const [typingTime, setTypingTime] = useState(30);
  const [userInput, setUserInput] = useState("");
  const [scratchpadNotes, setScratchpadNotes] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Load cases
  useEffect(() => {
    fetch(`/api/daily-cases?date=${getTodayKey()}`)
      .then(res => res.json())
      .then(setDailyCases)
      .catch(() => console.error("Failed to load cases"));
  }, []);

  const activeCase = dailyCases[caseIndex];

  // Timer logic
  useEffect(() => {
    let interval;
    if (phase === 'READING' && readingTime > 0) interval = setInterval(() => setReadingTime(t => t - 1), 1000);
    else if (phase === 'READING' && readingTime === 0) setPhase('TYPING');
    else if (phase === 'TYPING' && typingTime > 0 && !isEvaluating) interval = setInterval(() => setTypingTime(t => t - 1), 1000);
    else if (phase === 'TYPING' && typingTime === 0) runEvaluation(userInput);
    return () => clearInterval(interval);
  }, [phase, readingTime, typingTime, isEvaluating]);

  const runEvaluation = async (text) => {
    setIsEvaluating(true);
    const result = await evaluateStrategy(text, activeCase);
    setEvaluationResult(result);
    setPhase('FEEDBACK');
    setIsEvaluating(false);
  };

  if (!activeCase) return <div className="p-10 text-center">Loading Mission...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 font-sans text-[#F4EFE6]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onGoHome} className="text-xs uppercase tracking-widest text-[#C5A880] flex items-center gap-2">
          <Home className="w-4 h-4" /> Terminal Lobby
        </button>
        <span className="text-[10px] font-mono-code text-[#8C857B]">CASE {caseIndex + 1} OF 5</span>
      </div>

      {/* Main Container */}
      {phase === 'READING' && (
        <div className="glass-panel p-10 rounded-3xl animate-fade-in-up">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-editorial">{activeCase.company}</h1>
            <p className="text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto">{activeCase.context}</p>
            <div className="text-6xl font-mono-code text-amber-500">{readingTime}s</div>
          </div>
        </div>
      )}

      {phase === 'TYPING' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="glass-panel p-6 rounded-3xl">
            <p className="text-sm text-stone-300">{activeCase.context}</p>
            <div className="text-2xl font-mono-code mt-4 text-amber-400">{typingTime}s</div>
          </div>
          <textarea 
            className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-lg"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your strategic move here..."
          />
          <button onClick={() => runEvaluation(userInput)} className="glass-button w-full py-4 rounded-xl">Submit Strategy</button>
        </div>
      )}

      {phase === 'FEEDBACK' && evaluationResult && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 animate-fade-in-up">
           <h2 className="text-5xl font-editorial">{evaluationResult.totalScore} <span className="text-2xl text-[#C5A880]">/ 100</span></h2>
           <p className="text-lg text-stone-200">{evaluationResult.strengthHighlight}</p>
           <p className="text-amber-300 font-bold">{evaluationResult.blindSpot}</p>
           <button onClick={() => {
             if (!isLastCase) { setCaseIndex(i => i+1); setPhase('READING'); setReadingTime(25); setTypingTime(30); }
             else setPhase('COMPLETE');
           }} className="glass-button w-full py-4 rounded-xl">Next Case</button>
        </div>
      )}
    </div>
  );
}
