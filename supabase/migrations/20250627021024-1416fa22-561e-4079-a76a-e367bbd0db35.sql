
-- Deletar todos os dados das tabelas (em ordem para evitar conflitos de foreign key)
DELETE FROM public.vet_queries;
DELETE FROM public.vaccinations;
DELETE FROM public.expenses;
DELETE FROM public.reminders;
DELETE FROM public.pets;
DELETE FROM public.premium_users;
DELETE FROM public.n8n_webhooks;
DELETE FROM public.users;

-- Limpar storage buckets se necessário
DELETE FROM storage.objects WHERE bucket_id IN ('pet-photos', 'user-photos');
