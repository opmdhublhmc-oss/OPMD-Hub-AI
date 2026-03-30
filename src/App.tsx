/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Activity, ClipboardList, Camera, CheckCircle2, Loader2, Info } from 'lucide-react';
import { PatientInfo, RiskHabits, AssessmentResult } from './types';
import { MedicalDisclaimer } from './components/MedicalDisclaimer';
import { PatientForm } from './components/PatientForm';
import { RiskHabitsForm } from './components/RiskHabitsForm';
import { ImageUpload } from './components/ImageUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeOralLesion } from './services/geminiService';

type Step = 'intro' | 'patient-info' | 'risk-habits' | 'image-upload' | 'analyzing' | 'results';

export default function App() {
  const [step, setStep] = useState<Step>('intro');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: '',
    region: '',
    nation: '',
  });
  const [riskHabits, setRiskHabits] = useState<RiskHabits>({
    chewingTobacco: false,
    smoking: false,
    arecaNut: false,
    sharpTeeth: false,
    illFittingDentures: false,
    poorHygiene: false,
    familyHistory: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => setStep('patient-info');
  
  const handleAnalyze = async () => {
    setStep('analyzing');
    setError(null);
    try {
      const analysisResult = await analyzeOralLesion(patientInfo, riskHabits, images);
      setResult(analysisResult);
      setStep('results');
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
      setStep('image-upload');
    }
  };

  const reset = () => {
    setStep('intro');
    setPatientInfo({ name: '', age: '', region: '', nation: '' });
    setRiskHabits({
      chewingTobacco: false,
      smoking: false,
      arecaNut: false,
      sharpTeeth: false,
      illFittingDentures: false,
      poorHygiene: false,
      familyHistory: false,
    });
    setImages([]);
    setResult(null);
  };

  const steps = [
    { id: 'patient-info', label: 'Info', icon: ClipboardList },
    { id: 'risk-habits', label: 'Risks', icon: Activity },
    { id: 'image-upload', label: 'Photos', icon: Camera },
    { id: 'results', label: 'Result', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-zinc-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Stethoscope size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">OralHealth AI</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">OPMD Assessment</span>
            </div>
          </div>
          
          {step !== 'intro' && step !== 'analyzing' && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1">
                {steps.map((s, idx) => (
                  <div key={s.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      idx <= currentStepIndex ? 'bg-emerald-500 scale-125' : 'bg-zinc-200'
                    }`} />
                    {idx < steps.length - 1 && (
                      <div className={`w-4 h-[2px] transition-all duration-500 ${
                        idx < currentStepIndex ? 'bg-emerald-500' : 'bg-zinc-100'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <button 
                onClick={reset}
                className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter leading-[0.9] text-zinc-900">
                  Early detection <br />
                  <span className="text-emerald-600">saves lives.</span>
                </h2>
                <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
                  Assess oral lesions for potential disorders using our AI-powered diagnostic tool. 
                  Based on clinical literature and risk factor analysis.
                </p>
              </div>

              <MedicalDisclaimer />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: ClipboardList, title: 'Patient Data', desc: 'Securely collect basic info' },
                  { icon: Activity, title: 'Risk Factors', desc: 'Analyze lifestyle habits' },
                  { icon: Camera, title: 'Image Analysis', desc: 'AI-driven lesion detection' },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm space-y-3">
                    <item.icon className="text-emerald-600" size={24} />
                    <h3 className="font-bold text-sm">{item.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStart}
                className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg shadow-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 group"
              >
                Start Assessment
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ClipboardList size={20} />
                </motion.div>
              </button>
            </motion.div>
          )}

          {step === 'patient-info' && (
            <motion.div
              key="patient-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">General Information</h2>
                <p className="text-zinc-500">Let's start with some basic details about the patient.</p>
              </div>
              <PatientForm 
                data={patientInfo} 
                onChange={setPatientInfo} 
                onNext={() => setStep('risk-habits')} 
              />
            </motion.div>
          )}

          {step === 'risk-habits' && (
            <motion.div
              key="risk-habits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">Risk Assessment</h2>
                <p className="text-zinc-500">Select any habits or factors that apply to the patient.</p>
              </div>
              <RiskHabitsForm 
                data={riskHabits} 
                onChange={setRiskHabits} 
                onNext={() => setStep('image-upload')}
                onBack={() => setStep('patient-info')}
              />
            </motion.div>
          )}

          {step === 'image-upload' && (
            <motion.div
              key="image-upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">Lesion Documentation</h2>
                <p className="text-zinc-500">Upload clear photos of the affected oral cavity area.</p>
              </div>
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                  <Info size={16} />
                  {error}
                </div>
              )}
              <ImageUpload 
                images={images} 
                onChange={setImages} 
                onNext={handleAnalyze}
                onBack={() => setStep('risk-habits')}
              />
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-8 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                <Loader2 className="animate-spin text-emerald-600 relative z-10" size={64} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight">Analyzing Clinical Data</h2>
                <p className="text-zinc-500 max-w-xs mx-auto">
                  Our AI is cross-referencing your inputs with medical literature and visual patterns...
                </p>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 'results' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">Assessment Results</h2>
                <p className="text-zinc-500">Based on the provided information and visual analysis.</p>
              </div>
              <ResultsDisplay result={result} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-12 border-t border-zinc-100 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-30">
            <Stethoscope size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">OralHealth AI v1.0</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Terms of Service</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
