
-- Create table for VetCare AI queries
CREATE TABLE public.vet_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  pet_id TEXT,
  pergunta TEXT NOT NULL,
  resposta TEXT,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.vet_queries ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own queries
CREATE POLICY "Users can view their own vet queries" 
  ON public.vet_queries 
  FOR SELECT 
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy for users to insert their own queries
CREATE POLICY "Users can create their own vet queries" 
  ON public.vet_queries 
  FOR INSERT 
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy for users to update their own queries
CREATE POLICY "Users can update their own vet queries" 
  ON public.vet_queries 
  FOR UPDATE 
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');
