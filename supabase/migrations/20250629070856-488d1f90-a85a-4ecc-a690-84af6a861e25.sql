
-- إنشاء bucket للملفات والصور
INSERT INTO storage.buckets (id, name, public) 
VALUES ('activity-files', 'activity-files', true);

-- إنشاء سياسة للسماح بالتحميل
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'activity-files' AND auth.role() = 'authenticated');

-- إنشاء سياسة للسماح بالقراءة
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'activity-files');

-- إنشاء سياسة للسماح بالحذف
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'activity-files' AND auth.role() = 'authenticated');

-- إنشاء جدول لربط الملفات بالأنشطة
CREATE TABLE public.activity_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE CASCADE
);

-- تمكين RLS على جدول الملفات
ALTER TABLE public.activity_files ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للوصول للملفات
CREATE POLICY "Allow access to activity files" ON public.activity_files
FOR ALL USING (true);
