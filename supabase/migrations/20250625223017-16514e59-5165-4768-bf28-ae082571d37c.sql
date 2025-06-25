
-- Criar tabela para armazenar webhooks do Zapier
CREATE TABLE public.zapier_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  webhook_type TEXT NOT NULL CHECK (webhook_type IN ('confirmation', 'reminder')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para garantir que usuários vejam apenas seus próprios webhooks
ALTER TABLE public.zapier_webhooks ENABLE ROW LEVEL SECURITY;

-- Política para SELECT
CREATE POLICY "Users can view their own webhooks" 
  ON public.zapier_webhooks 
  FOR SELECT 
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para INSERT
CREATE POLICY "Users can create their own webhooks" 
  ON public.zapier_webhooks 
  FOR INSERT 
  WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para UPDATE
CREATE POLICY "Users can update their own webhooks" 
  ON public.zapier_webhooks 
  FOR UPDATE 
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para DELETE
CREATE POLICY "Users can delete their own webhooks" 
  ON public.zapier_webhooks 
  FOR DELETE 
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
