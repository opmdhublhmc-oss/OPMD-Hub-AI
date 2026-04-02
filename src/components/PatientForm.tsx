import React from 'react';
import { PatientInfo } from '../types';

interface Props {
  data: PatientInfo;
  onChange: (data: PatientInfo) => void;
  onNext: () => void;
}

export const PatientForm: React.FC<Props> = ({ data, onChange, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const isComplete = data.name && data.age && data.region && data.nation;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Full Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
            placeholder="Firstname Lastname"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Age</label>
          <input
            type="number"
            name="age"
            value={data.age}
            onChange={handleChange}
            className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
            placeholder="25"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Region/State</label>
          <input
            type="text"
            name="region"
            value={data.region}
            onChange={handleChange}
            className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
            placeholder="Delhi"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Nation</label>
          <input
            type="text"
            name="nation"
            value={data.nation}
            onChange={handleChange}
            className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
            placeholder="India"
          />
        </div>
      </div>
      <button
        onClick={onNext}
        disabled={!isComplete}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          isComplete 
            ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg' 
            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
        }`}
      >
        Continue to Risk Assessment
      </button>
    </div>
  );
};
