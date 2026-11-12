export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { userText, caseData } = req.body || {};
    const apiKey = process.env.GROQ_API_KEY || process.env.AI_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Server missing GROQ_API_KEY in Vercel environment variables." });
    }

    const cleanInput = (userText || "").trim();
    const textLower = cleanInput.toLowerCase();

    // =========================================================================
    // LAYER 1: HARD SAFETY NET FOR PROFANITY, HOSTILITY & TROLLS
    // =========================================================================
    const hostileWords = ["fuck", "shit", "bitch", "ass", "kill", "murder", "hate", "stfu", "idiot", "trash", "garbage", "shut up", "asdf", "poop"];
    const isHostile = hostileWords.some(w => new RegExp(`\\b${w}\\b`, 'i').test(textLower));

    if (isHostile || textLower.length < 3) {
      const lowScore = Math.floor(Math.random() * 6) + 2; // 2 to 7 pts
      const baseAxis = Math.floor(lowScore / 4);
      const remainder = lowScore - (baseAxis * 4);

      return res.status(200).json({
        totalScore: lowScore,
        percentile: 2,
        axes: {
          wedge: baseAxis + remainder,
          capital: baseAxis,
          speed: baseAxis,
          moat: baseAxis
        },
        strengthHighlight: "Hostile, vulgar, or dismissive responses alienate customers and destroy brand equity in public markets.",
        blindSpot: "Complete failure to engage with the customer objection or provide commercial value.",
        benchmarkMove: caseData.benchmarkMove,
        operatorTakeaway: caseData.operatorTakeaway
      });
    }

    // =========================================================================
    // LAYER 2: TRUE AI GRADING VIA LLM
    // =========================================================================
    const systemPrompt = `You are a strict, precise startup venture capitalist and mentor. Evaluate the founder's proposal based on this rubric:
- If the proposal is weak, lazy, or generic, assign a score between 35 and 60 ("score").
- If the proposal is clever, empathetic, or high-leverage, assign a score between 75 and 98 ("score").
- Return valid JSON ONLY with exact keys: "score" (integer 0-100), "strengthHighlight" (string critique), "blindSpot" (string operational risk). No markdown backticks.`;

    const userPrompt = `COMPANY: ${caseData.company}
SITUATION: ${caseData.context}
MASTERMIND BENCHMARK: ${caseData.benchmarkMove}
FOUNDER'S PROPOSAL: "${cleanInput}"

Return JSON ONLY:
{
  "score": (integer 0-100),
  "strengthHighlight": "...",
  "blindSpot": "..."
}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!groqRes.ok) {
      const errJson = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({ error: errJson?.error?.message || "Groq request failed." });
    }

    const data = await groqRes.json();
    const rawContent = data.choices[0].message.content;

    let parsed;
    try {
      let cleanJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      parsed = { score: 65, strengthHighlight: "Solid operational intent addressing the bottleneck.", blindSpot: "Ensure smooth execution." };
    }

    const finalScore = Math.min(100, Math.max(0, Number(parsed.score) || 65));
    const baseAxis = Math.floor(finalScore / 4);
    const remainder = finalScore - (baseAxis * 4);

    const axes = {
      wedge: baseAxis + remainder,
      capital: baseAxis,
      speed: baseAxis,
      moat: baseAxis
    };

    const percentile = Math.min(99, Math.max(1, 100 - Math.round(finalScore * 0.9)));

    return res.status(200).json({
      totalScore: finalScore,
      percentile,
      axes,
      strengthHighlight: parsed.strengthHighlight || "Addressed the bottleneck directly.",
      blindSpot: parsed.blindSpot || "Requires a clearer execution path.",
      benchmarkMove: caseData.benchmarkMove,
      operatorTakeaway: caseData.operatorTakeaway
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
