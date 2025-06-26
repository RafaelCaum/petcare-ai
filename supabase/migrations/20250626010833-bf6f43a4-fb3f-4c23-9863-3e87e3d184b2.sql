
-- Create or update premium_users table
CREATE TABLE IF NOT EXISTS public.premium_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_payment TIMESTAMP WITH TIME ZONE NOT NULL,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'trial', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.premium_users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own premium status
CREATE POLICY "Users can view their own premium status" 
  ON public.premium_users 
  FOR SELECT 
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy for edge functions to manage premium users
CREATE POLICY "Edge functions can manage premium users" 
  ON public.premium_users 
  FOR ALL 
  USING (true);

-- Update existing users table to work with premium system
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Set trial period for existing users (7 days from now)
UPDATE public.users 
SET trial_ends_at = now() + interval '7 days'
WHERE trial_ends_at IS NULL;
