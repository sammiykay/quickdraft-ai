import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Save, Mail, Check, Heart } from 'lucide-react';
import { useDrafts } from '../hooks/useDrafts';
import { useAuth } from '../hooks/useAuth';
import { trackEvent } from '../services/analyticsService';
import toast from 'react-hot-toast';

interface DraftPreviewProps {
  content: string;
  title: string;
  mode: 'ai' | 'manual';
  tone?: 'professional' | 'friendly' | 'direct' | 'warm' | null;
  prompt?: string;
  templateId?: string;
}

const DraftPreview: React.FC<DraftPreviewProps> = ({ 
  content, 
  title, 
  mode, 
  tone, 
  prompt,
  templateId 
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { saveDraft } = useDrafts();
  const { user } = useAuth();

  React.useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      if (user) {
        await trackEvent({
          action_type: 'draft_copied',
          user_id: user.id,
          mode,
          tone,
          template_id: templateId,
        });
      }
      
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy text');
    }
  };

  const downloadAsTxt = () => {
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveAsDraft = async () => {
    if (!user) {
      toast.error('Please sign in to save drafts');
      return;
    }

    const draft = {
      title,
      content: editedContent,
      mode,
      tone,
      prompt: mode === 'ai' ? prompt : null,
      template_id: mode === 'manual' ? templateId : null,
      is_favorite: false,
    };

    const savedDraft = await saveDraft(draft);
    if (savedDraft) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const openInEmail = async () => {
    const subject = title.includes(':') ? title.split(':')[1].trim() : title;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(editedContent)}`;
    window.open(mailtoLink);
    
    if (user) {
      await trackEvent({
        action_type: 'draft_emailed',
        user_id: user.id,
        mode,
        tone,
        template_id: templateId,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-800">{title}</h3>
            {tone && (
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded mt-1 inline-block capitalize">
                {tone} tone
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
            
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveAsDraft}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
              >
                {saved ? <Check className="w-4 h-4 text-green-600" /> : <Save className="w-4 h-4" />}
                <span className="text-sm">{saved ? 'Saved!' : 'Save'}</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadAsTxt}
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openInEmail}
              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">Open in Email</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none font-mono text-sm"
          style={{ lineHeight: '1.6' }}
        />
      </div>
    </motion.div>
  );
};

export default DraftPreview;