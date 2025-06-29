
import React, { useState, useCallback } from "react";
import { Upload, X, File, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${activityId}/${fileName}`;

        // رفع الملف إلى Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('activity-files')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error(`فشل في رفع الملف: ${file.name}`);
          continue;
        }

        // حفظ معلومات الملف في قاعدة البيانات
        const { data: fileData, error: dbError } = await supabase
          .from('activity_files')
          .insert({
            activity_id: activityId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size
          })
          .select()
          .single();

        if (dbError) {
          console.error('Error saving file info:', dbError);
          toast.error(`فشل في حفظ معلومات الملف: ${file.name}`);
          continue;
        }

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
    }
  }, [activityId, files, onFilesChange]);

  const handleDeleteFile = useCallback(async (file: ActivityFile) => {
    try {
      // حذف الملف من Storage
      const { error: storageError } = await supabase.storage
        .from('activity-files')
        .remove([file.file_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        toast.error('فشل في حذف الملف من التخزين');
        return;
      }

      // حذف معلومات الملف من قاعدة البيانات
      const { error: dbError } = await supabase
        .from('activity_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        console.error('Error deleting file info:', dbError);
        toast.error('فشل في حذف معلومات الملف');
        return;
      }

      onFilesChange(files.filter(f => f.id !== file.id));
      toast.success('تم حذف الملف بنجاح');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('حدث خطأ أثناء حذف الملف');
    }
  }, [files, onFilesChange]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image size={16} className="text-blue-600" />;
    }
    return <File size={16} className="text-gray-600" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

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
        <div className="grid gap-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3">
                {getFileIcon(file.file_type)}
                <div>
                  <p className="font-medium text-sm">{file.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.file_size)} • {new Date(file.uploaded_at || '').toLocaleDateString('ar')}
                  </p>
                </div>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFile(file)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={14} />
                </Button>
              )}
            </div>
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
