import React, { useState } from 'react';
import { ROOM_THEMES } from '../theme/roomThemes';
import { 
  Building2, 
  Smartphone, 
  FileText, 
  Coffee, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  Laptop
} from 'lucide-react';

export default function FirstPersonRoom() {
  const [activeTier, setActiveTier] = useState('tier1');
  const [activeModal, setActiveModal] = useState(null); // 'bill', 'phone', 'coffee', null
  const [activeTab, setActiveTab] = useState('decision'); // 'decision', 'financials', 'operator'

  const t = ROOM_THEMES[activeTier];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none flex flex-col font-modern">
      {/* ========================================================= */}
      {/* TOP CONTROLLER (Switcher to test visual evolution) */}
      {/* ========================================================= */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-stone-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono-code uppercase tracking-widest text-stone-300 font-semibold text-[11px]">
            POV Simulation: {t.name}
          </span>
        </div>

        {/* Tier Selector Buttons */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded">
          <button
            onClick={() => setActiveTier('tier1')}
            className={`px-3 py-1 rounded transition-all text-xs font-mono-code ${
              activeTier === 'tier1' ? 'bg-amber-500 text-black font-bold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            Tier 1: Trashy Studio
          </button>
          <button
            onClick={() => setActiveTier('tier2')}
            className={`px-3 py-1 rounded transition-all text-xs font-mono-code ${
              activeTier === 'tier2' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            Tier 2: Sunlit Loft
          </button>
          <button
            onClick={() => setActiveTier('tier3')}
            className={`px-3 py-1 rounded transition-all text-xs font-mono-code ${
              activeTier === 'tier3' ? 'bg-[#c5a880] text-black font-bold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            Tier 3: Luxury Penthouse
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* THE 1ST PERSON ROOM BACKGROUND (Wall, Window, Lighting) */}
      {/* ========================================================= */}
      <div className={`relative flex-1 ${t.wallStyle} ${t.wallAccent} transition-colors duration-700 flex flex-col items-center justify-start pt-14 px-4 overflow-hidden`}>
        {/* Ambient Room Lighting overlay */}
        <div className={`absolute inset-0 pointer-events-none ${t.ambientLighting} transition-all duration-700`}></div>

        {/* The Window View in Background */}
        <div className="w-full max-w-4xl h-24 mb-2 border border-black/40 rounded-t-lg overflow-hidden relative shadow-inner bg-stone-900/40">
          <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
            <span className="text-[11px] font-mono-code text-stone-400/90 tracking-wide">
              🪟 POV Window View: <span className="italic">{t.windowView}</span>
            </span>
          </div>
          {/* Window pane divider bars */}
          <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
            <div className="border-r border-black/50"></div>
            <div className="border-r border-black/50"></div>
            <div className="border-r border-black/50"></div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* THE DESK SURFACE (Physical Foreground) */}
        {/* ========================================================= */}
        <div className={`w-full max-w-6xl flex-1 bg-gradient-to-b ${t.deskStyle} rounded-t-3xl shadow-2xl relative px-6 pt-4 pb-2 transition-all duration-700 flex flex-col items-center justify-between`}>
          
          {/* ======================================================= */}
          {/* THE COMPUTER MONITOR ON THE DESK */}
          {/* ======================================================= */}
          <div className={`relative w-full max-w-3xl h-[68vh] sm:h-[70vh] ${t.monitorBezel} ${t.monitorGlow} flex flex-col overflow-hidden transition-all duration-700 z-10`}>
            
            {/* Monitor Webcam & Top Rim */}
            <div className="h-5 bg-black/70 flex items-center justify-between px-4 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
                <span className="w-2 h-2 rounded-full bg-green-500/80"></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-700"></span>
                <span className="text-[9px] font-mono-code uppercase text-stone-400">Founder OS • Level 01</span>
              </div>
              <div className="text-[10px] text-stone-400 font-mono-code">
                {activeTier === 'tier1' ? '⚡ 1:42 AM' : activeTier === 'tier2' ? '☀️ 2:15 PM' : '🍸 7:30 PM'}
              </div>
            </div>

            {/* Sticky Note Taped to Monitor Frame */}
            <div className={`absolute top-8 right-2 z-30 cursor-pointer ${t.stickyNote} transition-all hover:scale-105`} onClick={() => setActiveModal('bill')}>
              <div className="font-bold flex items-center justify-between mb-0.5">
                <span>MEMO</span>
                <span className="text-[9px] opacity-70">TAP</span>
              </div>
              <div>{t.stickyNoteText}</div>
            </div>

            {/* ===================================================== */}
            {/* INSIDE THE MONITOR: THE STARTUP GAME OPERATING SYSTEM */}
            {/* ===================================================== */}
            <div className={`flex-1 ${t.monitorScreenBg} flex flex-col text-stone-100 overflow-hidden`}>
              
              {/* Monitor Top Dashboard / Live Metrics Bar */}
              <div className="bg-black/40 border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono-code">Company</span>
                  <span className="font-bold tracking-tight text-white flex items-center gap-1 font-modern">
                    ☕ Kawa Subscriptions Inc.
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono-code">
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-stone-400 block">Bank Runway</span>
                    <span className={`font-bold ${t.statusTone}`}>
                      {activeTier === 'tier1' ? '$2,800 (1.4 mo)' : activeTier === 'tier2' ? '$68,450 (14 mo)' : '$1.42M (Profitable)'}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-stone-400 block">Active Subs</span>
                    <span className="font-bold text-white">
                      {activeTier === 'tier1' ? '68 users' : activeTier === 'tier2' ? '2,420 users' : '48,000 users'}
                    </span>
                  </div>
                </div>
              </div>

              {/* In-Monitor Tab Navigation */}
              <div className="flex border-b border-white/10 bg-black/20 text-xs font-mono-code">
                <button
                  onClick={() => setActiveTab('decision')}
                  className={`px-4 py-2 flex items-center gap-1.5 transition-all ${
                    activeTab === 'decision' 
                      ? 'border-b-2 border-amber-400 bg-white/5 text-white font-bold' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  Decision #1: Pricing
                </button>
                <button
                  onClick={() => setActiveTab('financials')}
                  className={`px-4 py-2 flex items-center gap-1.5 transition-all ${
                    activeTab === 'financials' 
                      ? 'border-b-2 border-amber-400 bg-white/5 text-white font-bold' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Live Unit Economics
                </button>
                <button
                  onClick={() => setActiveTab('operator')}
                  className={`px-4 py-2 flex items-center gap-1.5 transition-all ${
                    activeTab === 'operator' 
                      ? 'border-b-2 border-amber-400 bg-white/5 text-white font-bold' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Operator Drill (+50 XP)
                </button>
              </div>

              {/* Monitor Main Working Canvas */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
                
                {/* TAB 1: DECISION ROUND */}
                {activeTab === 'decision' && (
                  <div className="space-y-4 max-w-xl mx-auto">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ROUND 1 OF 8 • UNIT ECONOMICS
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-modern">
                        Choose your subscription monthly price point
                      </h2>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Roasted beans, custom packaging, and USPS ground postage cost you exactly <strong className="text-white">$8.20 per bag</strong>. If you underprice, you will bleed cash as you grow. If you overprice, early conversion drops.
                      </p>
                    </div>

                    {/* Decision Options */}
                    <div className="space-y-2 pt-1 font-modern">
                      <button 
                        onClick={() => setActiveModal('decisionA')}
                        className="w-full text-left p-3.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-amber-300 flex items-center gap-2">
                            <span>Option A: Mass Market ($16 / month)</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-red-900/60 text-red-200 rounded font-mono-code">Gross Margin: 48%</span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            High initial conversions, but you only pocket $7.80 per box. One paid ad click might wipe out your profit.
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                      </button>

                      <button 
                        onClick={() => setActiveModal('decisionB')}
                        className="w-full text-left p-3.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-300 flex items-center gap-2">
                            <span>Option B: Premium Curated ($26 / month)</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-900/60 text-emerald-200 rounded font-mono-code">Gross Margin: 68%</span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            You net $17.80 per box. Gives you margin to fund free shipping and influencer gift boxes.
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                      </button>
                    </div>

                    <div className="p-3 bg-white/5 rounded border border-white/5 text-[11px] text-stone-400 font-mono-code flex items-center justify-between">
                      <span>💡 <strong>Founder Tip:</strong> Never compete on price unless you own the factory.</span>
                    </div>
                  </div>
                )}

                {/* TAB 2: FINANCIAL STATEMENT BREAKDOWN */}
                {activeTab === 'financials' && (
                  <div className="space-y-3 max-w-xl mx-auto font-mono-code text-xs">
                    <h3 className="text-sm font-bold text-white border-b border-white/10 pb-1">
                      Kawa Subscriptions • Simplified P&L (Monthly)
                    </h3>
                    
                    <div className="space-y-1 text-stone-300">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>Gross Revenue (68 subs @ $26):</span>
                        <span className="text-emerald-400 font-bold">+$1,768.00</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>Cost of Goods Sold (COGS - $8.20/bag):</span>
                        <span className="text-red-400">-$557.60</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/10 font-bold text-white">
                        <span>Gross Profit:</span>
                        <span className="text-emerald-300">+$1,210.40 (68.4%)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5 text-stone-400">
                        <span>Shopify, Stripe Fees & Domain:</span>
                        <span className="text-red-400">-$189.00</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5 text-stone-400">
                        <span>Personal Living Stipend (Basement Rent & Food):</span>
                        <span className="text-red-400">-$1,400.00</span>
                      </div>
                      <div className="flex justify-between py-2 border-t-2 border-white/20 font-bold text-sm">
                        <span className="text-amber-300">Net Monthly Burn Rate:</span>
                        <span className="text-red-400">-$378.60 / mo</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-[11px] text-yellow-200">
                      ⚠️ <strong>Runway Warning:</strong> At this burn rate, with $2,800 left in the company bank account, you have approximately <strong>7.4 months</strong> to achieve break-even before bankruptcy.
                    </div>
                  </div>
                )}

                {/* TAB 3: OPERATOR DRILL */}
                {activeTab === 'operator' && (
                  <div className="space-y-3 max-w-xl mx-auto font-modern">
                    <div className="inline-flex items-center gap-1 text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      MICRO-PUZZLE #1 • UNIT ECONOMICS
                    </div>
                    <h3 className="text-base font-bold text-white">
                      The Break-Even Calculation
                    </h3>
                    <p className="text-xs text-stone-300">
                      If your fixed monthly overhead is <strong>$1,589</strong> and your Gross Profit is <strong>$17.80 per bag</strong>, how many active subscribers do you need to stop losing money?
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 font-mono-code text-xs">
                      <button 
                        onClick={() => alert("Correct! $1,589 / $17.80 = ~89.2 customers. Once you hit 90 subscribers, Kawa Subscriptions is cash-flow positive! +50 XP awarded.")}
                        className="p-3 bg-white/5 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500 rounded text-left transition-all"
                      >
                        <div className="font-bold text-white">A) 90 Subscribers</div>
                        <div className="text-[10px] text-stone-400">($1,589 ÷ $17.80 = 89.2)</div>
                      </button>

                      <button 
                        onClick={() => alert("Incorrect. Remember: Break-Even = Fixed Costs divided by Gross Profit per unit, NOT total revenue.")}
                        className="p-3 bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-500 rounded text-left transition-all"
                      >
                        <div className="font-bold text-white">B) 61 Subscribers</div>
                        <div className="text-[10px] text-stone-400">($1,589 ÷ $26.00)</div>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Monitor Stand */}
            <div className="h-2 bg-stone-900 border-t border-black/40"></div>
          </div>

          {/* ======================================================= */}
          {/* THE PHYSICAL PROPS ON THE DESK (Left & Right of Monitor) */}
          {/* ======================================================= */}
          <div className="w-full flex items-end justify-between px-2 sm:px-6 z-20 pb-1">
            
            {/* LEFT PROP: The Ramen or Fine Beverage */}
            <div 
              onClick={() => setActiveModal('coffee')}
              className="cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="text-4xl sm:text-5xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                  {activeTier === 'tier1' ? '🍜' : activeTier === 'tier2' ? '☕' : '🥂'}
                </div>
              </div>
              <div className="mt-1 px-2 py-0.5 bg-black/70 backdrop-blur rounded border border-white/10 text-[9px] font-mono-code text-stone-300 group-hover:text-amber-300">
                {t.ramenBadge}
              </div>
            </div>

            {/* CENTER: Keyboard & Mousepad on desk */}
            <div className="hidden md:flex flex-col items-center opacity-85">
              <div className="w-96 h-12 bg-black/60 rounded-md border border-white/5 shadow-2xl flex items-center justify-center p-1.5">
                <div className="w-full h-full bg-[#1e2022] rounded flex items-center justify-center text-[10px] font-mono-code text-stone-500 tracking-[0.3em] uppercase">
                  [ MECHANICAL KEYBOARD • SPACE TO THINK ]
                </div>
              </div>
            </div>

            {/* RIGHT PROP: The Cracked Phone / Unpaid Bill */}
            <div 
              onClick={() => setActiveModal('phone')}
              className="cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="text-4xl sm:text-5xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                  {activeTier === 'tier1' ? '📱' : activeTier === 'tier2' ? '📱' : '⌚'}
                </div>
                {/* Red notification dot */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce border-2 border-black"></span>
              </div>
              <div className="mt-1 px-2 py-0.5 bg-black/70 backdrop-blur rounded border border-white/10 text-[9px] font-mono-code text-stone-300 group-hover:text-amber-300">
                {activeTier === 'tier1' ? '💬 1 New DM' : '💬 Slack Alert'}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL POPUPS (When clicking physical desk props) */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#18181b] border border-stone-700 text-stone-100 p-6 rounded shadow-2xl space-y-4">
            {activeModal === 'bill' && (
              <>
                <div className="flex items-center gap-2 text-red-400 font-bold font-mono-code text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>OVERDUE NOTICE • UNIT 3B</span>
                </div>
                <div className="p-3 bg-red-950/30 border border-red-800/40 text-xs font-mono-code text-stone-300 space-y-1">
                  <p><strong>Tenant:</strong> Dawson</p>
                  <p><strong>Past Due Balance:</strong> $850.00 USD</p>
                  <p><strong>Notice:</strong> Failure to pay by Friday will result in lock change.</p>
                </div>
                <p className="text-xs text-stone-300">
                  This is why your startup must succeed. You cannot afford vanity metrics or break-even delays. Every dollar in CAC counts.
                </p>
              </>
            )}

            {activeModal === 'phone' && (
              <>
                <div className="flex items-center gap-2 text-stone-300 font-bold font-mono-code text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Incoming Message</span>
                </div>
                <div className="p-4 bg-black/40 rounded border border-white/10 text-xs font-modern space-y-2">
                  <p className="text-stone-400 text-[10px]">Today, 1:38 AM</p>
                  <p className="text-white italic">
                    "{t.phoneMessage}"
                  </p>
                </div>
              </>
            )}

            {activeModal === 'coffee' && (
              <>
                <div className="flex items-center gap-2 text-amber-300 font-bold font-mono-code text-sm">
                  <Coffee className="w-4 h-4" />
                  <span>Desk Fuel</span>
                </div>
                <p className="text-xs text-stone-300">
                  {t.ramenOrDrink}. When you hit Tier 2 and Tier 3, your living standards and daily ritual upgrade with your startup's cash reserves.
                </p>
              </>
            )}

            {activeModal === 'decisionA' && (
              <>
                <div className="text-sm font-bold text-amber-400 font-mono-code">
                  Consequence: You Picked $16/mo (Mass Market)
                </div>
                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded text-xs text-stone-300 space-y-2">
                  <p>
                    📉 <strong>The Margin Trap:</strong> At $16/mo, you make $7.80 gross profit per bag. When Meta ad costs hit $15 per customer acquisition (CAC), you lose $7.20 on the first month for every new customer!
                  </p>
                  <p className="text-amber-200">
                    <strong>Duolingo-style Lesson:</strong> Never price a physical goods subscription at thin gross margins unless you have millions in venture capital to subsidize CAC.
                  </p>
                </div>
              </>
            )}

            {activeModal === 'decisionB' && (
              <>
                <div className="text-sm font-bold text-emerald-400 font-mono-code">
                  Consequence: You Picked $26/mo (Premium Curated)
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded text-xs text-stone-300 space-y-2">
                  <p>
                    📈 <strong>Operator Victory:</strong> At $26/mo, your Gross Margin is 68.4% ($17.80 profit per unit). Even after paying $12 in marketing, you pocket $5.80 on day one, and recurring months are pure profit!
                  </p>
                  <p className="text-emerald-200">
                    <strong>Key Insight:</strong> High margins provide error tolerance. You can afford better packaging and word-of-mouth unboxing experiences.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-mono-code uppercase font-semibold transition-all"
            >
              Close & Return to Desk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
