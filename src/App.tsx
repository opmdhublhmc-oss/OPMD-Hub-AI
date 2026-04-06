/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Activity, ClipboardList, Camera, CheckCircle2, Loader2, Info, Home, BookOpen, Mail, ChevronRight } from 'lucide-react';
import { PatientInfo, RiskHabits, AssessmentResult } from './types';
import { MedicalDisclaimer } from './components/MedicalDisclaimer';
import { PatientForm } from './components/PatientForm';
import { RiskHabitsForm } from './components/RiskHabitsForm';
import { ImageUpload } from './components/ImageUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { analyzeOralLesion } from './services/geminiService';
import { supabase } from './lib/supabase';

type View = 'home' | 'about' | 'contact' | 'assessment';
type Step = 'intro' | 'patient-info' | 'risk-habits' | 'image-upload' | 'analyzing' | 'results';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [step, setStep] = useState<Step>('intro');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: '',
    phoneNumber: '',
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

  const handleStart = () => {
    setView('assessment');
    setStep('patient-info');
  };
  
  const handleAnalyze = async () => {
    setStep('analyzing');
    setError(null);
    try {
      const analysisResult = await analyzeOralLesion(patientInfo, riskHabits, images);
      setResult(analysisResult);
      setStep('results');

      // Save to Supabase
      try {
        const { error: supabaseError } = await supabase
          .from('assessments')
          .insert([
            {
              patient_name: patientInfo.name,
              patient_age: parseInt(patientInfo.age),
              patient_phone: patientInfo.phoneNumber,
              patient_region: patientInfo.region,
              patient_nation: patientInfo.nation,
              risk_habits: riskHabits,
              risk_score: analysisResult.riskScore,
              provisional_diagnosis: analysisResult.provisionalDiagnosis,
              identified_lesions: analysisResult.identifiedLesions,
              summary: analysisResult.summary,
              created_at: new Date().toISOString(),
            },
          ]);

        if (supabaseError) {
          console.error('Error saving to Supabase:', supabaseError);
        } else {
          console.log('Successfully saved to Supabase');
        }
      } catch (dbErr) {
        console.error('Database connection error:', dbErr);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
      setStep('image-upload');
    }
  };

  const reset = () => {
    setView('home');
    setStep('intro');
    setPatientInfo({ name: '', age: '', phoneNumber: '', region: '', nation: '' });
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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: BookOpen },
    { id: 'assessment', label: 'Assessment', icon: Stethoscope },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView('home')}
          >
            <img src="https://i.postimg.cc/XqdZHMv6/new-logo-(19-jan-2024).png" alt="OPMD Hub Logo" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight leading-none">OPMD Hub AI</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">OPMD Assessment Tool</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as View);
                  if (item.id === 'assessment' && step === 'intro') setStep('patient-info');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  view === item.id 
                    ? 'bg-zinc-900 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <item.icon size={14} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                      <Activity size={12} /> National Resource Centre
                    </motion.div>
                    <h2 className="text-6xl font-black tracking-tighter leading-[0.9] text-zinc-900">
                      Early detection <br />
                      <span className="text-emerald-600">saves lives.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
                      The OPMD Hub AI provides advanced clinical assessment for Oral Potentially Malignant Disorders using state-of-the-art diagnostic protocols.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleStart}
                      className="px-8 py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg shadow-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 group"
                    >
                      Start Assessment
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setView('about')}
                      className="px-8 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-2xl font-bold text-lg hover:bg-zinc-50 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              <MedicalDisclaimer />

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: ClipboardList, title: 'Patient Data', desc: 'Securely collect basic info for clinical documentation' },
                  { icon: Activity, title: 'Risk Factors', desc: 'Analyze lifestyle habits and medical history' },
                  { icon: Camera, title: 'Image Analysis', desc: 'AI-driven lesion detection and pattern recognition' },
                ].map((item, idx) => (
                  <div key={idx} className="p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-4 hover:border-emerald-200 transition-all group">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                      <item.icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'about' && <About />}
          {view === 'contact' && <Contact />}

          {view === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Progress Bar */}
              {step !== 'analyzing' && step !== 'results' && (
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    {steps.map((s, idx) => (
                      <div key={s.id} className="flex items-center">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${
                          idx <= currentStepIndex ? 'bg-emerald-500 text-white shadow-lg' : 'bg-zinc-100 text-zinc-400'
                        }`}>
                          <s.icon size={16} />
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`w-8 h-[2px] mx-2 transition-all duration-500 ${
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
                    Exit
                  </button>
                </div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-100 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="https://i.postimg.cc/XqdZHMv6/new-logo-(19-jan-2024).png" alt="Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
              <span className="text-sm font-black uppercase tracking-widest">OPMD Hub AI</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A National Resource Centre dedicated to the early detection and management of Oral Potentially Malignant Disorders.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setView(item.id as View)}
                  className="text-xs text-zinc-400 hover:text-emerald-600 transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Contact</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Lady Hardinge Medical College<br />
              New Delhi - 110007<br />
              opmdhublhmc@gmail.com
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-50">
          <div className="flex items-center gap-2 opacity-50">
            <span className="text-[10px] font-bold uppercase tracking-widest">© 2026 OPMD Hub AI v1.0</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
