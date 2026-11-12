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

    const prompt = `You are a strict, precise startup venture capitalist and mentor.
Evaluate this founder proposal:
COMPANY: ${caseData.company}
SITUATION: ${caseData.context}
MASTERMIND BENCHMARK: ${caseData.benchmarkMove}
FOUNDER'S PROPOSAL: "${userText}"

CRITICAL GRADING INSTRUCTIONS:
1. Judge the proposal's real-world business effectiveness, professionalism, and psychology.
2. Assign a numerical score from 0 to 100 ("score"):
   - If the proposal is vulgar, hostile, trolling, or violent (e.g. "fuck him", "kill everyone"), assign a score between 0 and 10.
   - If the proposal is weak, lazy, or generic, assign a score between 35 and 60.
   - If the proposal is clever, empathetic, or high-leverage, assign a score between 75 and 98.
3. Write a crisp 2-sentence tactical analysis ("strengthHighlight").
4. Write a brief operational risk ("blindSpot").

Return valid JSON ONLY (no markdown code blocks, no backticks):
{
  "score": 5,
  "strengthHighlight": "Direct analysis of their strategy and why it works or fails.",
  "blindSpot": "A practical execution watch-out."
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
          { role: "system", content: "You are an elite VC judge. Output valid JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!groqRes.ok) {
      const errJson = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({ error: errJson?.error?.message || "Groq request failed." });
    }

    const data = await groqRes.json();
    const rawContent = data.choices[0].message.content;
    const parsedAI = JSON.parse(rawContent);

    // True AI Score directly from LLM
    const finalScore = Math.min(100, Math.max(0, Number(parsedAI.score) || 50));
    
    // Distribute mathematically across 4 clean sub-axes
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
      strengthHighlight: parsedAI.strengthHighlight || "Solid tactical intent addressing the core bottleneck.",
      blindSpot: parsedAI.blindSpot || "Ensure seamless customer execution during early rollout.",
      benchmarkMove: caseData.benchmarkMove,
      operatorTakeaway: caseData.operatorTakeaway
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
