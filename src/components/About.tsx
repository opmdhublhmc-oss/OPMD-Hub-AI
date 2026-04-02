import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Users, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 py-8"
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">About OPMD Hub</h2>
        <p className="text-zinc-500 text-lg leading-relaxed">
          The National Resource Centre for Oral Potentially Malignant Disorders (OPMD) at Lady Hardinge Medical College is a pioneering initiative under the National Oral Health Program (NOHP), funded by the Ministry of Health and Family Welfare (MoHFW), Government of India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold">Our Mission</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            To reduce the burden of oral cancer in India through early detection, standardized assessment protocols, and comprehensive resource management for OPMDs.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold">Who We Serve</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            We provide support to healthcare professionals, researchers, and patients across the nation, serving as a central hub for clinical expertise and data-driven insights.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight">Key Objectives</h3>
        <div className="space-y-4">
          {[
            { title: "Standardization", desc: "Developing and implementing national guidelines for OPMD screening and management." },
            { title: "Capacity Building", desc: "Training healthcare providers in advanced diagnostic techniques and AI-assisted screening." },
            { title: "Research & Innovation", desc: "Leveraging cutting-edge technology like AI to improve diagnostic accuracy and patient outcomes." },
            { title: "Public Awareness", desc: "Educating the community about risk factors and the importance of regular oral health checkups." }
          ].map((obj, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex-shrink-0 w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-zinc-900">{obj.title}</h4>
                <p className="text-zinc-500 text-sm">{obj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
