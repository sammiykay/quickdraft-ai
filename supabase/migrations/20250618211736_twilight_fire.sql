/*
  # Initial Schema for QuickDraft AI

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `drafts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `mode` (text: 'ai' or 'manual')
      - `tone` (text: 'professional', 'friendly', 'direct', 'warm')
      - `prompt` (text, for AI-generated drafts)
      - `template_id` (text, for manual drafts)
      - `is_favorite` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `usage_analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `action_type` (text: 'draft_generated', 'draft_saved', 'draft_copied', 'draft_emailed')
      - `mode` (text: 'ai' or 'manual')
      - `tone` (text, optional)
      - `template_id` (text, optional)
      - `created_at` (timestamp)
    
    - `api_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `tokens_used` (integer)
      - `cost_estimate` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data