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

                const cleanInput = (userText || "").trim();
                const textLower = cleanInput.toLowerCase();

                const hostileWords = ["fuck", "shit", "bitch", "ass", "kill", "murder", "hate", "stfu", "idiot", "trash", "garbage", "shut up", "asdf", "poop"];
                const isHostile = hostileWords.some(w => new RegExp(`\\b${w}\\b`, 'i').test(textLower));

                if (isHostile || textLower.length < 3) {
                  const lowScore = Math.floor(Math.random() * 6) + 2;
                  const baseAxis = Math.floor(lowScore / 4);
                  const remainder = lowScore - (baseAxis * 4);

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({
                    totalScore: lowScore,
                    percentile: 2,
                    axes: { wedge: baseAxis + remainder, capital: baseAxis, speed: baseAxis, moat: baseAxis },
                    strengthHighlight: "Hostile, vulgar, or dismissive responses alienate customers and destroy brand equity.",
                    blindSpot: "Complete failure to engage with customer objection.",
                    benchmarkMove: caseData.benchmarkMove,
                    operatorTakeaway: caseData.operatorTakeaway
                  }));
                }

                const prompt = `You are a strict startup mentor. Evaluate this founder proposal:
COMPANY: ${caseData.company}
SITUATION: ${caseData.context}
MASTERMIND BENCHMARK: ${caseData.benchmarkMove}
FOUNDER'S PROPOSAL: "${cleanInput}"

Assign a numerical score from 0 to 100 ("score"). Return valid JSON ONLY:
{
  "score": (integer 0-100),
  "strengthHighlight": "...",
  "blindSpot": "..."
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

                const finalScore = Math.min(100, Math.max(0, Number(parsedAI.score) || 65));
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
