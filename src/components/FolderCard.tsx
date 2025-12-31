import { Folder as FolderIcon, MoreVertical, Trash2 } from 'lucide-react';
import { Folder, formatDate } from '@/types/file';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FolderCardProps {
  folder: Folder;
  onOpen: (folderId: string) => void;
  onDelete: (folderId: string) => void;
}

export const FolderCard = ({ folder, onOpen, onDelete }: FolderCardProps) => {
  return (
    <div 
      className="file-card animate-fade-in group cursor-pointer"
      onClick={() => onOpen(folder.id)}
    >
      <div className="flex items-start gap-4">
        {/* Folder Icon */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <FolderIcon className="w-6 h-6 text-amber-400 fill-amber-400/20" />
          </div>
        </div>

        {/* Folder Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate pr-8" title={folder.name}>
            {folder.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span>Folder</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>{formatDate(folder.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder.id);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
