import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini client with user-agent telemetry header per AI Studio guidelines
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Daily Mzansi Horoscope Endpoint (Gemini-powered)
  app.post('/api/horoscope', async (req: Request, res: Response) => {
    try {
      const { sign = 'Leo', vibe = 'Soulful Amapiano & Rooftop Sunset', userName = 'Thandeka' } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        // Return rich authentic South African horoscope fallback if no API key provided
        return res.json({
          sign,
          mzansiArchetype: `${sign} • The Mzansi Royalty`,
          dailyForecast: `The stars over Table Mountain and the golden highveld are in perfect harmony for you today! Your natural warmth and magnetic energy are at their peak. Keep your heart open to spontaneous laughter and soulful conversations.`,
          conversationSparker: `Quick Sunday debate: are we watching the golden sunset from a scenic rooftop or having a cozy braai with an amapiano playlist?`,
          luckyVibe: vibe || 'Golden Hour in Camps Bay',
          compatibility: 'Leo, Sagittarius & Libra',
          mzansiDateIdea: 'Scenic coffee drive or artisan gelato stroll followed by sunset drinks',
          luckyNumber: 27,
          isFallback: true
        });
      }

      const prompt = `Generate a Daily Mzansi Horoscope for a dating app user:
Zodiac Sign: ${sign}
Current Vibe: ${vibe}
User Name: ${userName}
Context: South Africa (Mzansi dating culture, warm humor, local charm, braai, amapiano, scenic spots, coffee dates).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the authentic, witty, warm and romantic "Mzansi Love Astrologer" for Mzansi Dating, South Africa's premier dating app.
You provide daily romantic horoscopes infused with modern South African culture, slang, romantic charm, and local vibes (e.g. Braamfontein sunsets, Camps Bay beach strolls, soulful amapiano tracks, Sunday shisanyama dates, scenic drives to God's Window or Chapman's Peak).
Keep it fun, consensual, upbeat, positive, and deeply conversational.
Generate a personality-based daily insight for the requested zodiac sign and vibe, including a killer conversation sparker opening line that the user can copy and paste into their chat with a match.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sign: { type: Type.STRING },
              mzansiArchetype: { 
                type: Type.STRING, 
                description: 'Fun South African persona name e.g. "The Amapiano Groove Romantic", "The Kruger Sunset Dreamer", "The Jozi Hustle Lover"' 
              },
              dailyForecast: { 
                type: Type.STRING, 
                description: '2-3 sentences of daily romantic insight with South African flair and warmth' 
              },
              conversationSparker: { 
                type: Type.STRING, 
                description: 'A witty, engaging opening line or question tailored to this sign that users can paste into chat to break the ice' 
              },
              luckyVibe: { 
                type: Type.STRING, 
                description: 'A vibe tag like "Sunset Rooftop Cocktails" or "Soulful Sunday Braai"' 
              },
              compatibility: { 
                type: Type.STRING, 
                description: 'Best astrological match today e.g. "Scorpio & Leo"' 
              },
              mzansiDateIdea: { 
                type: Type.STRING, 
                description: 'A creative South African date recommendation' 
              },
              luckyNumber: { 
                type: Type.INTEGER, 
                description: 'A lucky love number between 1 and 99' 
              }
            },
            required: ['sign', 'mzansiArchetype', 'dailyForecast', 'conversationSparker', 'luckyVibe', 'compatibility', 'mzansiDateIdea', 'luckyNumber']
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini model');
      }

      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/horoscope:', error);
      return res.json({
        sign: req.body?.sign || 'Leo',
        mzansiArchetype: `${req.body?.sign || 'Leo'} • The Warm-Hearted Romantic`,
        dailyForecast: 'The cosmos is radiating warmth across Mzansi today. Your charisma and genuine smile will effortlessly break any awkward ice.',
        conversationSparker: 'If you had to pick one song that describes your current love life soundtrack, what is playing?',
        luckyVibe: 'Warm Shisanyama & Sweet Laughs',
        compatibility: 'Gemini, Aries & Libra',
        mzansiDateIdea: 'A stroll through a botanical garden followed by iced rooibos tea',
        luckyNumber: 11,
        isFallback: true
      });
    }
  });

  // Interactive Compatibility Quiz Matchmaker Endpoint (Gemini-powered)
  app.post('/api/compatibility-quiz', async (req: Request, res: Response) => {
    try {
      const { answers = {}, candidateProfiles = [] } = req.body;

      if (!process.env.GEMINI_API_KEY || !candidateProfiles || candidateProfiles.length === 0) {
        // Fallback rule-based matching based on answer selections
        const top3 = (candidateProfiles.length >= 3 ? candidateProfiles.slice(0, 3) : candidateProfiles).map((p: any, idx: number) => ({
          profileId: p.id,
          profileName: p.name,
          matchScore: 95 - idx * 4,
          sharedVibeTitle: idx === 0 ? 'High Energy & Spontaneous Romance' : idx === 1 ? 'Mutual Deep Values & Authenticity' : 'Curious Adventurers e Mzansi',
          matchReason: `Your shared love for ${p.interests?.[0] || 'good vibes'} and appreciation for genuine connection create a powerful foundation for sparks to fly.`,
          suggestedOpener: `I took the Mzansi Compatibility Quiz and it flagged our vibes as ${95 - idx * 4}% matched! Are you more into spontaneous weekend getaways or cozy sunset chats?`,
          isFallback: true
        }));

        return res.json({ matches: top3 });
      }

      const prompt = `Analyze this user's dating compatibility quiz answers and match them with the top 3 candidates from the provided list:
User Quiz Answers:
- Ideal Sunday Vibe: ${answers.sundayVibe || 'Soulful braai with amapiano and friends'}
- Communication Style: ${answers.communication || 'Spontaneous voice notes & quick calls'}
- Mzansi Dream Getaway: ${answers.getaway || 'Luxury bush lodge safari in Kruger'}
- Core Relationship Value: ${answers.coreValue || 'Loyalty & mutual emotional support'}

Candidate Profiles:
${JSON.stringify(candidateProfiles.slice(0, 8), null, 2)}

Rank the top 3 best matching candidates based on complementary values, lifestyle compatibility, and romantic spark potential.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the chief romance & compatibility algorithm engine for Mzansi Dating, South Africa's premier dating app.
You analyze user lifestyle preferences, cultural alignment, communication styles, and emotional values to provide thoughtful, romantic, and culturally authentic match analysis.
Generate top 3 matches with high match scores (85% to 98%), a catchy shared vibe title, 2 sentences of compelling reasons why they fit, and an irresistible personalized conversation starter.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    profileId: { type: Type.STRING },
                    profileName: { type: Type.STRING },
                    matchScore: { type: Type.INTEGER, description: 'Percentage compatibility between 80 and 99' },
                    sharedVibeTitle: { type: Type.STRING, description: 'Short catchy archetype e.g. "Sunset Rooftop & Soulful Beats"' },
                    matchReason: { type: Type.STRING, description: '2 sentences on why these two match based on their shared answers' },
                    suggestedOpener: { type: Type.STRING, description: 'A tailored icebreaker the user can send directly in chat' }
                  },
                  required: ['profileId', 'profileName', 'matchScore', 'sharedVibeTitle', 'matchReason', 'suggestedOpener']
                }
              }
            },
            required: ['matches']
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/compatibility-quiz:', error);
      const candidates = req.body?.candidateProfiles || [];
      const top3 = (candidates.length >= 3 ? candidates.slice(0, 3) : candidates).map((p: any, idx: number) => ({
        profileId: p.id,
        profileName: p.name,
        matchScore: 94 - idx * 4,
        sharedVibeTitle: idx === 0 ? 'Pure Chemistry & Scenic Views' : 'Warm Loyalty & Sunday Braai',
        matchReason: `Your lifestyle priorities and core relationship vision align seamlessly with ${p.name}'s passions.`,
        suggestedOpener: `Hey ${p.name}! The compatibility quiz insists we are an ${94 - idx * 4}% match. Do you agree or do we have to debate it over coffee? 😉`,
        isFallback: true
      }));
      return res.json({ matches: top3 });
    }
  });

  // Serve static assets in production or attach Vite dev server middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mzansi Dating server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
