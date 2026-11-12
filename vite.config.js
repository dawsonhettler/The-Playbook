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
  "strengthHighlight": "Direct analysis of their strategy...",
  "blindSpot": "A practical execution watch-out."
}`;

                const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${rawKey}`
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

                const data = await groqRes.json();
                const parsedAI = JSON.parse(data.choices[0].message.content);

                const finalScore = Math.min(100, Math.max(0, Number(parsedAI.score) || 50));
                const baseAxis = Math.floor(finalScore / 4);
                const remainder = finalScore - (baseAxis * 4);

                const axes = {
                  wedge: baseAxis + remainder,
                  capital: baseAxis,
                  speed: baseAxis,
                  moat: baseAxis
                };

                const percentile = Math.min(99, Math.max(1, 100 - Math.round(finalScore * 0.9)));

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  totalScore: finalScore,
                  percentile,
                  axes,
                  strengthHighlight: parsedAI.strengthHighlight,
                  blindSpot: parsedAI.blindSpot,
                  benchmarkMove: caseData.benchmarkMove,
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
