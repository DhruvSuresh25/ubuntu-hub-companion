import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Business {
  id: string;
  user_id: string;
  organization_id: string | null;
  name: string;
  description: string | null;
  category: string;
  logo_url: string | null;
  cover_image_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  social_links: Record<string, string>;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessDeal {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  discount_type: string | null;
  discount_value: number | null;
  start_date: string | null;
  end_date: string | null;
  terms: string | null;
  is_active: boolean;
  created_at: string;
}

export function useBusinesses() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchBusinesses = async (category?: string) => {
    setLoading(true);
    let query = supabase.from('businesses').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('name');
    setLoading(false);
    if (error) throw error;
    return data as Business[];
  };

  const fetchBusiness = async (id: string) => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Business | null;
  };

  const createBusiness = async (business: Omit<Business, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_verified' | 'is_active'>) => {
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await supabase
      .from('businesses')
      .insert({ ...business, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Business;
  };

  const updateBusiness = async (id: string, updates: Partial<Business>) => {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Business;
  };

  const fetchDeals = async (businessId?: string) => {
    let query = supabase.from('business_deals').select('*, businesses(name, logo_url)');
    if (businessId) {
      query = query.eq('business_id', businessId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const createDeal = async (deal: Omit<BusinessDeal, 'id' | 'created_at' | 'is_active'>) => {
    const { data, error } = await supabase
      .from('business_deals')
      .insert(deal)
      .select()
      .single();
    if (error) throw error;
    return data as BusinessDeal;
  };

  return {
    loading,
    fetchBusinesses,
    fetchBusiness,
    createBusiness,
    updateBusiness,
    fetchDeals,
    createDeal,
  };
}
