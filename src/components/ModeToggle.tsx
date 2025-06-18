import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileText } from 'lucide-react';
import { DraftMode } from '../App';

interface ModeToggleProps {
  mode: DraftMode;
  onModeChange: (mode: DraftMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200 max-w-md mx-auto">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onModeChange('ai')}
        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors relative ${
          mode === 'ai'
            ? 'text-blue-600 bg-blue-50'
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        {mode === 'ai' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-blue-50 rounded-lg"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Bot className="w-4 h-4 relative z-10" />
        <span className="relative z-10">AI Powered</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onModeChange('manual')}
        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors relative ${
          mode === 'manual'
            ? 'text-emerald-600 bg-emerald-50'
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        {mode === 'manual' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-emerald-50 rounded-lg"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <FileText className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Templates</span>
      </motion.button>
    </div>
  );
};

export default ModeToggle;