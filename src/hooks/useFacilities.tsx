import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Facility {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  capacity: number | null;
  amenities: string[] | null;
  hourly_rate: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FacilityBooking {
  id: string;
  facility_id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  facility?: Facility;
}

export function useFacilities() {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
    fetchBookings();
  }, [user]);

  const fetchFacilities = async () => {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('facility_bookings')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      // Attach facility info
      const bookingsWithFacility = await Promise.all(
        (data || []).map(async (booking) => {
          const { data: facility } = await supabase
            .from('facilities')
            .select('*')
            .eq('id', booking.facility_id)
            .single();
          return { ...booking, facility };
        })
      );
      setBookings(bookingsWithFacility);
    }
  };

  const createBooking = async (booking: {
    facility_id: string;
    title: string;
    start_time: string;
    end_time: string;
    notes?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('facility_bookings')
      .insert({
        user_id: user.id,
        ...booking
      })
      .select()
      .single();

    if (!error) await fetchBookings();
    return { error, data };
  };

  const cancelBooking = async (bookingId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('facility_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('user_id', user.id);

    if (!error) await fetchBookings();
    return { error };
  };

  const checkAvailability = (facilityId: string, startTime: Date, endTime: Date) => {
    return !bookings.some(booking => 
      booking.facility_id === facilityId &&
      booking.status !== 'cancelled' &&
      new Date(booking.start_time) < endTime &&
      new Date(booking.end_time) > startTime
    );
  };

  return { 
    facilities, 
    bookings, 
    loading, 
    createBooking, 
    cancelBooking, 
    checkAvailability,
    refetch: () => { fetchFacilities(); fetchBookings(); }
  };
}
