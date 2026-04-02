import { PatientInfo, RiskHabits, AssessmentResult } from "../types";

export async function analyzeOralLesion(
  patientInfo: PatientInfo,
  riskHabits: RiskHabits,
  images: string[] // base64 strings
): Promise<AssessmentResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientInfo,
        riskHabits,
        images,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze oral lesion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling analysis API:', error);
    throw error;
  }
}
