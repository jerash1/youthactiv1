
import React, { useState } from 'react';
import { Eye, Trash2, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface ImageThumbnailProps {
  file: {
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number | null;
    uploaded_at: string | null;
  };
  onDelete?: (fileId: string) => void;
  disabled?: boolean;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ file, onDelete, disabled = false }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    if (file.file_type.startsWith('image/')) {
      const { data } = supabase.storage
        .from('activity-files')
        .getPublicUrl(file.file_path);
      setImageUrl(data.publicUrl);
    }
  }, [file.file_path, file.file_type]);

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('activity-files')
        .download(file.file_path);

      if (error) {
        console.error('Error downloading file:', error);
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = file.file_type.startsWith('image/');

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail container */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {isImage && imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={file.file_name}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={32} />
            <span className="text-xs mt-1 text-center px-2">
              {isImage ? 'خطأ في التحميل' : 'ملف'}
            </span>
          </div>
        )}
        
        {/* Overlay with actions - appears on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 space-x-reverse">
          {/* View button - only for images */}
          {isImage && imageUrl && !imageError && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-700"
                >
                  <Eye size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="text-right">{file.file_name}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                  <img
                    src={imageUrl}
                    alt={file.file_name}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Download button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="bg-white/90 hover:bg-white text-gray-700"
          >
            <Download size={16} />
          </Button>
          
          {/* Delete button */}
          {!disabled && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(file.id)}
              className="bg-red-500/90 hover:bg-red-600 text-white"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
      
      {/* File info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate" title={file.file_name}>
          {file.file_name}
        </p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {formatFileSize(file.file_size)}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(file.uploaded_at || '').toLocaleDateString('ar')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageThumbnail;
