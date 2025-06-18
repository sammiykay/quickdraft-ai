import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Archive, User, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './Auth/AuthModal';
import UserProfile from './Dashboard/UserProfile';

interface HeaderProps {
  onShowSaved: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowSaved }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">QuickDraft AI</h1>
            <p className="text-slate-600 text-sm">Professional email drafting made simple</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowSaved}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <Archive className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 font-medium">My Drafts</span>
            </motion.button>
          )}

          {user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserProfile(!showUserProfile)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">
                  {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                </span>
              </motion.button>

              <AnimatePresence>
                {showUserProfile && (
                  <UserProfile onClose={() => setShowUserProfile(false)} />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Sign In</span>
            </motion.button>
          )}
        </div>
      </motion.header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;