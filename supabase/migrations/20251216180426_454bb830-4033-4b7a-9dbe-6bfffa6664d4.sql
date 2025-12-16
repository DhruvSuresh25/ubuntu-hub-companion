-- =====================
-- POLLS & SURVEYS
-- =====================
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  poll_type TEXT NOT NULL DEFAULT 'single', -- 'single', 'multiple'
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'closed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, user_id, option_id)
);

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active polls" ON public.polls FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own polls" ON public.polls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create polls" ON public.polls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own polls" ON public.polls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own polls" ON public.polls FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view poll options" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Poll owners can manage options" ON public.poll_options FOR ALL USING (
  EXISTS (SELECT 1 FROM public.polls WHERE id = poll_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view votes" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their votes" ON public.poll_votes FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- MEMBER DIRECTORY (enhance profiles)
-- =====================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view public profiles" ON public.profiles FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- =====================
-- FACILITY BOOKING
-- =====================
CREATE TABLE public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  capacity INTEGER,
  amenities TEXT[],
  hourly_rate NUMERIC DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.facility_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active facilities" ON public.facilities FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view bookings" ON public.facility_bookings FOR SELECT USING (true);
CREATE POLICY "Users can create bookings" ON public.facility_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their bookings" ON public.facility_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their bookings" ON public.facility_bookings FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- ENHANCED EVENTS
-- =====================
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_ticketed BOOLEAN NOT NULL DEFAULT false,
  ticket_price NUMERIC DEFAULT 0,
  max_attendees INTEGER,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  ticket_code TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'registered', -- 'registered', 'checked_in', 'cancelled'
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.event_sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  tier TEXT NOT NULL DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their events" ON public.events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their events" ON public.events FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view registrations" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "Users can register" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their registration" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view sponsors" ON public.event_sponsors FOR SELECT USING (true);
CREATE POLICY "Event owners can manage sponsors" ON public.event_sponsors FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND user_id = auth.uid())
);

-- =====================
-- VOLUNTEER OPPORTUNITIES (enhanced)
-- =====================
CREATE TABLE public.volunteer_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TIMESTAMP WITH TIME ZONE,
  duration TEXT,
  skills_needed TEXT[],
  spots_available INTEGER,
  spots_filled INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'filled', 'closed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.volunteer_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view opportunities" ON public.volunteer_opportunities FOR SELECT USING (true);
CREATE POLICY "Users can create opportunities" ON public.volunteer_opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their opportunities" ON public.volunteer_opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their opportunities" ON public.volunteer_opportunities FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view signups" ON public.volunteer_signups FOR SELECT USING (true);
CREATE POLICY "Users can signup" ON public.volunteer_signups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their signup" ON public.volunteer_signups FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their signup" ON public.volunteer_signups FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- ANNOUNCEMENTS (enhanced)
-- =====================
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Users can create announcements" ON public.announcements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their announcements" ON public.announcements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their announcements" ON public.announcements FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON public.polls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON public.facilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_facility_bookings_updated_at BEFORE UPDATE ON public.facility_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_volunteer_opportunities_updated_at BEFORE UPDATE ON public.volunteer_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();