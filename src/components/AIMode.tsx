import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, AlertCircle } from 'lucide-react';
import ToneSelector from './ToneSelector';
import DraftPreview from './DraftPreview';
import { ToneType } from '../App';
import { generateEmailDraft } from '../services/geminiService';
import { trackEvent } from '../services/analyticsService';
import { useAuth } from '../hooks/useAuth';

const AIMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [draft, setDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  const handleGenerateDraft = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      const generatedDraft = await generateEmailDraft({ prompt, tone });
      setDraft(generatedDraft);
      
      // Track the generation event
      if (user) {
        await trackEvent({
          action_type: 'draft_generated',
          user_id: user.id,
          mode: 'ai',
          tone,
          metadata: { prompt_length: prompt.length },
        });
      }
    } catch (err) {
      setError('Failed to generate draft. Please try again.');
      console.error('Draft generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerateDraft();
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-800">AI-Powered Draft</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What do you need to communicate?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="e.g., reschedule team meeting, request deadline extension, follow up on proposal..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              rows={3}
            />
            <p className="text-xs text-slate-500 mt-1">
              Press Cmd/Ctrl + Enter to generate
            </p>
          </div>
          
          <ToneSelector selectedTone={tone} onToneChange={setTone} />
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateDraft}
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating draft...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Generate Draft</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
      
      {draft && (
        <DraftPreview
          content={draft}
          title={`AI Draft: ${prompt}`}
          mode="ai"
          tone={tone}
          prompt={prompt}
        />
      )}
    </div>
  );
};

export default AIMode;