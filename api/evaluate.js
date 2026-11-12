export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { userText, caseData } = req.body;
    const apiKey = process.env.GROQ_API_KEY || process.env.AI_KEY;

    const prompt = `You are a strict startup venture mentor.
Evaluate this founder proposal:
COMPANY: ${caseData.company}
PROPOSAL: "${userText}"

Assign a total score (0-100) and 4 sub-scores (0-25 each: wedge, capital, speed, moat).
The 4 sub-scores MUST sum up to the total score.
If proposal is hostile/troll, total score is 2. If weak, 30-50. If clever, 85-96.

Return valid JSON ONLY (no markdown):
{
  "totalScore": 88,
  "axes": { "wedge": 22, "capital": 22, "speed": 22, "moat": 22 },
  "strengthHighlight": "Tactical analysis here...",
  "blindSpot": "Operational risk here..."
}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    const data = await groqRes.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    // DETERMINISTIC MATH OVERRIDE (Ensures consistency)
    const t = Number(parsed.totalScore);
    const percentile = Math.min(99, Math.max(1, Math.round(t * 0.95)));

    res.status(200).json({
      totalScore: t,
      percentile,
      axes: parsed.axes,
      strengthHighlight: parsed.strengthHighlight,
      blindSpot: parsed.blindSpot,
      benchmarkMove: caseData.benchmarkMove,
      operatorTakeaway: caseData.operatorTakeaway
    });
  } catch (e) {
    res.status(500).json({ error: "Evaluation failed" });
  }
}
