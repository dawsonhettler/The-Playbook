import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function GameScreen({ 
  levelData, 
  gameState, 
  onDecisionMade, 
  onDrillAnswered, 
  onAdvanceRound, 
  onResetGame 
}) {
  const currentRound = levelData.rounds[gameState.currentRoundIndex];
  const [selectedOption, setSelectedOption] = useState(null);
  const [drillFeedback, setDrillFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('round'); // 'round', 'pnl'

  const isLevelComplete = gameState.currentRoundIndex >= levelData.rounds.length;

  // Real-time calculated metrics
  const netBurn = (gameState.subscribers * (gameState.pricePerUnit - gameState.cogsPerUnit)) - gameState.fixedCosts;
  const isProfitable = netBurn >= 0;
  const runwayMonths = isProfitable ? 'Infinite (Profitable)' : (gameState.cash / Math.abs(netBurn)).toFixed(1) + ' mo';

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0f1115] text-stone-100 overflow-hidden font-sans">
      
      {/* STARTUP LIVE HUD (Metrics bar) */}
      <header className="bg-black/50 border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-mono">Business</span>
          <span className="font-bold text-white flex items-center gap-1.5">
            ☕ {levelData.startupName}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[9px] uppercase text-stone-400 block">Company Bank</span>
            <span className={`font-bold ${gameState.cash < 1000 ? 'text-red-400' : 'text-emerald-400'}`}>
              ${gameState.cash.toLocaleString()}
            </span>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="text-right">
            <span className="text-[9px] uppercase text-stone-400 block">Subscribers</span>
            <span className="font-bold text-white">
              {gameState.subscribers} active
            </span>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="text-right">
            <span className="text-[9px] uppercase text-stone-400 block">Net Burn Rate</span>
            <span className={`font-bold ${isProfitable ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isProfitable ? `+$${netBurn.toFixed(0)}/mo` : `-$${Math.abs(netBurn).toFixed(0)}/mo`}
            </span>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="text-right">
            <span className="text-[9px] uppercase text-stone-400 block">Operator XP</span>
            <span className="font-bold text-amber-300 flex items-center gap-1 justify-end">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {gameState.xp} XP
            </span>
          </div>
        </div>
      </header>

      {/* SUB-NAV: Progress Tracker & Tabs */}
      <div className="px-4 py-1.5 bg-black/30 border-b border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
          <span>PROGRESS:</span>
          {levelData.rounds.map((r, i) => (
            <span
              key={r.id}
              className={`w-5 h-1.5 rounded-full transition-all ${
                i < gameState.currentRoundIndex
                  ? 'bg-emerald-400'
                  : i === gameState.currentRoundIndex
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-stone-700'
              }`}
            ></span>
          ))}
          <span className="ml-1 text-stone-300">
            {Math.min(gameState.currentRoundIndex + 1, levelData.rounds.length)} / {levelData.rounds.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('round')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
              activeTab === 'round' ? 'bg-white/10 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Terminal Action
          </button>
          <button
            onClick={() => setActiveTab('pnl')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
              activeTab === 'pnl' ? 'bg-white/10 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Inspect P&L Model
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN SCREEN CANVAS */}
      {/* ========================================================= */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 pb-28">

        {/* P&L SHEET VIEW (If active) */}
        {activeTab === 'pnl' && (
          <div className="max-w-xl mx-auto bg-stone-900/90 border border-white/10 p-4 rounded font-mono text-xs space-y-3">
            <h3 className="font-bold text-white border-b border-white/10 pb-1">
              Kawa Subscriptions • Live Financial Model
            </h3>
            <div className="space-y-1.5 text-stone-300">
              <div className="flex justify-between">
                <span>Active Subscribers:</span>
                <span className="text-white font-bold">{gameState.subscribers}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Price / Bag:</span>
                <span className="text-white font-bold">${gameState.pricePerUnit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost of Goods (Beans + Shipping):</span>
                <span className="text-red-400">-${gameState.cogsPerUnit.toFixed(2)} / bag</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1 font-bold">
                <span>Gross Margin / Unit:</span>
                <span className="text-emerald-400">
                  +${(gameState.pricePerUnit - gameState.cogsPerUnit).toFixed(2)} ({(((gameState.pricePerUnit - gameState.cogsPerUnit) / gameState.pricePerUnit) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Gross Profit:</span>
                <span className="text-emerald-300 font-bold">
                  +${(gameState.subscribers * (gameState.pricePerUnit - gameState.cogsPerUnit)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Fixed Overhead (Software, Living Stipend):</span>
                <span className="text-red-400">-${gameState.fixedCosts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-1.5 font-bold text-sm">
                <span>Net Cash Flow (Burn):</span>
                <span className={isProfitable ? 'text-emerald-400' : 'text-amber-400'}>
                  {isProfitable ? `+$${netBurn.toFixed(2)} / mo` : `-$${Math.abs(netBurn).toFixed(2)} / mo`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Estimated Runway:</span>
                <span className="text-white font-semibold">{runwayMonths}</span>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE ROUND CONTENT */}
        {activeTab === 'round' && !isLevelComplete && currentRound && (
          <div className="max-w-xl mx-auto space-y-4">
            
            {/* Header Badge & Category */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                ROUND {currentRound.roundNumber} OF {currentRound.totalRounds} • {currentRound.category}
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {currentRound.headline}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentRound.situation}
              </p>
            </div>

            {/* TYPE A: DECISION ROUND */}
            {currentRound.type === 'decision' && !selectedOption && (
              <div className="space-y-2 pt-1">
                {currentRound.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedOption(opt);
                      onDecisionMade(opt);
                    }}
                    className="w-full text-left p-3.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-amber-300">
                          {opt.label}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${opt.tagColor}`}>
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {opt.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            )}

            {/* TYPE B: PRACTICE DRILL ROUND */}
            {currentRound.type === 'drill' && !drillFeedback && (
              <div className="space-y-3 pt-1">
                {currentRound.hint && (
                  <div className="p-2 bg-blue-950/40 border border-blue-800/40 rounded text-[11px] text-blue-200 font-mono">
                    💡 <strong>Operator Formula:</strong> {currentRound.hint}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentRound.drillOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setDrillFeedback(opt);
                        onDrillAnswered(opt);
                      }}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 rounded text-left transition-all space-y-1 group"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 font-mono">
                        {opt.answer}
                      </div>
                      {opt.math && (
                        <div className="text-[10px] text-stone-400 font-mono">
                          {opt.math}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEVEL COMPLETE SCREEN */}
        {isLevelComplete && (
          <div className="max-w-lg mx-auto bg-stone-900/90 border border-emerald-500/40 p-6 rounded-lg text-center space-y-4 shadow-2xl">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                Milestone Reached • Level 01 Conquered
              </span>
              <h2 className="text-2xl font-bold text-white font-serif">
                Default Alive & Cash-Flow Positive
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                You took Kawa Subscriptions from a broke Queens basement idea into a living, breathing, profitable company generating over +$770/month in net cash flow. You paid off your past due rent.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-black/40 rounded border border-white/10 text-xs font-mono">
              <div>
                <span className="text-[9px] text-stone-400 block">Bank Balance</span>
                <span className="text-emerald-400 font-bold">${gameState.cash.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 block">Subscribers</span>
                <span className="text-white font-bold">{gameState.subscribers}</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 block">Total XP</span>
                <span className="text-amber-300 font-bold">{gameState.xp} XP</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded text-xs text-emerald-200 text-left space-y-1">
              <span className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Apartment Upgrade Unlocked!
              </span>
              <p className="text-[11px] text-stone-300">
                Your survival stipend has grown. You are signing the lease on a sunlit converted industrial loft in SoHo for Level 2.
              </p>
            </div>

            <button
              onClick={onResetGame}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay Level 1 Simulation
            </button>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* DUOLINGO-STYLE SLIDING CONSEQUENCE DRAWER (Bottom Bar) */}
      {/* ========================================================= */}
      {(selectedOption || drillFeedback) && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-stone-900 border-t-2 border-white/20 p-4 shadow-[0_-15px_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-200">
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="space-y-1">
              {/* Header result */}
              {selectedOption && (
                <div className="flex items-center gap-2">
                  {selectedOption.feedbackType === 'optimal' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      {selectedOption.feedbackTitle} (+{selectedOption.impact.xp} XP)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono">
                      <AlertTriangle className="w-4 h-4" />
                      {selectedOption.feedbackTitle} (+{selectedOption.impact.xp} XP)
                    </span>
                  )}
                </div>
              )}

              {drillFeedback && (
                <div className="flex items-center gap-2">
                  {drillFeedback.isCorrect ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      CORRECT! (+{drillFeedback.xpReward || 50} XP)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 font-mono">
                      <XCircle className="w-4 h-4" />
                      CONCEPT REVIEW
                    </span>
                  )}
                </div>
              )}

              {/* Consequence explanation text */}
              <p className="text-xs text-stone-200 leading-relaxed">
                {selectedOption ? selectedOption.feedbackExplanation : drillFeedback.feedback}
              </p>

              {selectedOption?.operatorTip && (
                <p className="text-[11px] text-amber-300 font-mono pt-0.5">
                  💡 {selectedOption.operatorTip}
                </p>
              )}
            </div>

            {/* CONTINUE BUTTON */}
            <button
              onClick={() => {
                setSelectedOption(null);
                setDrillFeedback(null);
                onAdvanceRound();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-md active:translate-y-0.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
