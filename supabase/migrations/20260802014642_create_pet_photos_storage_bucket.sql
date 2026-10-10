/*
# Create pet-photos storage bucket + policies

1. Storage
- Create a private bucket "pet-photos" for user pet photo uploads.
- The bucket is private — files are only accessible by the owning user.

2. Storage Policies
- SELECT: users can read only files in their own folder (user_id/<path>)
- INSERT: users can upload only to their own folder
- UPDATE: users can update only files in their own folder
- DELETE: users can delete only files in their own folder
- Folder structure: pet-photos/<user_id>/<filename>
*/
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pet-photos',
  'pet-photos',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "read_own_pet_photos" ON storage.objects;
CREATE POLICY "read_own_pet_photos" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'pet-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "upload_own_pet_photos" ON storage.objects;
CREATE POLICY "upload_own_pet_photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'pet-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "update_own_pet_photos" ON storage.objects;
CREATE POLICY "update_own_pet_photos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'pet-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'pet-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "delete_own_pet_photos" ON storage.objects;
CREATE POLICY "delete_own_pet_photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'pet-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
