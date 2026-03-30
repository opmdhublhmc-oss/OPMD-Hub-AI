import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const MedicalDisclaimer: React.FC = () => (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
    <div className="flex items-start">
      <AlertTriangle className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
      <div>
        <h3 className="text-amber-800 font-semibold text-sm uppercase tracking-wider">Medical Disclaimer</h3>
        <p className="text-amber-700 text-sm mt-1 leading-relaxed">
          This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your dentist, physician, or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this app.
        </p>
      </div>
    </div>
  </div>
);
