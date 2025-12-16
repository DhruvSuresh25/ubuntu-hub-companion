import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  category: string;
  is_ticketed: boolean;
  ticket_price: number;
  max_attendees: number | null;
  status: string;
  created_at: string;
  registrations_count?: number;
  user_registered?: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  ticket_code: string | null;
  status: string;
  checked_in_at: string | null;
  created_at: string;
}

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
      return;
    }

    // Fetch registration counts and user registration status
    const eventsWithInfo = await Promise.all(
      (data || []).map(async (event) => {
        const { count } = await supabase
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id);

        let userRegistered = false;
        if (user) {
          const { data: userReg } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', event.id)
            .eq('user_id', user.id)
            .maybeSingle();
          userRegistered = !!userReg;
        }

        return {
          ...event,
          registrations_count: count || 0,
          user_registered: userRegistered
        };
      })
    );

    setEvents(eventsWithInfo);
    setLoading(false);
  };

  const createEvent = async (event: {
    title: string;
    description?: string;
    location?: string;
    start_date: string;
    end_date?: string;
    image_url?: string;
    category: string;
    is_ticketed: boolean;
    ticket_price?: number;
    max_attendees?: number;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        ...event
      })
      .select()
      .single();

    if (!error) await fetchEvents();
    return { error, data };
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const ticketCode = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const { error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        ticket_code: ticketCode
      });

    if (!error) await fetchEvents();
    return { error, ticketCode };
  };

  const cancelRegistration = async (eventId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (!error) await fetchEvents();
    return { error };
  };

  return { events, loading, createEvent, registerForEvent, cancelRegistration, refetch: fetchEvents };
}
