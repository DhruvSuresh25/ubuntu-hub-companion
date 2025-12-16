-- Create business_cards table
CREATE TABLE public.business_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  profession TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  linkedin TEXT,
  twitter TEXT,
  instagram TEXT,
  bio TEXT,
  template TEXT NOT NULL DEFAULT 'elegant',
  primary_color TEXT NOT NULL DEFAULT '#1a1a2e',
  secondary_color TEXT NOT NULL DEFAULT '#16213e',
  accent_color TEXT NOT NULL DEFAULT '#e94560',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_cards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own business cards"
ON public.business_cards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business cards"
ON public.business_cards FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business cards"
ON public.business_cards FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business cards"
ON public.business_cards FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_business_cards_updated_at
  BEFORE UPDATE ON public.business_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();