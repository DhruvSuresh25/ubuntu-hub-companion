import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Member {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  occupation: string | null;
  interests: string[] | null;
  is_public: boolean;
  email: string | null;
  created_at: string;
}

export function useMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');

    if (error) {
      console.error('Error fetching members:', error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    occupation?: string;
    interests?: string[];
    is_public?: boolean;
    email?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error) await fetchMembers();
    return { error, data };
  };

  const searchMembers = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return members.filter(member => 
      member.full_name?.toLowerCase().includes(lowerQuery) ||
      member.occupation?.toLowerCase().includes(lowerQuery) ||
      member.location?.toLowerCase().includes(lowerQuery) ||
      member.interests?.some(i => i.toLowerCase().includes(lowerQuery))
    );
  };

  return { members, loading, updateProfile, searchMembers, refetch: fetchMembers };
}
