import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Group {
  id: string;
  organization_id: string | null;
  name: string;
  description: string | null;
  group_type: string;
  image_url: string | null;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export function useGroups() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name');
    setLoading(false);
    if (error) throw error;
    return data as Group[];
  };

  const fetchGroup = async (id: string) => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Group | null;
  };

  const createGroup = async (group: Omit<Group, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'is_active'>) => {
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await supabase
      .from('groups')
      .insert({ ...group, created_by: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Group;
  };

  const joinGroup = async (groupId: string, role: string = 'member') => {
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: user.id, role })
      .select()
      .single();
    if (error) throw error;
    return data as GroupMember;
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) throw new Error('Must be logged in');
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);
    if (error) throw error;
  };

  const fetchGroupMembers = async (groupId: string) => {
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId);
    if (error) throw error;
    return data as GroupMember[];
  };

  return {
    loading,
    fetchGroups,
    fetchGroup,
    createGroup,
    joinGroup,
    leaveGroup,
    fetchGroupMembers,
  };
}
