import React from 'react';
import { AssessmentResult } from '../types';
import { ShieldAlert, ExternalLink, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  result: AssessmentResult;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<Props> = ({ result, onReset }) => {
  const isHighRisk = result.riskScore >= 6;

  return (
    <div className="space-y-8 pb-12">
      {/* Risk Score Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-3xl text-center space-y-4 ${
          isHighRisk ? 'bg-red-50 text-red-900' : 'bg-emerald-50 text-emerald-900'
        }`}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl mb-2">
          <span className={`text-4xl font-black ${isHighRisk ? 'text-red-600' : 'text-emerald-600'}`}>
            {result.riskScore}
          </span>
          <span className="text-sm font-bold opacity-40 mt-4">/10</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isHighRisk ? 'High Risk Assessment' : 'Low to Moderate Risk'}
        </h2>
        <p className={`text-sm font-medium max-w-md mx-auto leading-relaxed ${isHighRisk ? 'text-red-700' : 'text-emerald-700'}`}>
          {isHighRisk 
            ? "The risk factor score suggests a heightened concern for oral cancer. Immediate professional consultation is strongly advised."
            : "The risk factor score indicates a lower immediate concern, but monitoring and regular checkups are still recommended."}
        </p>
      </motion.div>

      {/* Provisional Diagnosis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-900">
          <ShieldAlert size={20} className="text-zinc-400" />
          <h3 className="text-lg font-bold">Provisional Diagnosis</h3>
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
          <p className="text-zinc-700 leading-relaxed italic">
            "{result.provisionalDiagnosis}"
          </p>
        </div>
      </div>

      {/* Identified Lesions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-900">
          <Info size={20} className="text-zinc-400" />
          <h3 className="text-lg font-bold">Identified Lesion Types</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.identifiedLesions.map((lesion, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100 group hover:border-emerald-200 transition-all">
              <span className="font-semibold text-zinc-800">{lesion}</span>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(lesion + ' medical information oral health')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm flex items-center gap-1 text-xs font-bold"
              >
                Learn More <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Summary & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Clinical Summary</h4>
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm min-h-[200px]">
            <p className="text-zinc-600 text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Recommendations</h4>
          <div className="space-y-2">
            {result.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-zinc-100 rounded-xl shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-zinc-700">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Literature References */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Medical Literature & Resources</h4>
        <div className="space-y-2">
          {result.literatureReferences.map((ref, idx) => (
            <a
              key={idx}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all group"
            >
              <span className="text-sm font-medium text-zinc-800">{ref.title}</span>
              <ArrowRight size={16} className="text-zinc-300 group-hover:text-emerald-500 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 rounded-xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl transition-all"
      >
        Start New Assessment
      </button>
    </div>
  );
};
