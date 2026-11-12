import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'backend-ai-proxy',
        configureServer(server) {
          server.middlewares.use('/api/evaluate', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end('Method Not Allowed');
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { userText, caseData } = JSON.parse(body);
                const rawKey = (env.AI_KEY || env.GROQ_API_KEY || env.GEMINI_API_KEY || process.env.GROQ_API_KEY || '').trim();

                const RUBRIC = [
                  { key: "diagnosis",      label: "Diagnosis",      weight: 0.30, desc: "Did they identify the true root cause, not just a symptom?" },
                  { key: "prioritization", label: "Prioritization", weight: 0.25, desc: "Did they pick the highest-leverage move and say what NOT to do?" },
                  { key: "actionability",  label: "Actionability",  weight: 0.25, desc: "Are the next steps concrete, specific, and doable this week?" },
                  { key: "risk_metrics",   label: "Risk & Metrics", weight: 0.20, desc: "Did they name what could go wrong and how they'd measure success?" },
                ];

                const systemPrompt = `You are a strict, fair startup-strategy grader.
Reason carefully about the case first: work out what the real root problem is and what an excellent answer would contain. Then judge the user's answer against that. Be skeptical: vague, generic, or buzzword-heavy answers score low.
Quote or point to specific parts of the answer to justify each score.
Score each category as an integer from 0 to 10 (5 = mediocre, 8+ = excellent).

Categories:
${RUBRIC.map((r) => `- ${r.key}: ${r.desc}`).join("\n")}

Respond with ONLY valid JSON in exactly this shape:
{
  "ideal_answer_summary": "2 sentences on what a top answer would say",
  "scores": { ${RUBRIC.map((r) => `"${r.key}": {"score": 0, "reason": "..."}`).join(", ")} },
  "biggest_strength": "...",
  "biggest_gap": "...",
  "off_topic": false
}`;

                const userPrompt = `CASE:\nCompany: ${caseData.company}\nSector: ${caseData.sector}\nSituation: ${caseData.context}\nBenchmark: ${caseData.benchmarkMove}\n\nUSER'S ANSWER:\n${userText}`;

                const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${rawKey}`
                  },
                  body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    temperature: 0,
                    response_format: { type: "json_object" },
                    messages: [
                      { role: "system", content: systemPrompt },
                      { role: "user", content: userPrompt }
                    ]
                  })
                });

                const data = await groqRes.json();
                const rawContent = data.choices[0].message.content;

                let result;
                try {
                  let cleanJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
                  const start = cleanJson.indexOf("{");
                  const end = cleanJson.lastIndexOf("}");
                  result = JSON.parse(cleanJson.slice(start, end + 1));
                } catch (e) {
                  result = {
                    ideal_answer_summary: caseData.benchmarkMove,
                    scores: {
                      diagnosis: { score: 5, reason: "Moderate understanding of the situation." },
                      prioritization: { score: 5, reason: "Standard approach to prioritization." },
                      actionability: { score: 5, reason: "Action steps are somewhat generic." },
                      risk_metrics: { score: 5, reason: "Limited discussion of risks." }
                    },
                    biggest_strength: "Addressed the core dilemma directly.",
                    biggest_gap: "Needs more operational specificity.",
                    off_topic: false
                  };
                }

                const rows = RUBRIC.map((r) => {
                  const raw = Number(result.scores?.[r.key]?.score);
                  const score = Math.min(10, Math.max(0, Number.isFinite(raw) ? raw : 5));
                  return { ...r, score, reason: result.scores?.[r.key]?.reason || "" };
                });

                const percent = rows.reduce((sum, r) => sum + (r.score / 10) * r.weight * 100, 0);
                const finalScore = Math.round(percent * 10) / 10;
                const percentile = Math.min(99, Math.max(1, Math.round(finalScore * 0.95)));

                const axes = {
                  wedge: Math.round((rows.find(r => r.key === 'diagnosis')?.score || 5) * 2.5),
                  capital: Math.round((rows.find(r => r.key === 'prioritization')?.score || 5) * 2.5),
                  speed: Math.round((rows.find(r => r.key === 'actionability')?.score || 5) * 2.5),
                  moat: Math.round((rows.find(r => r.key === 'risk_metrics')?.score || 5) * 2.5)
                };

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  totalScore: finalScore,
                  percentile,
                  axes,
                  strengthHighlight: `${result.biggest_strength} (${rows[0].label}: ${rows[0].reason})`,
                  blindSpot: `${result.biggest_gap} (${rows[2].label}: ${rows[2].reason})`,
                  benchmarkMove: result.ideal_answer_summary,
                  operatorTakeaway: caseData.operatorTakeaway
                }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          });
        }
      }
    ]
  };
});
