export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drafts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mode: 'ai' | 'manual'
          tone: 'professional' | 'friendly' | 'direct' | 'warm' | null
          prompt: string | null
          template_id: string | null
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mode: 'ai' | 'manual'
          tone?: 'professional' | 'friendly' | 'direct' | 'warm' | null
          prompt?: string | null
          template_id?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mode?: 'ai' | 'manual'
          tone?: 'professional' | 'friendly' | 'direct' | 'warm' | null
          prompt?: string | null
          template_id?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usage_analytics: {
        Row: {
          id: string
          user_id: string
          action_type: 'draft_generated' | 'draft_saved' | 'draft_copied' | 'draft_emailed' | 'login' | 'signup'
          mode: 'ai' | 'manual' | null
          tone: 'professional' | 'friendly' | 'direct' | 'warm' | null
          template_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: 'draft_generated' | 'draft_saved' | 'draft_copied' | 'draft_emailed' | 'login' | 'signup'
          mode?: 'ai' | 'manual' | null
          tone?: 'professional' | 'friendly' | 'direct' | 'warm' | null
          template_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: 'draft_generated' | 'draft_saved' | 'draft_copied' | 'draft_emailed' | 'login' | 'signup'
          mode?: 'ai' | 'manual' | null
          tone?: 'professional' | 'friendly' | 'direct' | 'warm' | null
          template_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      api_usage: {
        Row: {
          id: string
          user_id: string
          tokens_used: number
          cost_estimate: number
          model_used: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tokens_used?: number
          cost_estimate?: number
          model_used?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tokens_used?: number
          cost_estimate?: number
          model_used?: string
          created_at?: string
        }
      }
    }
  }
}