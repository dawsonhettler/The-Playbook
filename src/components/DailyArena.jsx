import React, { useState, useEffect } from 'react';
import { evaluateStrategy } from '../utils/aiScorer';
import { getTodayKey, hasCompletedToday, getTodayResults, saveTodayResults, getTimeUntilMidnight, getPlaybookDayNumber, getPlayerRank, getLifetimeAverage } from '../utils/dailyManager';
import { Sparkles, ArrowRight, Clock, Award, CheckCircle2, AlertTriangle, Send, Eye, Edit3, StickyNote, Compass, Flame, CornerDownRight, Home, ChevronDown, ChevronUp, Bot, Share2, Lock } from 'lucide-react';
import { FICTIONAL_CASES } from '../data/fictionalCases';

export default function DailyArena({ onRecordScore, onSwitchTab, onGoHome, stats }) {
  const [dailyCases, setDailyCases] = useState(FICTIONAL_CASES);
  const [isLoadingCases, setIsLoadingCases] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const [isCompletedToday, setIsCompletedToday] = useState(hasCompletedToday());
  const [todayCompletedData, setTodayCompletedData] = useState(getTodayResults());
  const [timeUntilMidnight, setTimeUntilMidnight] = useState(getTimeUntilMidnight());
  const [phase, setPhase] = useState('WELCOME');
  const [readingTime, setReadingTime] = useState(25);
  const [typingTime, setTypingTime] = useState(30);
  const [scratchpadNotes, setScratchpadNotes] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [sessionScores, setSessionScores] = useState([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [expandedRound, setExpandedRound] = useState(null);

  const activeCase = dailyCases[caseIndex];

  useEffect(() => {
    const timer = setInterval(() => setTimeUntilMidnight(getTimeUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartSession = () => {
    setCaseIndex(0);
    setPhase('READING');
  };

  const handleRunEvaluation = async (text) => {
    setIsEvaluating(true);
    const result = await evaluateStrategy(text, activeCase);
    setEvaluationResult(result);
    setPhase('FEEDBACK');
    const newScore = { ...result, company: activeCase.company, caseNumber: activeCase.caseNumber, userStrategy: text };
    setSessionScores(prev => [...prev, newScore]);
    onRecordScore(newScore);
    setIsEvaluating(false);
    if (caseIndex === dailyCases.length - 1) {
      const avg = Math.round((sessionScores.reduce((a, b) => a + b.score, 0) + result.totalScore) / dailyCases.length);
      saveTodayResults({ avgScore: avg, scores: [...sessionScores, newScore] });
      setIsCompletedToday(true);
      setTodayCompletedData({ avgScore: avg, scores: [...sessionScores, newScore] });
    }
  };

  if (isCompletedToday) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-slow-glide">
        <div className="glass-panel rounded-3xl p-8 space-y-6 text-center">
          <h2 className="text-4xl font-editorial text-[#F4EFE6]">Daily Run Complete</h2>
          <p className="text-stone-400">Next session in: {timeUntilMidnight.hours}h {timeUntilMidnight.minutes}m</p>
          <button onClick={() => window.location.reload()} className="glass-button px-6 py-3 rounded-xl">Refresh Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-slow-glide">
      {phase === 'WELCOME' && (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-6">
          <h1 className="text-5xl font-editorial">Terminal Lobby</h1>
          <button onClick={handleStartSession} className="glass-button px-8 py-4 rounded-xl text-lg">Enter Daily Arena ↵</button>
        </div>
      )}

      {(phase === 'READING' || phase === 'TYPING') && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest text-[#C5A880]">Case {caseIndex + 1}/5 · {activeCase.company}</span>
            <span className="text-xl font-mono-code text-amber-400">{phase === 'READING' ? readingTime : typingTime}s</span>
          </div>
          <p className="text-xl text-stone-200">{activeCase.context}</p>
          {phase === 'TYPING' && (
            <textarea 
              className="w-full bg-black/40 p-4 rounded-xl border border-white/10"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Your tactical strategy..."
            />
          )}
          {phase === 'TYPING' && <button onClick={() => runEvaluation(userInput)} className="glass-button px-6 py-3 rounded-lg">Submit</button>}
        </div>
      )}

      {phase === 'FEEDBACK' && evaluationResult && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <h3 className="text-5xl font-editorial">{evaluationResult.totalScore} <span className="text-xl text-[#C5A880]">/ 100</span></h3>
          <p>{evaluationResult.strengthHighlight}</p>
          <button onClick={() => {
            if (!isLastCase) { setCaseIndex(i => i + 1); setPhase('READING'); }
            else setPhase('COMPLETE');
          }} className="glass-button px-6 py-3 rounded-lg">Next Case</button>
        </div>
      )}
    </div>
  );
}
