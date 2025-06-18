import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      // Set environment variable for the session
      (window as any).__GEMINI_API_KEY__ = apiKey.trim();
      setIsValid(true);
      onApiKeySet();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveKey();
    }
  };

  if (isValid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
      >
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Gemini AI Connected</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Your API key is configured and ready to generate AI-powered drafts.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">Setup Gemini AI</h3>
      </div>
      
      <p className="text-blue-700 mb-4">
        To use AI-powered email drafting, you'll need a Gemini API key. Don't worry - it's stored locally and never sent to our servers.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your Gemini API key..."
              className="w-full p-3 pr-10 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <span>Get your free API key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveKey}
            disabled={!apiKey.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            Save & Continue
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKeySetup;