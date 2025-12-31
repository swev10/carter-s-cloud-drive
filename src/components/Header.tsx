import { Cloud, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  fileCount: number;
}

export const Header = ({ searchQuery, onSearchChange, fileCount }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-lg opacity-50 animate-pulse-glow" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Cloud className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Carter</span>Cloud
              </h1>
              <p className="text-xs text-muted-foreground">Personal Storage</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{fileCount}</span>
            <span>{fileCount === 1 ? 'file' : 'files'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
