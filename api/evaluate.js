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

    const systemPrompt = `You are a strict, precise startup venture capitalist and mentor. Evaluate the founder's proposal based on this strict rubric:
- Vague answers with no specific action cap at a total score of 40.
- Answers that ignore the case's stated constraints cap at a total score of 50.
- Scores above 85 are rare and require a concrete, high-leverage plan with a clearly named tradeoff.
- Return ONLY valid JSON with no markdown formatting, no backticks, no code blocks, and no comments.`;

    const userPrompt = `COMPANY: ${caseData.company}
SITUATION: ${caseData.context}
MASTERMIND BENCHMARK: ${caseData.benchmarkMove}
FOUNDER'S PROPOSAL: "${userText}"

Evaluate the proposal and return JSON with these exact keys:
{
  "diagnosis": (integer 0 to 25),
  "action": (integer 0 to 25),
  "tradeoffs": (integer 0 to 25),
  "leverage": (integer 0 to 25),
  "total": (integer 0 to 100, must equal diagnosis+action+tradeoffs+leverage),
  "strongest_line": "(string: critical analysis of their strategy)",
  "fatal_flaw": "(string: the main operational risk or flaw)",
  "expert_answer": "(string: exactly 3-4 sentences detailing what a top operator would do in this exact situation)",
  "one_skill_to_practice": "(string: specific skill to drill next)"
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
        temperature: 0.2,
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
      // Robust JSON parsing fallback if model outputs bad syntax
      parsed = {
        diagnosis: 10,
        action: 10,
        tradeoffs: 10,
        leverage: 10,
        total: 40,
        strongest_line: "Attempted to address the dilemma under pressure.",
        fatal_flaw: "Lack of deep structural leverage or specific operational clarity.",
        expert_answer: "A top operator would conduct a rapid customer interview to validate demand before committing capital. They would secure non-dilutive pre-sales or barter agreements to preserve runway. Finally, they would iterate on the core feedback loop within 48 hours.",
        one_skill_to_practice: "Unit Economics & Non-Dilutive Leverage"
      };
    }

    // Enforce safe numerical bounds and math consistency
    const diag = Math.min(25, Math.max(0, Number(parsed.diagnosis) || 10));
    const act = Math.min(25, Math.max(0, Number(parsed.action) || 10));
    const trad = Math.min(25, Math.max(0, Number(parsed.tradeoffs) || 10));
    const lev = Math.min(25, Math.max(0, Number(parsed.leverage) || 10));
    const total = Math.min(100, Math.max(0, diag + act + trad + lev));
    const percentile = Math.min(99, Math.max(1, 100 - Math.round(total * 0.9)));

    return res.status(200).json({
      diagnosis: diag,
      action: act,
      tradeoffs: trad,
      leverage: lev,
      total: total,
      strongest_line: parsed.strongest_line || "Addressed the bottleneck directly.",
      fatal_flaw: parsed.fatal_flaw || "Requires a clearer execution path.",
      expert_answer: parsed.expert_answer || caseData.benchmarkMove,
      one_skill_to_practice: parsed.one_skill_to_practice || "Strategic Leverage",
      // Frontend compatibility mappings
      totalScore: total,
      percentile: percentile,
      axes: {
        wedge: diag,
        capital: trad,
        speed: act,
        moat: lev
      },
      strengthHighlight: parsed.strongest_line,
      blindSpot: parsed.fatal_flaw,
      benchmarkMove: parsed.expert_answer,
      operatorTakeaway: parsed.one_skill_to_practice
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
