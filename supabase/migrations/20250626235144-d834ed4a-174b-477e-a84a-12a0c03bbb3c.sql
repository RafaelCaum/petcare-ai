
-- Update pets table with new fields
ALTER TABLE pets 
ADD COLUMN IF NOT EXISTS vacinado_status TEXT CHECK (vacinado_status IN ('sim', 'nao', 'nao_sei')),
ADD COLUMN IF NOT EXISTS data_ultima_vacina DATE,
ADD COLUMN IF NOT EXISTS temperamento TEXT CHECK (temperamento IN ('calmo', 'medroso', 'bravo')),
ADD COLUMN IF NOT EXISTS tem_condicao BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS qual_condicao TEXT;

-- Drop zapier_webhooks table as it's no longer needed
DROP TABLE IF EXISTS zapier_webhooks;

-- Create a table for n8n webhook configurations
CREATE TABLE IF NOT EXISTS n8n_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  webhook_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
