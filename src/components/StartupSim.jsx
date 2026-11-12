import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package, 
  Sparkles, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  ShieldAlert, 
  HelpCircle,
  Award
} from 'lucide-react';

export default function StartupSim({ onGameWon }) {
  // SIMULATION STATE
  const [month, setMonth] = useState(1);
  const [cash, setCash] = useState(2400);
  const [subscribers, setSubscribers] = useState(42);
  const [xp, setXp] = useState(0);
  const [history, setHistory] = useState([]);

  // FOUNDER BUILDER CONFIGURATION
  const [price, setPrice] = useState(24); // $16 - $36
  const [beanQuality, setBeanQuality] = useState('single'); // 'commercial', 'single', 'microlot'
  const [packaging, setPackaging] = useState('valve'); // 'paper', 'valve'
  const [adSpend, setAdSpend] = useState(300); // $0 - $1000

  // DEBRIEF / RESULT MODAL STATE
  const [monthResult, setMonthResult] = useState(null);

  // FIXED OVERHEAD (Basement rent + Shopify/Stripe software fees)
  const fixedOverhead = 1200;

  // BEAN COSTS
  const beanCosts = {
    commercial: { cost: 4.50, label: 'Standard Blend', qualityScore: 1 },
    single: { cost: 7.20, label: 'Single-Origin Ethiopian', qualityScore: 2 },
    microlot: { cost: 11.00, label: 'Rare Micro-Lot Geisha', qualityScore: 3 }
  };

  // PACKAGING COSTS
  const packagingCosts = {
    paper: { cost: 1.00, label: 'Basic Kraft Paper Bag (Goes stale in 10 days)', churnModifier: 0.08 },
    valve: { cost: 2.20, label: 'Foil Degassing Nitrogen Valve (Peak fresh 60 days)', churnModifier: -0.04 }
  };

  const shippingCost = 2.00; // Flat USPS Ground rate

  // REAL-TIME UNIT ECONOMICS CALCULATIONS
  const unitCost = beanCosts[beanQuality].cost + packagingCosts[packaging].cost + shippingCost;
  const unitProfit = price - unitCost;
  const grossMargin = ((unitProfit / price) * 100);
  const breakEvenSubscribers = unitProfit > 0 ? Math.ceil(fixedOverhead / unitProfit) : 9999;

  // RUN 30-DAY MONTH SIMULATION
  const handleRunMonth = () => {
    // 1. Calculate Acquisition (New subscribers gained)
    // Low price & high ad spend = more signups
    const priceAttractiveness = Math.max(0.6, (32 - price) / 10);
    const newFromAds = adSpend > 0 ? Math.floor((adSpend / 18) * priceAttractiveness) : 0;
    const organicWordOfMouth = Math.floor(subscribers * (beanCosts[beanQuality].qualityScore * 0.06));
    const totalNewSubs = Math.max(4, newFromAds + organicWordOfMouth);

    // 2. Calculate Churn (Lost subscribers)
    let churnPercent = 0.06 + packagingCosts[packaging].churnModifier;
    if (price > 30 && beanQuality === 'commercial') {
      churnPercent += 0.12; // Overpriced low quality triggers massive cancelations
    }
    churnPercent = Math.max(0.02, churnPercent);
    const churnedSubs = Math.min(subscribers, Math.round(subscribers * churnPercent));

    // 3. New Active Subscribers Count
    const finalSubs = Math.max(0, subscribers + totalNewSubs - churnedSubs);

    // 4. Financial Calculations
    const monthlyGrossRevenue = finalSubs * price;
    const monthlyCOGS = finalSubs * unitCost;
    const grossProfit = monthlyGrossRevenue - monthlyCOGS;
    const netCashFlow = grossProfit - fixedOverhead - adSpend;
    const newCash = cash + netCashFlow;

    // 5. XP & Learning Feedback Generation
    let feedback = {
      title: "",
      explanation: "",
      type: "neutral",
      customerReview: "",
      xpGain: 30
    };

    if (grossMargin < 45) {
      feedback = {
        title: "Thin Margins Drained Your Cash",
        explanation: `Your Gross Margin is only ${grossMargin.toFixed(1)}%. After paying $${unitCost.toFixed(2)} per bag in beans and postage, you made almost no profit to cover your $${adSpend} marketing and $${fixedOverhead} fixed expenses.`,
        type: "danger",
        customerReview: "⭐⭐⭐⭐ 'Cheap price, but company is probably running at a loss.'",
        xpGain: 15
      };
    } else if (packaging === 'paper' && finalSubs > 50) {
      feedback = {
        title: "Customer Churn Spike",
        explanation: `Kraft paper bags let air in! ${churnedSubs} subscribers canceled this month because beans arrived stale. Saving $1.20 on bags cost you recurring customers who were worth $${(price * 6).toFixed(0)} in annual value.`,
        type: "warning",
        customerReview: "⭐ 'Coffee arrived flat and tasted stale. Canceled my sub.'",
        xpGain: 25
      };
    } else if (netCashFlow > 0) {
      feedback = {
        title: "Profitable & Default Alive! 🚀",
        explanation: `With a ${grossMargin.toFixed(1)}% gross margin and low churn, your business generated +$${netCashFlow.toFixed(0)} in clean net profit this month. You are no longer burning through your savings.`,
        type: "success",
        customerReview: "⭐⭐⭐⭐⭐ 'The freshest single-origin beans in the city. The one-way valve bag kept it aromatic.'",
        xpGain: 75
      };
    } else {
      feedback = {
        title: "Solid Foundation, Still Burning Cash",
        explanation: `You gained +${totalNewSubs} subscribers, but at ${finalSubs} active members you are still below your break-even point (${breakEvenSubscribers} subscribers needed). Your bank balance shrank by -$${Math.abs(netCashFlow).toFixed(0)}.`,
        type: "neutral",
        customerReview: "⭐⭐⭐⭐ 'Great packaging and smooth brew. Subscribed!'",
        xpGain: 40
      };
    }

    // Apply updates
    setCash(newCash);
    setSubscribers(finalSubs);
    setXp(prev => prev + feedback.xpGain);
    setMonth(prev => prev + 1);

    setMonthResult({
      monthNumber: month,
      totalNewSubs,
      churnedSubs,
      finalSubs,
      monthlyGrossRevenue,
      netCashFlow,
      newCash,
      feedback
    });

    if (finalSubs >= 120 && netCashFlow > 0) {
      onGameWon && onGameWon();
    }
  };

  const handleRestart = () => {
    setMonth(1);
    setCash(2400);
    setSubscribers(42);
    setPrice(24);
    setBeanQuality('single');
    setPackaging('valve');
    setAdSpend(300);
    setMonthResult(null);
  };

  const isBankrupt = cash <= 0;
  const isWon = subscribers >= 120 && unitProfit > 0 && ((subscribers * unitProfit) - fixedOverhead - adSpend) > 0;

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0f1115] text-stone-100 font-sans select-none">
      
      {/* MACBOOK OS TOP APP BAR */}
      <header className="bg-black/60 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wide">☕ FounderOS: Kawa Coffee Studio</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
            Month {month}
          </span>
        </div>

        {/* METRICS HUD */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[9px] text-stone-400 block uppercase">Company Bank</span>
            <span className={`font-bold ${cash < 800 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              ${cash.toLocaleString()}
            </span>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="text-right">
            <span className="text-[9px] text-stone-400 block uppercase">Subscribers</span>
            <span className="font-bold text-white">
              {subscribers} / 120 Target
            </span>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="text-right">
            <span className="text-[9px] text-stone-400 block uppercase">Operator XP</span>
            <span className="font-bold text-amber-300 flex items-center gap-1 justify-end">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {xp} XP
            </span>
          </div>
        </div>
      </header>

      {/* MAIN STARTUP WORKBENCH */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4 pb-20">
        
        {/* LEFT COLUMN: THE OPERATIONAL BUILDER CONTROLS (7 Cols) */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3.5 space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-wider text-stone-400 flex items-center justify-between">
              <span>Step 1: Product & Pricing Strategy</span>
              <span className="text-emerald-400">Tactile Controls</span>
            </h3>

            {/* 1. Monthly Subscription Price Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">Monthly Retail Price:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">${price} / month</span>
              </div>
              <input
                type="range"
                min="16"
                max="36"
                step="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>$16 (Budget)</span>
                <span>$26 (Specialist)</span>
                <span>$36 (Luxury)</span>
              </div>
            </div>

            {/* 2. Bean Sourcing Picker */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs text-stone-300 block">Green Bean Sourcing:</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(beanCosts).map((key) => {
                  const b = beanCosts[key];
                  const isSelected = beanQuality === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setBeanQuality(key)}
                      className={`p-2 rounded border text-left text-xs transition-all ${
                        isSelected 
                          ? 'border-amber-400 bg-amber-500/10 text-white font-medium' 
                          : 'border-white/10 bg-black/20 text-stone-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-[11px] truncate">{b.label.split(' ')[0]}</div>
                      <div className="text-[10px] font-mono text-stone-400 mt-0.5">${b.cost.toFixed(2)}/bag</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Packaging & Degassing Valve Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs text-stone-300 block">Packaging Technology:</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(packagingCosts).map((key) => {
                  const p = packagingCosts[key];
                  const isSelected = packaging === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setPackaging(key)}
                      className={`p-2 rounded border text-left text-xs transition-all ${
                        isSelected 
                          ? 'border-emerald-400 bg-emerald-500/10 text-white font-medium' 
                          : 'border-white/10 bg-black/20 text-stone-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-[11px]">{key === 'paper' ? '📄 Kraft Paper Bag' : '✨ Nitrogen Valve Bag'}</div>
                      <div className="text-[10px] font-mono text-stone-400 mt-0.5">${p.cost.toFixed(2)}/unit</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Marketing & Ad Spend Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">Monthly Growth / Marketing Budget:</span>
                <span className="font-mono text-amber-300 font-bold">${adSpend} / mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>$0 (Pure Organic)</span>
                <span>$500 (Balanced)</span>
                <span>$1,000 (Aggressive)</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: LIVE UNIT ECONOMICS & RUN MONTH BUTTON (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3">
          
          {/* Live P&L Preview Board */}
          <div className="bg-stone-900/90 border border-white/10 rounded-lg p-3.5 space-y-2.5 font-mono text-xs">
            <h4 className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-white/10 pb-1 flex items-center justify-between">
              <span>Unit Economics Engine</span>
              <span className={grossMargin >= 60 ? 'text-emerald-400' : 'text-amber-400'}>
                {grossMargin.toFixed(1)}% Margin
              </span>
            </h4>

            <div className="space-y-1 text-stone-300 text-[11px]">
              <div className="flex justify-between">
                <span>Price per Bag:</span>
                <span className="text-white font-bold">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>- Coffee Beans:</span>
                <span>-${beanCosts[beanQuality].cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>- Packaging Bag:</span>
                <span>-${packagingCosts[packaging].cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>- USPS Shipping:</span>
                <span>-${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1 font-bold">
                <span>Gross Profit / Unit:</span>
                <span className={unitProfit > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  +${unitProfit.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-2 bg-black/40 rounded border border-white/5 space-y-1 text-[10px] text-stone-400">
              <div className="flex justify-between">
                <span>Fixed Monthly Overhead:</span>
                <span className="text-red-300">-$1,200.00</span>
              </div>
              <div className="flex justify-between font-bold text-stone-200">
                <span>Break-Even Subscribers Needed:</span>
                <span className="text-amber-400">{breakEvenSubscribers} subs</span>
              </div>
            </div>
          </div>

          {/* THE TACTILE RUN MONTH ACTION BUTTON */}
          <div className="space-y-2">
            {!isBankrupt && !isWon && (
              <button
                onClick={handleRunMonth}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Simulate Month {month} ➔</span>
              </button>
            )}

            {isBankrupt && (
              <div className="p-3 bg-red-950/80 border border-red-700 rounded-lg text-center space-y-2">
                <div className="text-xs font-bold text-red-300 flex items-center justify-center gap-1 font-mono">
                  <AlertTriangle className="w-4 h-4" />
                  BANKRUPTCY: RUNWAY DEPLETED
                </div>
                <p className="text-[11px] text-stone-300">
                  Your cash hit $0. You underpriced or overspent on ads before locking in unit economics.
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Rewind & Fix Your Model
                </button>
              </div>
            )}

            {isWon && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-lg text-center space-y-2">
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1 font-mono">
                  <Award className="w-4 h-4" />
                  LEVEL 1 COMPLETED!
                </div>
                <p className="text-[11px] text-stone-200">
                  You conquered 120+ subscribers and sustainable positive cash flow! Rent is paid and SoHo Loft unlocked.
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full py-2 bg-emerald-500 text-black rounded text-xs font-mono uppercase font-bold"
                >
                  Play Sandbox Again
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* DUOLINGO-STYLE MONTHLY DEBRIEF SLIDING DRAWER */}
      {/* ========================================================= */}
      {monthResult && (
        <div className="absolute inset-x-0 bottom-0 z-50 bg-[#16181d] border-t-2 border-stone-600 p-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                {monthResult.feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {monthResult.feedback.type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                {monthResult.feedback.type === 'warning' && <ShieldAlert className="w-5 h-5 text-amber-400" />}
                {monthResult.feedback.type === 'neutral' && <Sparkles className="w-5 h-5 text-blue-400" />}
                <span className="font-bold text-sm text-white font-mono">
                  Month {monthResult.monthNumber} Debrief: {monthResult.feedback.title}
                </span>
              </div>
              <span className="text-xs font-mono text-amber-300 font-bold">
                +{monthResult.feedback.xpGain} XP
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded border border-white/5">
              <div>
                <span className="text-[9px] text-stone-400 block">Growth</span>
                <span className="text-emerald-400 font-bold">+{monthResult.totalNewSubs} subs</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 block">Churn (Lost)</span>
                <span className="text-red-400 font-bold">-{monthResult.churnedSubs} subs</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 block">Net Cash Flow</span>
                <span className={`font-bold ${monthResult.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {monthResult.netCashFlow >= 0 ? `+$${monthResult.netCashFlow.toFixed(0)}` : `-$${Math.abs(monthResult.netCashFlow).toFixed(0)}`}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              {monthResult.feedback.explanation}
            </p>

            <div className="p-2 bg-white/5 rounded border border-white/5 text-[11px] text-stone-300 italic">
              {monthResult.feedback.customerReview}
            </div>

            <button
              onClick={() => setMonthResult(null)}
              className="w-full py-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-stone-200 transition-all"
            >
              Adjust Strategy For Next Month ➔
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
