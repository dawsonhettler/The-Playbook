import React, { useState, useEffect } from 'react';
import { evaluateStrategy } from '../utils/aiScorer';
import { getTodayKey, hasCompletedToday, getTodayResults, saveTodayResults, getTimeUntilMidnight, getPlaybookDayNumber, getPlayerRank, getLifetimeAverage } from '../utils/dailyManager';
import { Sparkles, ArrowRight, Clock, Award, CheckCircle2, AlertTriangle, Send, Eye, Edit3, StickyNote, Compass, Flame, Home, ChevronDown, ChevronUp, Bot, Share2 } from 'lucide-react';

export default function DailyArena({ onRecordScore, onSwitchTab, onGoHome, stats }) {
  const [dailyCases, setDailyCases] = useState([]);
  const [caseIndex, setCaseIndex] = useState(0);
  const [phase, setPhase] = useState('WELCOME');
  const [userInput, setUserInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [sessionScores, setSessionScores] = useState([]);
  const [isCompletedToday, setIsCompletedToday] = useState(hasCompletedToday());
  const [todayCompletedData, setTodayCompletedData] = useState(getTodayResults());

  // Load Cases
  useEffect(() => {
    fetch(`/api/daily-cases?date=${getTodayKey()}`)
      .then(res => res.json())
      .then(setDailyCases)
      .catch(console.error);
  }, []);

  const runEvaluation = async (text) => {
    setIsEvaluating(true);
    const result = await evaluateStrategy(text, dailyCases[caseIndex]);
    setEvaluationResult(result);
    setPhase('FEEDBACK');
    const newScore = { ...result, company: dailyCases[caseIndex].company, caseNumber: dailyCases[caseIndex].caseNumber, userStrategy: text };
    setSessionScores(prev => [...prev, newScore]);
    onRecordScore(newScore);
    setIsEvaluating(false);
    
    if (caseIndex === dailyCases.length - 1) {
      saveTodayResults({ avgScore: Math.round(newScore.totalScore), scores: [...sessionScores, newScore] });
      setIsCompletedToday(true);
      setTodayCompletedData({ avgScore: Math.round(newScore.totalScore), scores: [...sessionScores, newScore] });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 font-sans text-[#F4EFE6]">
      {phase === 'WELCOME' && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-6">
          <h1 className="font-editorial text-5xl">Executive War Room</h1>
          <button onClick={() => setPhase('READING')} className="glass-button px-8 py-4 rounded-xl text-lg">Enter Daily Arena ↵</button>
        </div>
      )}

      {(phase === 'READING' || phase === 'TYPING') && dailyCases[caseIndex] && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-editorial">{dailyCases[caseIndex].company}</h2>
          <p className="text-stone-300">{dailyCases[caseIndex].context}</p>
          {phase === 'TYPING' && (
            <textarea 
              className="w-full bg-black/40 p-4 rounded-xl border border-white/10" 
              onChange={(e) => setUserInput(e.target.value)} 
            />
          )}
          <button onClick={() => phase === 'READING' ? setPhase('TYPING') : runEvaluation(userInput)} className="glass-button px-6 py-3 rounded-lg">
            {phase === 'READING' ? 'Ready to Answer ➔' : 'Submit Strategy'}
          </button>
        </div>
      )}

      {phase === 'FEEDBACK' && evaluationResult && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
           <h2 className="text-5xl font-editorial">{evaluationResult.totalScore} / 100</h2>
           <p className="text-stone-200">{evaluationResult.strengthHighlight}</p>
           <button onClick={() => {
             if (caseIndex < dailyCases.length - 1) { setCaseIndex(i => i+1); setPhase('READING'); }
             else setPhase('COMPLETE');
           }} className="glass-button px-6 py-3 rounded-lg">Next Case</button>
        </div>
      )}
    </div>
  );
}
