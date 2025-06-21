
-- Create a storage bucket for user photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true);

-- Create storage policies for user photos bucket
CREATE POLICY "Anyone can view user photos" ON storage.objects
FOR SELECT USING (bucket_id = 'user-photos');

CREATE POLICY "Users can upload user photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-photos');

CREATE POLICY "Users can update their user photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'user-photos');

CREATE POLICY "Users can delete their user photos" ON storage.objects
FOR DELETE USING (bucket_id = 'user-photos');
