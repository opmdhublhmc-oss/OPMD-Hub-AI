import React from 'react';
import { RiskHabits } from '../types';
import { Check } from 'lucide-react';

interface Props {
  data: RiskHabits;
  onChange: (data: RiskHabits) => void;
  onNext: () => void;
  onBack: () => void;
}

export const RiskHabitsForm: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const habits = [
    { key: 'chewingTobacco', label: 'Chewing Tobacco / Pan Masala' },
    { key: 'smoking', label: 'Smoking (Cigarettes, Bidis, etc.)' },
    { key: 'arecaNut', label: 'Areca Nut / Betel Nut Use' },
    { key: 'sharpTeeth', label: 'Chronic Irritation from Sharp Teeth' },
    { key: 'illFittingDentures', label: 'Ill-fitting Dentures' },
    { key: 'poorHygiene', label: 'Poor Oral Hygiene' },
    { key: 'familyHistory', label: 'Family History of Oral Cancer' },
  ];

  const toggleHabit = (key: keyof RiskHabits) => {
    onChange({ ...data, [key]: !data[key] });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-3">
        {habits.map((habit) => (
          <button
            key={habit.key}
            onClick={() => toggleHabit(habit.key as keyof RiskHabits)}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              data[habit.key as keyof RiskHabits]
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
            }`}
          >
            <span className="font-medium">{habit.label}</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
              data[habit.key as keyof RiskHabits]
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-zinc-300'
            }`}>
              {data[habit.key as keyof RiskHabits] && <Check size={14} strokeWidth={3} />}
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-semibold bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-[2] py-4 rounded-xl font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg transition-all"
        >
          Continue to Image Upload
        </button>
      </div>
    </div>
  );
};
