
-- إنشاء bucket activity-files إذا لم يكن موجوداً
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('activity-files', 'activity-files', true, 52428800, ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

-- حذف جميع السياسات الموجودة للـ storage
DROP POLICY IF EXISTS "Allow all uploads to activity-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow all access to activity-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow all deletes from activity-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- إنشاء سياسات جديدة محسنة
CREATE POLICY "Allow public uploads to activity-files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'activity-files'
);

CREATE POLICY "Allow public access to activity-files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'activity-files'
);

CREATE POLICY "Allow public updates to activity-files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'activity-files'
) WITH CHECK (
  bucket_id = 'activity-files'
);

CREATE POLICY "Allow public deletes from activity-files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'activity-files'
);

-- تفعيل RLS على جدول activity_files إذا لم يكن مفعلاً
ALTER TABLE public.activity_files ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS لجدول activity_files
DROP POLICY IF EXISTS "Allow public access to activity files" ON public.activity_files;
DROP POLICY IF EXISTS "Allow public insert to activity files" ON public.activity_files;
DROP POLICY IF EXISTS "Allow public update to activity files" ON public.activity_files;
DROP POLICY IF EXISTS "Allow public delete to activity files" ON public.activity_files;

CREATE POLICY "Allow public access to activity files" ON public.activity_files
FOR SELECT USING (true);

CREATE POLICY "Allow public insert to activity files" ON public.activity_files
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to activity files" ON public.activity_files
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete to activity files" ON public.activity_files
FOR DELETE USING (true);

-- تفعيل RLS على الجداول الأخرى إذا لم تكن مفعلة
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS أساسية للجداول الأخرى
DROP POLICY IF EXISTS "Allow public access to activities" ON public.activities;
DROP POLICY IF EXISTS "Allow public access to centers" ON public.centers;
DROP POLICY IF EXISTS "Allow public access to profiles" ON public.profiles;

CREATE POLICY "Allow public access to activities" ON public.activities
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access to centers" ON public.centers
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access to profiles" ON public.profiles
FOR ALL USING (true) WITH CHECK (true);
