
-- Create a storage bucket for pet photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-photos', 'pet-photos', true);

-- Create storage policies for pet photos bucket
CREATE POLICY "Anyone can view pet photos" ON storage.objects
FOR SELECT USING (bucket_id = 'pet-photos');

CREATE POLICY "Users can upload pet photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pet-photos');

CREATE POLICY "Users can update their pet photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'pet-photos');

CREATE POLICY "Users can delete their pet photos" ON storage.objects
FOR DELETE USING (bucket_id = 'pet-photos');

-- Add photo_url column to pets table
ALTER TABLE pets ADD COLUMN photo_url TEXT;
