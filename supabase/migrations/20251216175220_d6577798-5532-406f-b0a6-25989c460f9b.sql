-- Create fundraising_campaigns table
CREATE TABLE public.fundraising_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  story TEXT,
  image_url TEXT,
  goal_amount DECIMAL(12, 2) NOT NULL,
  raised_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'community',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.fundraising_campaigns(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.fundraising_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Anyone can view active campaigns"
ON public.fundraising_campaigns
FOR SELECT
USING (status = 'active');

CREATE POLICY "Users can view their own campaigns"
ON public.fundraising_campaigns
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create campaigns"
ON public.fundraising_campaigns
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
ON public.fundraising_campaigns
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
ON public.fundraising_campaigns
FOR DELETE
USING (auth.uid() = user_id);

-- Donations policies
CREATE POLICY "Anyone can view donations for active campaigns"
ON public.donations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.fundraising_campaigns
  WHERE id = campaign_id AND status = 'active'
));

CREATE POLICY "Authenticated users can donate"
ON public.donations
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = donor_id);

-- Function to update raised amount when donation is made
CREATE OR REPLACE FUNCTION public.update_campaign_raised_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.fundraising_campaigns
  SET raised_amount = raised_amount + NEW.amount,
      updated_at = now()
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$;

-- Trigger to update raised amount on new donation
CREATE TRIGGER on_donation_created
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_raised_amount();

-- Trigger to update timestamps
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.fundraising_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();