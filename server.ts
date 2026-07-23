import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Simulated Weather API Endpoint
app.get('/api/weather', (req, res) => {
  const location = (req.query.location as string) || 'Bangalore';

  // Sample locations mock weather generator
  const cityPreset: Record<string, any> = {
    'Bangalore': {
      temperatureC: 26,
      temperatureF: 79,
      condition: 'Partly Cloudy',
      humidity: 58,
      season: 'Summer',
      adviceSummary: 'Pleasant, moderate breeze with light cloud cover. Great for breathable linen shirts, cotton tees, or light layers.',
    },
    'Hyderabad': {
      temperatureC: 31,
      temperatureF: 88,
      condition: 'Sunny',
      humidity: 48,
      season: 'Summer',
      adviceSummary: 'Warm and bright sunny day. Opt for lightweight breathable cottons, sun eyewear, and light color tones.',
    },
    'Madurai': {
      temperatureC: 34,
      temperatureF: 93,
      condition: 'Hot & Sunny',
      humidity: 52,
      season: 'Summer',
      adviceSummary: 'Warm tropical sunshine. Select ultra-light linen, airy short sleeves, and UV protective accessories.',
    },
  };

  const selected = cityPreset[location] || {
    temperatureC: 21,
    temperatureF: 70,
    condition: 'Sunny',
    humidity: 50,
    season: 'Spring',
    adviceSummary: `Mild weather in ${location}. Great for versatile smart casual outfits.`,
  };

  res.json({
    location,
    ...selected,
    icon: selected.condition === 'Rainy' ? 'cloud-rain' : selected.condition === 'Sunny' ? 'sun' : 'cloud-sun',
  });
});

// AI Outfit Stylist Endpoint
app.post('/api/suggest-outfit', async (req, res) => {
  try {
    const { weather, occasion, genderPreference, fitPreference, stylePreference, colorPreference, wardrobe } = req.body;

    if (!wardrobe || !Array.isArray(wardrobe) || wardrobe.length === 0) {
      return res.status(400).json({ error: 'Wardrobe items are required to generate outfit recommendations.' });
    }

    const ai = getGeminiClient();

    // Summarize wardrobe for the AI prompt
    const wardrobeSummary = wardrobe.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      genderCategory: item.genderCategory || 'Unisex',
      color: item.color,
      material: item.material || 'Standard',
      formality: item.formality,
      seasons: item.seasons,
      status: item.status, // Clean vs In Laundry
      isFavorite: item.isFavorite,
    }));

    const prompt = `
You are a world-class celebrity personal wardrobe stylist and fashion director.
Your goal is to suggest 3 distinct, beautifully styled outfits created PRIMARILY from the user's available wardrobe inventory.

Context:
- Weather: ${weather?.temperatureC ?? 20}°C / ${weather?.temperatureF ?? 68}°F, Condition: ${weather?.condition ?? 'Sunny'}, Location: ${weather?.location ?? 'Home'}
- Occasion: ${occasion ?? 'Casual Day Out'}
- Gender / Style Category Target: ${genderPreference || 'All Styles'}
- Fit / Silhouette Preference: ${fitPreference || 'Regular Fit'}
- Style Preference / Vibe: ${stylePreference || 'Modern Clean Chic'}
- Color Mood: ${colorPreference || 'Harmonious & Elegant'}

User's Wardrobe Inventory:
${JSON.stringify(wardrobeSummary, null, 2)}

Instructions:
1. Tailor the styling recommendations, proportions, layering, and accessories specifically for the user's requested Gender/Style Target (${genderPreference || 'All Styles'}) and Fit Silhouette (${fitPreference || 'Regular Fit'}).
2. Prefer CLEAN items in the wardrobe over items marked "In Laundry", but if necessary, explain if a piece needs washing.
3. Select items from categories (Tops, Bottoms, Outerwear, Shoes, Bags, Jewelry, Hats, Belts) to form cohesive outfits.
4. For each outfit, provide a catchy title, style vibe name, match score (85 to 99), detailed item breakdown with item IDs matching the wardrobe items where applicable, overall styling rationale, weather suitability rating, actionable styling tips (e.g. roll up sleeves, tuck in front, stack gold hoops), and suggested complementary accessories.
5. Provide a high-level fashion advice summary for the user today.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            generalStylingAdvice: { type: Type.STRING, description: 'Overall stylist note for today\'s weather and occasion' },
            outfits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  styleVibe: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  overallReasoning: { type: Type.STRING },
                  weatherSuitability: { type: Type.STRING },
                  stylingTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  suggestedAccessories: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        itemId: { type: Type.STRING },
                        itemName: { type: Type.STRING },
                        category: { type: Type.STRING },
                        color: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                        isFromWardrobe: { type: Type.BOOLEAN },
                      },
                      required: ['itemName', 'category', 'color', 'reasoning', 'isFromWardrobe'],
                    },
                  },
                },
                required: ['id', 'title', 'styleVibe', 'matchScore', 'overallReasoning', 'weatherSuitability', 'stylingTips', 'items'],
              },
            },
            missingKeyPiecesSuggestion: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['generalStylingAdvice', 'outfits'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini model');
    }

    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating outfit suggestions:', error);
    // Graceful fallback if Gemini fails or key missing
    return res.status(500).json({
      error: 'Unable to connect to AI Stylist engine. Returning fallback recommendations.',
      details: error?.message || String(error),
    });
  }
});

// AI Auto-Analyze Item Photo Endpoint
app.post('/api/analyze-item-image', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required.' });
    }

    const ai = getGeminiClient();

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
      },
    };

    const prompt = `Analyze this image of a clothing item or fashion accessory. Detect and classify it for a wardrobe management system.
Extract:
1. Title/Name (e.g., "Oversized Denim Jacket", "Gold Minimalist Ring", "Chunky White Leather Sneakers")
2. Category: Must be one of ["Tops", "Bottoms", "Dresses & One-Pieces", "Outerwear", "Shoes", "Bags", "Jewelry & Watches", "Hats & Eyewear", "Accessories & Belts"]
3. SubCategory (e.g., "Blazer", "Jeans", "T-shirt", "Handbag", "Watch", "Earrings")
4. Primary Color
5. Material (e.g., "Cotton", "Leather", "Wool", "Silk", "Denim", "Gold Plated")
6. Formality: Must be one of ["Casual", "Smart Casual", "Formal", "Sporty", "Party / Glam"]
7. Suitable Seasons: Array of ["Spring", "Summer", "Autumn", "Winter"]
8. Suggested Storage Location (e.g. "Main Closet - Hanger", "Shoe Rack", "Jewelry Tray", "Pants Rack")
9. Style Notes (1-2 sentences on how to pair this piece)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            subCategory: { type: Type.STRING },
            color: { type: Type.STRING },
            material: { type: Type.STRING },
            formality: { type: Type.STRING },
            seasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedStorageLocation: { type: Type.STRING },
            styleNotes: { type: Type.STRING },
          },
          required: ['name', 'category', 'subCategory', 'color', 'formality', 'seasons', 'suggestedStorageLocation', 'styleNotes'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('No analysis text returned from Gemini');
    }

    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error analyzing image:', err);
    return res.status(500).json({ error: 'Image analysis failed.', details: err?.message || String(err) });
  }
});

// AI Accessory Suggestion for Uploaded Photo Endpoint
app.post('/api/suggest-accessories-for-image', async (req, res) => {
  try {
    const { imageBase64, mimeType, wardrobe, occasion, weather, stylePreference } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Outfit image is required.' });
    }

    const ai = getGeminiClient();

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
      },
    };

    const wardrobeSummary = (wardrobe || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      material: item.material || '',
      formality: item.formality,
      imageUrl: item.imageUrl,
      status: item.status,
    }));

    const prompt = `
You are a world-class celebrity fashion stylist specializing in visual accessory coordination and personal styling.
Examine this image showing an outfit, clothing piece, or person.

Context:
- Occasion: ${occasion || 'Casual Day Out'}
- Weather: ${weather?.temperatureC ?? 24}°C, ${weather?.condition ?? 'Sunny'}, Location: ${weather?.location ?? 'Bangalore'}
- Style Mood / Preference: ${stylePreference || 'Modern Elegant'}

User's Wardrobe Inventory (check for existing items to match):
${JSON.stringify(wardrobeSummary, null, 2)}

Task:
1. Analyze the main clothing items shown in the photo (colors, neckline, sleeve length, formality, overall aesthetic).
2. Recommend 3 curated Accessory Styling Sets (e.g. Set 1: Minimalist Gold & Leather, Set 2: Statement Evening Glam, Set 3: Casual Streetwear Contrast).
3. For each set, provide 3 to 5 key accessories across placements like:
   - "Ears & Head" (earrings, hair pins, hats, sunglasses)
   - "Neck & Collar" (necklaces, scarves)
   - "Wrists & Hands" (watches, bracelets, rings)
   - "Waist & Belt" (belts)
   - "Bags & Carry" (handbags, totes, clutches)
   - "Footwear" (shoes, boots, sandals)
4. For each recommended accessory, check if there is an exact or close match in the user's wardrobe inventory. If matched, set isFromWardrobe: true and provide matchedWardrobeItemId and matchedWardrobeItemName. If not in wardrobe, set isFromWardrobe: false and describe the recommended piece to acquire.
5. Provide precise placement styling advice (e.g., "Pair with small gold hoops to complement the square neckline").
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedOutfitSummary: { type: Type.STRING },
            outfitColorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            overallStylingVibe: { type: Type.STRING },
            accessorySets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  setName: { type: Type.STRING },
                  aestheticVibe: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  stylistAdvice: { type: Type.STRING },
                  recommendedAccessories: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        placement: { type: Type.STRING },
                        accessoryName: { type: Type.STRING },
                        color: { type: Type.STRING },
                        material: { type: Type.STRING },
                        stylingTip: { type: Type.STRING },
                        isFromWardrobe: { type: Type.BOOLEAN },
                        matchedWardrobeItemId: { type: Type.STRING },
                        matchedWardrobeItemName: { type: Type.STRING },
                      },
                      required: ['placement', 'accessoryName', 'color', 'stylingTip', 'isFromWardrobe'],
                    },
                  },
                },
                required: ['id', 'setName', 'aestheticVibe', 'matchScore', 'stylistAdvice', 'recommendedAccessories'],
              },
            },
          },
          required: ['detectedOutfitSummary', 'outfitColorPalette', 'overallStylingVibe', 'accessorySets'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('No accessory recommendations returned from Gemini');
    }

    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error suggesting accessories for image:', err);
    return res.status(500).json({ error: 'Accessory suggestion failed.', details: err?.message || String(err) });
  }
});

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wardrobe Stylist server running at http://localhost:${PORT}`);
  });
}

startServer();
