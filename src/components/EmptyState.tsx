import { CloudOff, Upload } from 'lucide-react';

interface EmptyStateProps {
  isSearching: boolean;
}

export const EmptyState = ({ isSearching }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-muted/30 blur-3xl rounded-full" />
        <div className="relative w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center">
          {isSearching ? (
            <CloudOff className="w-10 h-10 text-muted-foreground" />
          ) : (
            <Upload className="w-10 h-10 text-muted-foreground animate-float" />
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {isSearching ? 'No files found' : 'No files yet'}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {isSearching 
          ? 'Try adjusting your search terms or clear the search to see all files.'
          : 'Upload your first file by dragging and dropping above, or click to browse.'}
      </p>
    </div>
  );
};
