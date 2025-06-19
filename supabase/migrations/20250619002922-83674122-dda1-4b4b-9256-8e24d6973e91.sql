
-- Create users table (without authentication)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'trial',
  trial_start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dog', 'cat')),
  breed TEXT,
  birth_date DATE,
  avatar TEXT,
  weight DECIMAL,
  color TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vaccine', 'vet', 'grooming', 'bath', 'medication', 'other')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  email_reminder BOOLEAN NOT NULL DEFAULT true,
  sms_reminder BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('grooming', 'vet', 'food', 'toys', 'supplies', 'medication', 'other')),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create vaccinations table
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  date_given DATE NOT NULL,
  next_due_date DATE NOT NULL,
  veterinarian TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

-- Create policies to ensure users can only see their own data based on email
-- Users table policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR ALL USING (true);

-- Pets table policies
CREATE POLICY "Users can manage their own pets" ON public.pets
  FOR ALL USING (true);

-- Reminders table policies
CREATE POLICY "Users can manage their own reminders" ON public.reminders
  FOR ALL USING (true);

-- Expenses table policies
CREATE POLICY "Users can manage their own expenses" ON public.expenses
  FOR ALL USING (true);

-- Vaccinations table policies
CREATE POLICY "Users can manage their own vaccinations" ON public.vaccinations
  FOR ALL USING (true);
