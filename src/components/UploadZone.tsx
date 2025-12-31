import { useState, useCallback, useRef } from 'react';
import { Upload, CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export const UploadZone = ({ onFilesSelected, isUploading }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFilesSelected]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`upload-zone cursor-pointer group ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-glow" />
          <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {isUploading ? (
              <CloudUpload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <Upload className="w-8 h-8 text-primary group-hover:translate-y-[-2px] transition-transform" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isUploading ? 'Uploading...' : 'Drop files here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 border-primary/30 text-primary hover:bg-primary/10"
          disabled={isUploading}
        >
          Select Files
        </Button>
      </div>
    </div>
  );
};
