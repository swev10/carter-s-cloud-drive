import { HardDrive } from 'lucide-react';
import { formatFileSize } from '@/types/file';

interface StorageIndicatorProps {
  used: number;
  total: number;
  percentage: number;
}

export const StorageIndicator = ({ used, total, percentage }: StorageIndicatorProps) => {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <HardDrive className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Storage</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(used)} of {formatFileSize(total)} used
          </p>
        </div>
      </div>
      
      <div className="storage-bar">
        <div 
          className="storage-bar-fill"
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 text-right">
        {percentage.toFixed(1)}% used
      </p>
    </div>
  );
};
