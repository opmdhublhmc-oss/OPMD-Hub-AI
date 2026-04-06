export interface PatientInfo {
  name: string;
  age: string;
  phoneNumber: string;
  region: string;
  nation: string;
}

export interface RiskHabits {
  chewingTobacco: boolean;
  smoking: boolean;
  arecaNut: boolean;
  sharpTeeth: boolean;
  illFittingDentures: boolean;
  poorHygiene: boolean;
  familyHistory: boolean;
}

export interface AssessmentResult {
  provisionalDiagnosis: string;
  riskScore: number; // 0-10
  summary: string;
  identifiedLesions: string[];
  recommendations: string[];
  literatureReferences: { title: string; url: string }[];
}
