
-- Primeiro, verificar e remover a coluna status se ela existir
ALTER TABLE vaccinations DROP COLUMN IF EXISTS status;

-- Criar um tipo enum para status das vacinas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vaccination_status') THEN
        CREATE TYPE vaccination_status AS ENUM ('completed', 'pending', 'overdue');
    END IF;
END $$;

-- Adicionar a coluna status com o tipo enum correto
ALTER TABLE vaccinations ADD COLUMN status vaccination_status DEFAULT 'pending';

-- Adicionar índices para melhor performance nas consultas filtradas por user_email
CREATE INDEX IF NOT EXISTS idx_vaccinations_user_email ON vaccinations(user_email);
CREATE INDEX IF NOT EXISTS idx_pets_user_email ON pets(user_email);
CREATE INDEX IF NOT EXISTS idx_expenses_user_email ON expenses(user_email);
CREATE INDEX IF NOT EXISTS idx_reminders_user_email ON reminders(user_email);

-- Adicionar índices compostos para consultas mais complexas
CREATE INDEX IF NOT EXISTS idx_vaccinations_user_next_due ON vaccinations(user_email, next_due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_date ON reminders(user_email, date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_email, date);
