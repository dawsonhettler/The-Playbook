export const LEVEL_1_DATA = {
  startupName: "Kawa Subscriptions",
  tagline: "Single-origin craft coffee beans delivered bi-weekly",
  initialState: {
    cash: 2800,
    monthlyRevenue: 1768,
    cogsPerUnit: 8.20,
    fixedCosts: 1800,
    subscribers: 68,
    churnRate: 0.08,
    pricePerUnit: 26,
    xp: 0,
    currentRoundIndex: 0
  },
  rounds: [
    {
      id: "round_1",
      type: "decision",
      roundNumber: 1,
      totalRounds: 6,
      category: "PRICING STRATEGY",
      headline: "Lock In Your Subscription Price Point",
      situation: "Your roaster in Brooklyn charges $6.20/bag for beans. Custom foil packaging and USPS Ground Advantage cost $2.00. Total Cost of Goods Sold (COGS) is exactly $8.20 per bag delivered. How much do you charge subscribers per month?",
      options: [
        {
          id: "opt_a",
          label: "Option A: $16 / month (Budget Mass-Market)",
          tag: "Gross Margin: 48%",
          tagColor: "bg-red-500/20 text-red-300 border-red-500/30",
          description: "Undercuts retail coffee. High initial conversions, but you only pocket $7.80 per box.",
          impact: {
            cashChange: -400,
            subscribersChange: +45,
            pricePerUnit: 16,
            xp: 15
          },
          feedbackType: "flawed",
          feedbackTitle: "The Low-Margin Death Trap",
          feedbackExplanation: "At $16/mo, you earn only $7.80 gross profit. When your digital ads (CAC) cost $18 to acquire a subscriber, you lose over $10 on day one and take nearly 3 months just to break even on a single customer. If they cancel early, you go bankrupt.",
          operatorTip: "Rule: Physical consumer subscriptions generally need >65% gross margins to absorb shipping spikes and customer acquisition costs."
        },
        {
          id: "opt_b",
          label: "Option B: $26 / month (Curated Specialist)",
          tag: "Gross Margin: 68.5%",
          tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          description: "Position as a premium coffee ritual. Leaves $17.80 gross profit per bag to fund growth.",
          impact: {
            cashChange: +650,
            subscribersChange: +38,
            pricePerUnit: 26,
            xp: 50
          },
          feedbackType: "optimal",
          feedbackTitle: "Excellent Unit Economics",
          feedbackExplanation: "You net $17.80 per bag. That 68.5% margin gives you enough room to pay $14 for marketing and still pocket immediate cash on month one. Premium pricing also signals higher bean quality to coffee enthusiasts.",
          operatorTip: "High gross margins are your shock absorber—they protect you when supply chain prices fluctuate."
        },
        {
          id: "opt_c",
          label: "Option C: $42 / month (Ultra-Luxury Reserve)",
          tag: "Gross Margin: 80.4%",
          tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          description: "Extreme luxury positioning with gold foil packaging and exclusive micro-lot coffees.",
          impact: {
            cashChange: -200,
            subscribersChange: +6,
            pricePerUnit: 42,
            xp: 25
          },
          feedbackType: "flawed",
          feedbackTitle: "Brand Equity Mismatch",
          feedbackExplanation: "At $42/mo, your conversion rate plummets. Cold customers will not risk $42 on an unknown basement startup with no brand prestige or press coverage. You only gained 6 subscribers this month.",
          operatorTip: "You cannot charge luxury prices without luxury brand authority. Build trust first."
        }
      ]
    },
    {
      id: "round_2",
      type: "drill",
      roundNumber: 2,
      totalRounds: 6,
      category: "PRACTICE DRILL • BREAK-EVEN MATH",
      headline: "Calculate Your Cash-Flow Break-Even",
      situation: "Your fixed monthly overhead (website hosting, basic accounting software, kitchen license, and personal survival stipend) totals $1,780/month. You decided to charge $26/bag with $8.20 COGS (Gross Profit = $17.80/bag). How many active subscribers do you need to reach Break-Even?",
      hint: "Formula: Fixed Overhead ÷ Gross Profit per Unit = Break-Even Volume",
      drillOptions: [
        {
          id: "d_opt_1",
          answer: "68 Subscribers",
          math: "$1,780 ÷ $26.00 = 68.4",
          isCorrect: false,
          feedback: "Incorrect. You divided fixed costs by Revenue instead of Gross Profit! Revenue is not cash in your pocket—$8.20 of every bag goes straight to beans and postage."
        },
        {
          id: "d_opt_2",
          answer: "100 Subscribers",
          math: "$1,780 ÷ $17.80 = 100",
          isCorrect: true,
          feedback: "Spot on! $1,780 fixed costs ÷ $17.80 contribution margin = exactly 100 subscribers. At 100 active customers, your burn rate drops to $0 and your company stops dying.",
          xpReward: 60
        },
        {
          id: "d_opt_3",
          answer: "217 Subscribers",
          math: "$1,780 ÷ $8.20 = 217",
          isCorrect: false,
          feedback: "Incorrect. You divided fixed overhead by the Cost of Goods Sold ($8.20) instead of your unit margin."
        }
      ]
    },
    {
      id: "round_3",
      type: "decision",
      roundNumber: 3,
      totalRounds: 6,
      category: "GROWTH & ACQUISITION",
      headline: "Acquiring Your Next 100 Customers",
      situation: "You have 106 subscribers. You are near break-even, but your personal checking account is dangerously thin and rent is due in 3 weeks. How do you acquire the next wave of subscribers?",
      options: [
        {
          id: "opt_3a",
          label: "Option A: Spend $1,500 on Instagram Ads",
          tag: "High Capital Risk",
          tagColor: "bg-red-500/20 text-red-300 border-red-500/30",
          description: "Target coffee lovers on Instagram and TikTok using sleek carousel videos.",
          impact: {
            cashChange: -1500,
            subscribersChange: +52,
            xp: 20
          },
          feedbackType: "flawed",
          feedbackTitle: "Ad Burn Without Creative Testing",
          feedbackExplanation: "You spent over half your remaining cash ($1,500). While you gained 52 subscribers (CAC = $28.84), your cash reserve is now down to $1,400. One bad week puts you on the street.",
          operatorTip: "Never pour paid ad fuel on a business until organic retention and referral loops are proven."
        },
        {
          id: "opt_3b",
          label: "Option B: Barter Boxes to 40 Micro-Foodies",
          tag: "High Leverage / Low Cash",
          tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          description: "Ship 40 free sample boxes ($8.20 cost each = $328 total) with handwritten notes to food creators with 2k–15k followers.",
          impact: {
            cashChange: -328,
            subscribersChange: +74,
            xp: 55
          },
          feedbackType: "optimal",
          feedbackTitle: "Exceptional Return on Capital",
          feedbackExplanation: "18 micro-influencers posted honest morning taste-tests. For just $328 in inventory cost, you gained 74 high-intent subscribers (Blended CAC = $4.43!). Your bank balance remains safe.",
          operatorTip: "Early-stage founders must trade sweat, storytelling, and free product before spending venture-scale ad dollars."
        },
        {
          id: "opt_3c",
          label: "Option C: Offer a 'First Month $1' Discount",
          tag: "Vanity Metric Trap",
          tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          description: "Give away the first bag for $1 to trigger viral signups.",
          impact: {
            cashChange: -840,
            subscribersChange: +120,
            churnRateIncrease: 0.22,
            xp: 15
          },
          feedbackType: "flawed",
          feedbackTitle: "The Serial Churn Disaster",
          feedbackExplanation: "You gained 120 signups, but 70% canceled the moment their card was charged full price for month two. You lost $7.20 on each box shipped. You burned $840 subsidizing bargain hunters who hate your brand.",
          operatorTip: "Discounting attracts price-sensitive churners. Charge full value to attract real brand advocates."
        }
      ]
    },
    {
      id: "round_4",
      type: "drill",
      roundNumber: 4,
      totalRounds: 6,
      category: "PRACTICE DRILL • SPOT THE RED FLAG",
      headline: "Audit This Startup's Monthly Financial Statement",
      situation: "An angel investor sends you this confidential P&L from another subscription competitor and asks for your opinion. Tap the line item that indicates this company is secretly bleeding to death.",
      drillOptions: [
        {
          id: "rf_1",
          answer: "Monthly Gross Revenue: $48,000 (+12% MoM)",
          isCorrect: false,
          feedback: "Healthy top-line growth is not the red flag here."
        },
        {
          id: "rf_2",
          answer: "Stripe Processing Fees: $1,440 (3.0%)",
          isCorrect: false,
          feedback: "Standard credit card processing is 2.9% + $0.30. This is completely normal."
        },
        {
          id: "rf_3",
          answer: "Monthly Subscriber Churn: 14.8% per month",
          isCorrect: true,
          feedback: "RED FLAG FOUND! At 14.8% monthly churn, this business replaces over half its entire customer base every 4 months. They are pouring water into a leaky bucket. No amount of ads can save them.",
          xpReward: 65
        },
        {
          id: "rf_4",
          answer: "Customer Support Payroll: $2,200",
          isCorrect: false,
          feedback: "Under 5% of revenue for responsive customer support is healthy and keeps retention high."
        }
      ]
    },
    {
      id: "round_5",
      type: "decision",
      roundNumber: 5,
      totalRounds: 6,
      category: "OPERATIONS & RETENTION",
      headline: "The Packaging & Churn Dilemma",
      situation: "You now have 180 subscribers. However, 12 customers canceled this week citing stale beans upon arrival. Your roaster informs you that switching to nitrogen-flushed, one-way degassing valve bags will fix this, but costs an extra $0.80 per unit.",
      options: [
        {
          id: "opt_5a",
          label: "Option A: Upgrade to Nitrogen Valve Bags (+$0.80/unit)",
          tag: "Protect LTV",
          tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          description: "Absorb the $0.80 cost. Keeps beans peak fresh for 60 days and protects reputation.",
          impact: {
            cogsPerUnitChange: +0.80,
            churnRateChange: -0.04,
            subscribersChange: +15,
            xp: 50
          },
          feedbackType: "optimal",
          feedbackTitle: "Product Quality Drives LTV",
          feedbackExplanation: "By cutting churn by 4%, customer Lifetime Value (LTV) jumps by over $40 per user! Giving up 80 cents of margin to protect $40 in future revenue is what real operators do.",
          operatorTip: "Customer retention always beats customer acquisition. Fixed leaks before adding water."
        },
        {
          id: "opt_5b",
          label: "Option B: Keep Cheaper Bags & Send Apology Promo Codes",
          tag: "Band-Aid Solution",
          tagColor: "bg-red-500/20 text-red-300 border-red-500/30",
          description: "Save the $0.80 per bag and give 20% off to anyone who complains.",
          impact: {
            cashChange: -150,
            churnRateChange: +0.03,
            xp: 15
          },
          feedbackType: "flawed",
          feedbackTitle: "Subsidizing Mediocrity",
          feedbackExplanation: "Customers don't want discount codes for stale coffee—they want delicious coffee! Word-of-mouth recommendations turned negative and churn climbed to 11%.",
          operatorTip: "Never use marketing discounts to fix a product flaw."
        }
      ]
    },
    {
      id: "round_6",
      type: "drill",
      roundNumber: 6,
      totalRounds: 6,
      category: "LEVEL 1 FINAL TEST • CASH RUNWAY",
      headline: "The Final Survival Calculation",
      situation: "Your bank balance sits at $4,100. Your monthly revenue from 210 subscribers at $26 is $5,460. Your total monthly costs (COGS + fixed overhead) are $4,690. What is your Net Cash Flow, and are you default alive?",
      drillOptions: [
        {
          id: "f_1",
          answer: "+$770/month Net Profit • DEFAULT ALIVE 🟢",
          isCorrect: true,
          feedback: "CONGRATULATIONS! $5,460 revenue - $4,690 total costs = +$770 clean monthly profit. You are no longer burning cash. You are Default Alive, cash-flow positive, and ready to upgrade your life!",
          xpReward: 100
        },
        {
          id: "f_2",
          answer: "-$590/month Net Loss • Burning Cash 🔴",
          isCorrect: false,
          feedback: "Check your numbers again. Revenue ($5,460) is higher than total expenses ($4,690). You are profitable!"
        },
        {
          id: "f_3",
          answer: "+$1,200/month Net Profit • Infinite Runway 🟡",
          isCorrect: false,
          feedback: "Close, but you forgot to subtract Shopify fees and payment processing."
        }
      ]
    }
  ]
};
