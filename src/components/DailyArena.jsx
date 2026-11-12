import React, { useState, useEffect } from 'react';
import { FICTIONAL_CASES } from '../data/fictionalCases';
import { evaluateStrategy } from '../utils/aiScorer';
import { 
  Sparkles, ArrowRight, Clock, Award, CheckCircle2, AlertTriangle, Send, Eye, 
  Edit3, StickyNote, Compass, Flame, CornerDownRight, Home, ChevronDown, ChevronUp, Bot 
} from 'lucide-react';

export default function DailyArena({ onRecordScore, onSwitchTab, onGoHome, stats }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [phase, setPhase] = useState('WELCOME');
  const [readingTime, setReadingTime] = useState(25);
  const [typingTime, setTypingTime] = useState(30);
  const [scratchpadNotes, setScratchpadNotes] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [sessionScores, setSessionScores] = useState([]);

  const activeCase = FICTIONAL_CASES[caseIndex];

  // Timers
  useEffect(() => {
    if (phase === 'READING' && readingTime > 0) {
      const t = setInterval(() => setReadingTime(p => p - 1), 1000);
      return () => clearInterval(t);
    } else if (phase === 'READING' && readingTime === 0) setPhase('TYPING');
  }, [phase, readingTime]);

  useEffect(() => {
    if (phase === 'TYPING' && typingTime > 0 && !isEvaluating) {
      const t = setInterval(() => setTypingTime(p => p - 1), 1000);
      return () => clearInterval(t);
    }
  }, [phase, typingTime, isEvaluating]);

  const runEvaluation = async (text) => {
    setIsEvaluating(true);
    try {
      const result = await evaluateStrategy(text, activeCase);
      setEvaluationResult(result);
      setPhase('FEEDBACK');
      setSessionScores(prev => [...prev, { ...result, company: activeCase.company }]);
    } catch (err) {
      alert("Evaluation failed. Try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      {phase === 'WELCOME' && (
        <div className="text-center space-y-6 animate-in fade-in">
          <h1 className="text-4xl font-editorial">Ready to begin?</h1>
          <button onClick={() => { setPhase('READING'); setCaseIndex(0); }} className="glass-button px-8 py-3 rounded-xl">Enter Daily Arena</button>
        </div>
      )}

      {(phase === 'READING' || phase === 'TYPING') && activeCase && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 animate-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-editorial">{activeCase.company}</h2>
          <p className="text-sm text-stone-300">{activeCase.context}</p>
          
          {phase === 'READING' && (
             <div className="text-center text-4xl font-mono text-amber-500">{readingTime}s</div>
          )}

          {phase === 'TYPING' && (
             <form onSubmit={(e) => { e.preventDefault(); runEvaluation(userInput); }}>
                <textarea 
                  className="w-full bg-black/50 p-4 rounded-xl border border-white/10" 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)} 
                />
                <button type="submit" className="glass-button mt-4 px-6 py-2 rounded-lg">Submit Strategy</button>
             </form>
          )}
        </div>
      )}

      {phase === 'FEEDBACK' && evaluationResult && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 animate-in fade-in">
          <h3 className="text-4xl font-editorial">{evaluationResult.totalScore} / 100</h3>
          <p>{evaluationResult.strengthHighlight}</p>
          <p className="text-amber-400">{evaluationResult.blindSpot}</p>
          <button onClick={() => {
            if (caseIndex < FICTIONAL_CASES.length - 1) {
              setCaseIndex(i => i + 1);
              setPhase('READING');
              setReadingTime(25);
              setTypingTime(30);
            } else {
              setPhase('COMPLETE');
            }
          }} className="glass-button px-6 py-2 rounded-lg">Next Case</button>
        </div>
      )}
    </div>
  );
}
