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

    const prompt = `You are a strict, precise startup venture mentor. Analyze this founder proposal:
COMPANY: ${caseData.company}
SITUATION: ${caseData.context}
MASTERMIND BENCHMARK: ${caseData.benchmarkMove}
FOUNDER'S PROPOSAL: "${userText}"

Provide a crisp, direct 2-sentence tactical critique analyzing why this specific strategy works or where it falls short. Do not include any numbers or scores.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "You are an elite startup mentor. Provide crisp tactical feedback." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!groqRes.ok) {
      const errJson = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({ error: errJson?.error?.message || "Groq request failed." });
    }

    const data = await groqRes.json();
    const rawAiText = data.choices[0].message.content;

    // Deterministic math scoring engine
    const textLower = (userText || "").toLowerCase();
    const isHostile = ["kill", "murder", "rob", "steal", "bomb", "punch", "asdf", "poop"].some(w => textLower.includes(w));
    const hasLeverage = ["sample", "free", "chalkboard", "magnet", "bucket", "pastry", "video", "side-by-side", "hand", "vial", "deposit", "pre-order", "vault", "exclusive", "key"].some(w => textLower.includes(w));
    const isLazy = ["ads", "loan", "borrow", "wait", "give up", "sue", "argue"].some(w => textLower.includes(w));

    let finalScore = 72;
    if (isHostile) finalScore = 4;
    else if (hasLeverage && textLower.length > 5) finalScore = 94;
    else if (isLazy) finalScore = 45;
    else if (textLower.length < 5) finalScore = 25;

    const baseAxis = Math.floor(finalScore / 4);
    const remainder = finalScore - (baseAxis * 4);

    const axes = {
      wedge: baseAxis + remainder,
      capital: baseAxis,
      speed: baseAxis,
      moat: baseAxis
    };

    const percentile = Math.min(99, Math.max(1, Math.round(finalScore * 1.02)));

    return res.status(200).json({
      totalScore: finalScore,
      percentile,
      axes,
      strengthHighlight: rawAiText || "Solid tactical intent addressing the core bottleneck.",
      blindSpot: "Ensure seamless customer execution during early rollout to prevent friction.",
      benchmarkMove: caseData.benchmarkMove,
      operatorTakeaway: caseData.operatorTakeaway
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
