-- Migration: Create Community Messages table for multi-user cross-account synchronization
-- Run this in your Supabase SQL Editor if not automatically applied

CREATE TABLE IF NOT EXISTS public.community_messages (
    id TEXT PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_rank TEXT DEFAULT 'Novice Companion',
    sender_xp INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    is_announcement BOOLEAN DEFAULT FALSE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/authenticated) to read messages
CREATE POLICY "Public read community messages"
    ON public.community_messages
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert their own messages
CREATE POLICY "Authenticated users can post community messages"
    ON public.community_messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Allow admins or author to delete messages
CREATE POLICY "Author or Admin can delete messages"
    ON public.community_messages
    FOR DELETE
    USING (
        auth.uid() = sender_id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'full_admin', 'owner')
        )
    );

-- Enable realtime broadcasting for community_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;

