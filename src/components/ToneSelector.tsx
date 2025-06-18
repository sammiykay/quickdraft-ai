import React from 'react';
import { motion } from 'framer-motion';
import { ToneType } from '../App';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
  className?: string;
}

const tones: { value: ToneType; label: string; color: string }[] = [
  { value: 'professional', label: 'Professional', color: 'blue' },
  { value: 'friendly', label: 'Friendly', color: 'green' },
  { value: 'direct', label: 'Direct', color: 'orange' },
  { value: 'warm', label: 'Warm', color: 'pink' },
];

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onToneChange, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-slate-700">Tone</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tones.map((tone) => (
          <motion.button
            key={tone.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToneChange(tone.value)}
            className={`p-3 rounded-lg border-2 font-medium text-sm transition-all ${
              selectedTone === tone.value
                ? `border-${tone.color}-500 bg-${tone.color}-50 text-${tone.color}-700`
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {tone.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;