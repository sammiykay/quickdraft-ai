import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { trackEvent } from '../services/analyticsService';
import toast from 'react-hot-toast';

export interface Draft {
  id: string;
  title: string;
  content: string;
  mode: 'ai' | 'manual';
  tone?: 'professional' | 'friendly' | 'direct' | 'warm' | null;
  prompt?: string | null;
  template_id?: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export const useDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDrafts();
    } else {
      setDrafts([]);
      setLoading(false);
    }
  }, [user]);

  const fetchDrafts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast.error('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (draft: Omit<Draft, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please sign in to save drafts');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('drafts')
        .insert({
          ...draft,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => [data, ...prev]);
      
      // Track the save event
      await trackEvent({
        action_type: 'draft_saved',
        user_id: user.id,
        mode: draft.mode,
        tone: draft.tone,
        template_id: draft.template_id,
      });

      toast.success('Draft saved successfully!');
      return data;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
      return null;
    }
  };

  const updateDraft = async (id: string, updates: Partial<Draft>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('drafts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => prev.map(draft => 
        draft.id === id ? { ...draft, ...data } : draft
      ));

      return data;
    } catch (error) {
      console.error('Error updating draft:', error);
      toast.error('Failed to update draft');
      return null;
    }
  };

  const deleteDraft = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDrafts(prev => prev.filter(draft => draft.id !== id));
      toast.success('Draft deleted');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
  };

  const toggleFavorite = async (id: string) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft) return;

    await updateDraft(id, { is_favorite: !draft.is_favorite });
  };

  return {
    drafts,
    loading,
    saveDraft,
    updateDraft,
    deleteDraft,
    toggleFavorite,
    refetch: fetchDrafts,
  };
};