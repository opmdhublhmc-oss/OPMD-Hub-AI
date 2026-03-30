import { GoogleGenAI, Type } from "@google/genai";
import { PatientInfo, RiskHabits, AssessmentResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeOralLesion(
  patientInfo: PatientInfo,
  riskHabits: RiskHabits,
  images: string[] // base64 strings
): Promise<AssessmentResult> {
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
  `;

  const imageParts = images.map((img) => ({
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

  return JSON.parse(response.text || "{}");
}
