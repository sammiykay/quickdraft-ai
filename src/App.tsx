import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ModeToggle from './components/ModeToggle';
import AIMode from './components/AIMode';
import ManualMode from './components/ManualMode';
import SavedDrafts from './components/SavedDrafts';
import ApiKeySetup from './components/ApiKeySetup';
import { useAuth } from './hooks/useAuth';

export type DraftMode = 'ai' | 'manual';
export type ToneType = 'professional' | 'friendly' | 'direct' | 'warm';

function App() {
  const [mode, setMode] = useState<DraftMode>('ai');
  const [showSaved, setShowSaved] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    // Check if API key exists
    const savedKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
    if (savedKey) {
      setHasApiKey(true);
      // Set global reference for the service
      (window as any).__GEMINI_API_KEY__ = savedKey;
    }
  }, []);

  const handleApiKeySet = () => {
    setHasApiKey(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header onShowSaved={() => setShowSaved(!showSaved)} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {mode === 'ai' && !hasApiKey && (
            <ApiKeySetup onApiKeySet={handleApiKeySet} />
          )}
          
          <ModeToggle mode={mode} onModeChange={setMode} />
          
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'ai' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {mode === 'ai' ? <AIMode /> : <ManualMode />}
          </motion.div>
        </motion.div>

        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <SavedDrafts onClose={() => setShowSaved(false)} />
          </motion.div>
        )}
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;