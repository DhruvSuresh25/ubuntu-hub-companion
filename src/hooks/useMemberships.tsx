import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface MembershipPlan {
  id: string;
  organization_id: string | null;
  name: string;
  description: string | null;
  price: number;
  duration_months: number;
  plan_type: string;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  organization_id: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export function useMemberships() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchPlans = async (organizationId?: string) => {
    setLoading(true);
    let query = supabase.from('membership_plans').select('*');
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    const { data, error } = await query.order('price');
    setLoading(false);
    if (error) throw error;
    return data as MembershipPlan[];
  };

  const fetchMySubscriptions = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('member_subscriptions')
      .select('*, membership_plans(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const subscribe = async (planId: string, organizationId?: string) => {
    if (!user) throw new Error('Must be logged in');
    
    // Get plan details for end date calculation
    const { data: plan } = await supabase
      .from('membership_plans')
      .select('duration_months')
      .eq('id', planId)
      .single();
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan?.duration_months || 12));

    const { data, error } = await supabase
      .from('member_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        organization_id: organizationId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        payment_status: 'pending'
      })
      .select()
      .single();
    if (error) throw error;
    return data as MemberSubscription;
  };

  return {
    loading,
    fetchPlans,
    fetchMySubscriptions,
    subscribe,
  };
}
