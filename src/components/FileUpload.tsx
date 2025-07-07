
import React, { useState, useCallback } from "react";
import { Upload, X, File, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageThumbnail from "./ImageThumbnail";

interface ActivityFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  uploaded_at: string | null;
}

interface FileUploadProps {
  activityId: string;
  files: ActivityFile[];
  onFilesChange: (files: ActivityFile[]) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  activityId, 
  files, 
  onFilesChange, 
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const uploadedFiles: ActivityFile[] = [];

    try {
      for (const file of Array.from(selectedFiles)) {
        // تنظيف اسم الملف من الأحرف الخاصة
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileExt = cleanFileName.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${cleanFileName}`;
        const filePath = `${activityId}/${fileName}`;

        console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type);

        // رفع الملف إلى Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('activity-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          toast.error(`فشل في رفع الملف: ${file.name} - ${uploadError.message}`);
          continue;
        }

        console.log('File uploaded successfully to storage:', uploadData);

        // حفظ معلومات الملف في قاعدة البيانات
        const { data: fileData, error: dbError } = await supabase
          .from('activity_files')
          .insert({
            activity_id: activityId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type || 'application/octet-stream',
            file_size: file.size
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database insert error:', dbError);
          toast.error(`فشل في حفظ معلومات الملف: ${file.name} - ${dbError.message}`);
          
          // محاولة حذف الملف من Storage إذا فشل حفظ البيانات
          try {
            await supabase.storage
              .from('activity-files')
              .remove([filePath]);
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
          continue;
        }

        console.log('File info saved to database:', fileData);
        uploadedFiles.push(fileData);
      }

      if (uploadedFiles.length > 0) {
        onFilesChange([...files, ...uploadedFiles]);
        toast.success(`تم رفع ${uploadedFiles.length} ملف بنجاح`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('حدث خطأ أثناء رفع الملفات');
    } finally {
      setUploading(false);
      // إعادة تعيين قيمة input لتمكين رفع نفس الملف مرة أخرى
      if (event.target) {
        event.target.value = '';
      }
    }
  }, [activityId, files, onFilesChange]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      console.log('Deleting file:', file.file_name, 'Path:', file.file_path);

      // حذف معلومات الملف من قاعدة البيانات أولاً
      const { error: dbError } = await supabase
        .from('activity_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast.error(`فشل في حذف معلومات الملف: ${dbError.message}`);
        return;
      }

      // حذف الملف من Storage
      const { error: storageError } = await supabase.storage
        .from('activity-files')
        .remove([file.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // لا نعرض خطأ هنا لأن الملف قد يكون محذوف مسبقاً من Storage
      }

      onFilesChange(files.filter(f => f.id !== file.id));
      toast.success('تم حذف الملف بنجاح');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('حدث خطأ أثناء حذف الملف');
    }
  }, [files, onFilesChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">الملفات والصور</h3>
        {!disabled && (
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              {uploading ? 'جاري الرفع...' : 'رفع ملفات'}
            </Button>
          </div>
        )}
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <ImageThumbnail
              key={file.id}
              file={file}
              onDelete={!disabled ? handleDeleteFile : undefined}
              disabled={disabled}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
          <Upload size={32} className="mx-auto mb-2 text-gray-400" />
          <p>لا توجد ملفات مرفوعة</p>
          {!disabled && <p className="text-sm">استخدم زر "رفع ملفات" لإضافة الصور والمستندات</p>}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
