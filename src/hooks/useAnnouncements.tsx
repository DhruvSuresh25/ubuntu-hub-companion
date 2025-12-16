import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Announcement {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  is_pinned: boolean;
  image_url: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
    } else {
      // Filter out expired announcements
      const validAnnouncements = (data || []).filter(a => 
        !a.expires_at || new Date(a.expires_at) > new Date()
      );
      setAnnouncements(validAnnouncements);
    }
    setLoading(false);
  };

  const createAnnouncement = async (announcement: {
    title: string;
    content: string;
    category?: string;
    priority?: string;
    is_pinned?: boolean;
    image_url?: string;
    expires_at?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        user_id: user.id,
        ...announcement
      })
      .select()
      .single();

    if (!error) await fetchAnnouncements();
    return { error, data };
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) await fetchAnnouncements();
    return { error };
  };

  const deleteAnnouncement = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) await fetchAnnouncements();
    return { error };
  };

  return { announcements, loading, createAnnouncement, updateAnnouncement, deleteAnnouncement, refetch: fetchAnnouncements };
}
