import "dotenv/config";
import express from "express";
import { createServer as createViteServer, loadEnv } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Load environment variables using Vite's loadEnv for consistency
  const viteEnv = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

  app.use(express.json({ limit: '50mb' }));

  // API Route for AI Analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { patientInfo, riskHabits, images } = req.body;
      
      // Try various sources for the API key
      let apiKey = process.env.GEMINI_API_KEY || 
                   viteEnv.GEMINI_API_KEY ||
                   process.env.API_KEY || 
                   viteEnv.API_KEY ||
                   process.env.GOOGLE_API_KEY ||
                   viteEnv.GOOGLE_API_KEY;
      
      // Case-insensitive search if still not found
      if (!apiKey) {
        const allEnv = { ...process.env, ...viteEnv };
        const keyName = Object.keys(allEnv).find(k => k.toUpperCase().includes("GEMINI") && k.toUpperCase().includes("KEY"));
        if (keyName) {
          apiKey = allEnv[keyName];
        }
      }

      // If the key is the placeholder from .env.example, ignore it
      if (apiKey === "MY_GEMINI_API_KEY") {
        apiKey = undefined;
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please go to the 'Settings' menu (gear icon) in AI Studio, click 'Secrets', and add a secret named GEMINI_API_KEY with your API key." 
        });
      }

      console.log(`Using API key (length: ${apiKey.length}, starts with: ${apiKey.substring(0, 3)}...)`);

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";

      const prompt = `
        You are a specialized oral pathology AI assistant. 
        Analyze the following patient data and oral cavity images to assess for Oral Potentially Malignant Disorders (OPMD).

        Patient Information:
        - Name: ${patientInfo.name}
        - Age: ${patientInfo.age}
        - Region: ${patientInfo.region}
        - Nation: ${patientInfo.nation}

        Risk Habits:
        - Chewing Tobacco: ${riskHabits.chewingTobacco ? "Yes" : "No"}
        - Smoking: ${riskHabits.smoking ? "Yes" : "No"}
        - Areca Nut Use: ${riskHabits.arecaNut ? "Yes" : "No"}
        - Sharp Teeth: ${riskHabits.sharpTeeth ? "Yes" : "No"}
        - Ill-fitting Dentures: ${riskHabits.illFittingDentures ? "Yes" : "No"}
        - Poor Oral Hygiene: ${riskHabits.poorHygiene ? "Yes" : "No"}
        - Family History of Cancer: ${riskHabits.familyHistory ? "Yes" : "No"}

        Task:
        1. Provide a provisional diagnosis based on the visual evidence in the images and the risk factors.
        2. Assign a risk score from 0 to 10 (0-5: Lower risk of OPMD, 6-10: Higher likelihood of oral cancer).
        3. Summarize the findings clearly and concisely.
        4. Identify specific lesion types (e.g., Leukoplakia, Erythroplakia, Oral Lichen Planus).
        5. Provide actionable recommendations.
        6. Include references to reliable medical literature or online articles for the identified conditions.

        IMPORTANT: This is a provisional assessment for educational purposes. Always include a strong medical disclaimer.
        
        Return the result strictly as a JSON object with the following structure:
        {
            "provisionalDiagnosis": "string",
            "riskScore": number,
            "summary": "string",
            "identifiedLesions": ["string"],
            "recommendations": ["string"],
            "literatureReferences": [{ "title": "string", "url": "string" }]
        }
      `;

      const imageParts = images.map((img: string) => ({
        inlineData: {
          data: img.split(",")[1], // Remove data:image/png;base64,
          mimeType: "image/jpeg",
        },
      }));

      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: prompt },
              ...imageParts,
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              provisionalDiagnosis: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              identifiedLesions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              recommendations: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              literatureReferences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["provisionalDiagnosis", "riskScore", "summary", "identifiedLesions", "recommendations", "literatureReferences"]
          },
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      console.error("Analysis Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred during analysis." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
