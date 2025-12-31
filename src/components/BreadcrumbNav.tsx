import { ChevronRight, Home } from 'lucide-react';
import { Folder } from '@/types/file';
import { Button } from '@/components/ui/button';

interface BreadcrumbNavProps {
  breadcrumbs: Folder[];
  onNavigate: (folderId: string | null) => void;
}

export const BreadcrumbNav = ({ breadcrumbs, onNavigate }: BreadcrumbNavProps) => {
  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto pb-2">
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={() => onNavigate(null)}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Button>
      
      {breadcrumbs.map((folder, index) => (
        <div key={folder.id} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          <Button
            variant="ghost"
            size="sm"
            className={`${
              index === breadcrumbs.length - 1 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onNavigate(folder.id)}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </nav>
  );
};
