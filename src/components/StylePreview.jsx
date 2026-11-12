import React, { useState } from 'react';
import { TIERS } from '../theme/themes';
import { TrendingUp, Award, DollarSign, ArrowRight, ShieldCheck, Zap, BookOpen, Compass } from 'lucide-react';

export default function StylePreview() {
  const [currentTierKey, setCurrentTierKey] = useState('tier1');
  const t = TIERS[currentTierKey];

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-500 pb-16 font-modern`}>
      {/* Tier Switcher Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10 px-4 py-3 text-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-stone-300">
              Visual Evolution Controller
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded">
            {Object.keys(TIERS).map((key) => {
              const tier = TIERS[key];
              const isActive = currentTierKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setCurrentTierKey(key)}
                  className={`px-3 py-1.5 text-xs transition-all ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {tier.name.split('—')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Lifestyle Status Bar (Micro-influencer stats) */}
        <section className={`${t.surface} ${t.border} p-5 transition-all duration-300`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className={t.badge}>Current Living Space</span>
              <h2 className={`${t.fontHeadline} text-xl sm:text-2xl ${t.textPrimary} mt-1.5`}>
                {t.subtitle}
              </h2>
              <p className={`${t.fontBody} ${t.textSecondary} mt-0.5`}>
                {t.location}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className={`block text-[10px] uppercase tracking-wider ${t.textMuted}`}>
                  Cash Reserves
                </span>
                <span className={`${t.fontHeadline} text-lg sm:text-xl ${t.textPrimary}`}>
                  {t.cashOnHand}
                </span>
              </div>
              <div className="w-px h-8 bg-current opacity-20"></div>
              <div className="text-right">
                <span className={`block text-[10px] uppercase tracking-wider ${t.textMuted}`}>
                  Status / Network
                </span>
                <span className={`${t.fontHeadline} text-lg sm:text-xl ${t.textPrimary} flex items-center justify-end gap-1`}>
                  <Award className="w-4 h-4 opacity-75" />
                  {t.reputationScore}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Scene with Editorial Caption */}
        <section className={`${t.surface} ${t.border} overflow-hidden`}>
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
            <img
              src={t.heroImage}
              alt="Apartment Interior"
              className="w-full h-full object-cover filter brightness-90 hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Visual Atmosphere
              </p>
              <p className="font-editorial italic text-base sm:text-lg text-white/95">
                "{t.lifestyleCaption}"
              </p>
            </div>
          </div>
        </section>

        {/* Interactive UI Gallery: Cards, Buttons, and Skill Drills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column A: Editorial Story Decision Card */}
          <section className={`${t.surface} ${t.border} p-6 flex flex-col justify-between space-y-6`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={t.badge}>Decision 01 • Pricing</span>
                <span className={`${t.fontBody} ${t.textMuted}`}>Milestone 1/8</span>
              </div>

              <h3 className={`${t.fontHeadline} text-2xl ${t.textPrimary}`}>
                Subscription Price Point
              </h3>

              <p className={`${t.fontBody} ${t.textSecondary} leading-relaxed`}>
                Your coffee beans cost $8.50 per bag to roast and ship. At $18/month, you generate modest volume but thin margins. Raising to $28/month risks churn unless perceived value is high.
              </p>
            </div>

            {/* Interactive Decision Options */}
            <div className="space-y-2 pt-2">
              <button className={`w-full text-left p-3.5 ${t.surfaceElevated} ${t.border} hover:opacity-80 transition-all flex items-center justify-between group`}>
                <div>
                  <div className={`text-xs font-semibold ${t.textPrimary}`}>
                    Option A: Bootstrap at $19/mo
                  </div>
                  <div className={`text-[11px] ${t.textMuted}`}>
                    Lower friction, gross margin 55%, longer runway needed.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className={`w-full text-left p-3.5 ${t.surfaceElevated} ${t.border} hover:opacity-80 transition-all flex items-center justify-between group`}>
                <div>
                  <div className={`text-xs font-semibold ${t.textPrimary}`}>
                    Option B: Premium at $29/mo
                  </div>
                  <div className={`text-[11px] ${t.textMuted}`}>
                    High margin 70%, funds paid ads immediately.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Action Buttons Showroom */}
            <div className="pt-3 flex items-center gap-3">
              <button className={t.buttonPrimary}>
                Confirm Thesis
              </button>
              <button className={t.buttonSecondary}>
                Inspect Model
              </button>
            </div>
          </section>

          {/* Column B: Financial Drill & Skill Tracker Preview */}
          <section className={`${t.surface} ${t.border} p-6 flex flex-col justify-between space-y-6`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={t.badge}>Executive Drill</span>
                <span className={`text-[11px] ${t.accentText} font-medium`}>+50 XP</span>
              </div>

              <h3 className={`${t.fontHeadline} text-2xl ${t.textPrimary}`}>
                The Burn Rate Check
              </h3>

              <p className={`${t.fontBody} ${t.textSecondary} leading-relaxed`}>
                Your monthly fixed overhead is $4,200. You earn $1,600 monthly gross profit. What is your Net Monthly Burn?
              </p>

              <div className={`${t.surfaceElevated} p-4 border border-current border-opacity-10 space-y-1`}>
                <div className="flex justify-between text-xs">
                  <span className={t.textSecondary}>Monthly Gross Profit:</span>
                  <span className={`${t.fontHeadline} ${t.textPrimary}`}>+$1,600</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={t.textSecondary}>Operating Expenses:</span>
                  <span className={`${t.fontHeadline} ${t.textPrimary}`}>-$4,200</span>
                </div>
                <div className="pt-2 border-t border-current border-opacity-10 flex justify-between text-xs font-semibold">
                  <span className={t.textPrimary}>Net Burn:</span>
                  <span className={`${t.accentText}`}>-$2,600 / mo</span>
                </div>
              </div>
            </div>

            {/* Skills Progress Bar Preview */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className={t.textSecondary}>Cash Management Mastery</span>
                <span className={`${t.fontHeadline} ${t.textPrimary}`}>Level 2 • 65%</span>
              </div>
              <div className="w-full h-1.5 bg-black/10 overflow-hidden rounded-full">
                <div className={`h-full ${t.accentBg} transition-all duration-500`} style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Micro-Influencer Operator Insight */}
            <div className={`p-3 ${t.surfaceElevated} ${t.borderThin} text-xs ${t.textSecondary} flex items-start gap-2`}>
              <ShieldCheck className={`w-4 h-4 ${t.accentText} shrink-0 mt-0.5`} />
              <span>
                <strong>Operator Rule:</strong> Always calculate runway from <em>Net Burn</em>, never gross expenses.
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
