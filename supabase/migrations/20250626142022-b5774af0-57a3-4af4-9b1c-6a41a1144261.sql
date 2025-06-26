
-- Add payment-related fields to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_paying BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS next_due_date DATE;

-- Update the comment to reflect the new fields
COMMENT ON COLUMN public.users.is_paying IS 'Indicates if user has active paid subscription';
COMMENT ON COLUMN public.users.next_due_date IS 'Next payment due date for subscription';
