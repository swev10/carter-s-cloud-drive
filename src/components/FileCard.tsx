import { useState } from 'react';
import { Download, Trash2, MoreVertical, Eye } from 'lucide-react';
import { StoredFile, formatFileSize, formatDate, getFileType } from '@/types/file';
import { FileIcon } from './FileIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FileCardProps {
  file: StoredFile;
  onDownload: (file: StoredFile) => void;
  onDelete: (fileId: string) => void;
}

export const FileCard = ({ file, onDownload, onDelete }: FileCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const fileType = getFileType(file.type, file.name);
  const isPreviewable = fileType === 'image';

  return (
    <>
      <div className="file-card animate-fade-in group">
        <div className="flex items-start gap-4">
          {/* Thumbnail or Icon */}
          <div className="relative shrink-0">
            {fileType === 'image' ? (
              <div 
                className="w-12 h-12 rounded-lg bg-cover bg-center cursor-pointer hover:ring-2 ring-primary/50 transition-all"
                style={{ backgroundImage: `url(${file.data})` }}
                onClick={() => setShowPreview(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <FileIcon mimeType={file.type} fileName={file.name} className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate pr-8" title={file.name}>
              {file.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{formatDate(file.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isPreviewable && (
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDownload(file)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(file.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="truncate">{file.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center max-h-[70vh] overflow-auto">
            <img 
              src={file.data} 
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
