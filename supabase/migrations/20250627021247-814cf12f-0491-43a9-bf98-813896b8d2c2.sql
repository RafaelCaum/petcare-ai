
-- Primeiro, remover todas as políticas RLS
DROP POLICY IF EXISTS "Users can view their own vet queries" ON public.vet_queries;
DROP POLICY IF EXISTS "Users can create their own vet queries" ON public.vet_queries;
DROP POLICY IF EXISTS "Users can update their own vet queries" ON public.vet_queries;
DROP POLICY IF EXISTS "Users can view their own premium status" ON public.premium_users;
DROP POLICY IF EXISTS "Edge functions can manage premium users" ON public.premium_users;
DROP POLICY IF EXISTS "Users can view their own webhooks" ON public.n8n_webhooks;
DROP POLICY IF EXISTS "Users can create their own webhooks" ON public.n8n_webhooks;
DROP POLICY IF EXISTS "Users can update their own webhooks" ON public.n8n_webhooks;
DROP POLICY IF EXISTS "Users can delete their own webhooks" ON public.n8n_webhooks;

-- Deletar todas as tabelas em ordem (para evitar problemas de foreign key)
DROP TABLE IF EXISTS public.vet_queries CASCADE;
DROP TABLE IF EXISTS public.vaccinations CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.reminders CASCADE;
DROP TABLE IF EXISTS public.pets CASCADE;
DROP TABLE IF EXISTS public.premium_users CASCADE;
DROP TABLE IF EXISTS public.n8n_webhooks CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Deletar o enum personalizado
DROP TYPE IF EXISTS public.vaccination_status CASCADE;

-- Limpar completamente os storage buckets
DELETE FROM storage.objects WHERE bucket_id IN ('pet-photos', 'user-photos');
DROP POLICY IF EXISTS "Anyone can view pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view user photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload user photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their user photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their user photos" ON storage.objects;

-- Remover os buckets completamente
DELETE FROM storage.buckets WHERE id IN ('pet-photos', 'user-photos');
