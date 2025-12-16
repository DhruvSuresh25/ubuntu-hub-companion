import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface VolunteerOpportunity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string | null;
  duration: string | null;
  skills_needed: string[] | null;
  spots_available: number | null;
  spots_filled: number;
  status: string;
  created_at: string;
  user_signed_up?: boolean;
}

export interface VolunteerSignup {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: string;
  message: string | null;
  created_at: string;
}

export function useVolunteers() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, [user]);

  const fetchOpportunities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching opportunities:', error);
      setLoading(false);
      return;
    }

    // Check if user has signed up
    const oppsWithSignup = await Promise.all(
      (data || []).map(async (opp) => {
        let userSignedUp = false;
        if (user) {
          const { data: signup } = await supabase
            .from('volunteer_signups')
            .select('id')
            .eq('opportunity_id', opp.id)
            .eq('user_id', user.id)
            .maybeSingle();
          userSignedUp = !!signup;
        }
        return { ...opp, user_signed_up: userSignedUp };
      })
    );

    setOpportunities(oppsWithSignup);
    setLoading(false);
  };

  const createOpportunity = async (opportunity: {
    title: string;
    description?: string;
    location?: string;
    date?: string;
    duration?: string;
    skills_needed?: string[];
    spots_available?: number;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .insert({
        user_id: user.id,
        ...opportunity
      })
      .select()
      .single();

    if (!error) await fetchOpportunities();
    return { error, data };
  };

  const signUp = async (opportunityId: string, message?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('volunteer_signups')
      .insert({
        opportunity_id: opportunityId,
        user_id: user.id,
        message
      });

    if (!error) {
      // Update spots_filled
      const { data: opp } = await supabase
        .from('volunteer_opportunities')
        .select('spots_filled')
        .eq('id', opportunityId)
        .single();
      
      if (opp) {
        await supabase
          .from('volunteer_opportunities')
          .update({ spots_filled: opp.spots_filled + 1 })
          .eq('id', opportunityId);
      }
      
      await fetchOpportunities();
    }
    return { error };
  };

  const cancelSignup = async (opportunityId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('volunteer_signups')
      .delete()
      .eq('opportunity_id', opportunityId)
      .eq('user_id', user.id);

    if (!error) {
      // Update spots_filled
      const { data: opp } = await supabase
        .from('volunteer_opportunities')
        .select('spots_filled')
        .eq('id', opportunityId)
        .single();
      
      if (opp && opp.spots_filled > 0) {
        await supabase
          .from('volunteer_opportunities')
          .update({ spots_filled: opp.spots_filled - 1 })
          .eq('id', opportunityId);
      }
      
      await fetchOpportunities();
    }
    return { error };
  };

  return { opportunities, loading, createOpportunity, signUp, cancelSignup, refetch: fetchOpportunities };
}
