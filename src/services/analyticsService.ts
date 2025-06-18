import { supabase } from '../lib/supabase';

export interface AnalyticsEvent {
  action_type: 'draft_generated' | 'draft_saved' | 'draft_copied' | 'draft_emailed' | 'login' | 'signup';
  user_id: string;
  mode?: 'ai' | 'manual' | null;
  tone?: 'professional' | 'friendly' | 'direct' | 'warm' | null;
  template_id?: string | null;
  metadata?: Record<string, any>;
}

export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    const { error } = await supabase
      .from('usage_analytics')
      .insert({
        ...event,
        metadata: event.metadata || {},
      });

    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

export const trackApiUsage = async (userId: string, tokensUsed: number, costEstimate: number) => {
  try {
    const { error } = await supabase
      .from('api_usage')
      .insert({
        user_id: userId,
        tokens_used: tokensUsed,
        cost_estimate: costEstimate,
        model_used: 'gemini-2.0-flash-exp',
      });

    if (error) {
      console.error('API usage tracking error:', error);
    }
  } catch (error) {
    console.error('Failed to track API usage:', error);
  }
};

export const getAnalytics = async (userId: string, days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('usage_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
};

export const getApiUsageStats = async (userId: string, days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('api_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching API usage stats:', error);
    return [];
  }
};