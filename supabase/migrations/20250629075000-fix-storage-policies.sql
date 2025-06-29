
-- حذف السياسات الموجودة وإعادة إنشاءها
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- إنشاء سياسة للسماح بالتحميل للجميع
CREATE POLICY "Allow all uploads to activity-files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'activity-files');

-- إنشاء سياسة للسماح بالقراءة للجميع
CREATE POLICY "Allow all access to activity-files" ON storage.objects
FOR SELECT USING (bucket_id = 'activity-files');

-- إنشاء سياسة للسماح بالحذف للجميع
CREATE POLICY "Allow all deletes from activity-files" ON storage.objects
FOR DELETE USING (bucket_id = 'activity-files');

-- التأكد من أن bucket موجود ومتاح للعموم
UPDATE storage.buckets 
SET public = true 
WHERE id = 'activity-files';
