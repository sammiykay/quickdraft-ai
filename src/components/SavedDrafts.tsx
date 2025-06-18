import React from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Copy, Mail, Calendar, Heart, HeartOff } from 'lucide-react';
import { useDrafts } from '../hooks/useDrafts';
import { useAuth } from '../hooks/useAuth';
import { trackEvent } from '../services/analyticsService';
import toast from 'react-hot-toast';

interface SavedDraftsProps {
  onClose: () => void;
}

const SavedDrafts: React.FC<SavedDraftsProps> = ({ onClose }) => {
  const { drafts, deleteDraft, toggleFavorite, loading } = useDrafts();
  const { user } = useAuth();

  const copyToClipboard = async (content: string, draftId: string, mode: 'ai' | 'manual', tone?: string | null) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
      
      if (user) {
        await trackEvent({
          action_type: 'draft_copied',
          user_id: user.id,
          mode,
          tone: tone as any,
        });
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy text');
    }
  };

  const openInEmail = async (draft: any) => {
    const subject = draft.title.includes(':') ? draft.title.split(':')[1].trim() : draft.title;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft.content)}`;
    window.open(mailtoLink);
    
    if (user) {
      await trackEvent({
        action_type: 'draft_emailed',
        user_id: user.id,
        mode: draft.mode,
        tone: draft.tone,
      });
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading drafts...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">My Saved Drafts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          {drafts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No saved drafts yet.</p>
              <p className="text-sm text-slate-400 mt-1">Start creating drafts to see them here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 mb-1">{draft.title}</h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(draft.created_at).toLocaleDateString()}</span>
                        {draft.tone && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{draft.tone} tone</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">{draft.mode} mode</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleFavorite(draft.id)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                        title={draft.is_favorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {draft.is_favorite ? (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        ) : (
                          <HeartOff className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(draft.content, draft.id, draft.mode, draft.tone)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => openInEmail(draft)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                        title="Open in email"
                      >
                        <Mail className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded border p-3">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-3">
                      {draft.content.slice(0, 200)}
                      {draft.content.length > 200 && '...'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SavedDrafts;