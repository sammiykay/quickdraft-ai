import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, BarChart3, Crown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDrafts } from '../../hooks/useDrafts';
import toast from 'react-hot-toast';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const { drafts } = useDrafts();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalDrafts: drafts.length,
    aiDrafts: drafts.filter(d => d.mode === 'ai').length,
    manualDrafts: drafts.filter(d => d.mode === 'manual').length,
    favorites: drafts.filter(d => d.is_favorite).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-6 z-50"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">
            {user?.user_metadata?.full_name || user?.email}
          </h3>
          <p className="text-sm text-slate-600">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">{stats.totalDrafts}</div>
          <div className="text-xs text-slate-600">Total Drafts</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{stats.aiDrafts}</div>
          <div className="text-xs text-slate-600">AI Generated</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-emerald-600">{stats.manualDrafts}</div>
          <div className="text-xs text-slate-600">From Templates</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-amber-600">{stats.favorites}</div>
          <div className="text-xs text-slate-600">Favorites</div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <Settings className="w-4 h-4 text-slate-600" />
          <span className="text-slate-700">Account Settings</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <BarChart3 className="w-4 h-4 text-slate-600" />
          <span className="text-slate-700">Usage Analytics</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <Crown className="w-4 h-4 text-slate-600" />
          <span className="text-slate-700">Upgrade Plan</span>
        </button>
      </div>

      <button
        onClick={handleSignOut}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
      </button>
    </motion.div>
  );
};

export default UserProfile;