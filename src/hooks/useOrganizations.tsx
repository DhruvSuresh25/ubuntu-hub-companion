import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  owner_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useOrganizations() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) throw error;
    return data as Organization[];
  };

  const fetchOrganization = async (id: string) => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Organization | null;
  };

  const createOrganization = async (org: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'owner_id' | 'is_active'>) => {
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await supabase
      .from('organizations')
      .insert({ ...org, owner_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Organization;
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>) => {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Organization;
  };

  const fetchChapters = async (organizationId: string) => {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');
    if (error) throw error;
    return data as Chapter[];
  };

  const createChapter = async (chapter: Omit<Chapter, 'id' | 'created_at' | 'updated_at' | 'is_active'>) => {
    const { data, error } = await supabase
      .from('chapters')
      .insert(chapter)
      .select()
      .single();
    if (error) throw error;
    return data as Chapter;
  };

  return {
    loading,
    fetchOrganizations,
    fetchOrganization,
    createOrganization,
    updateOrganization,
    fetchChapters,
    createChapter,
  };
}
