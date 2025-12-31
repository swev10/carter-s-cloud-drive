import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { UploadZone } from '@/components/UploadZone';
import { FileCard } from '@/components/FileCard';
import { StorageIndicator } from '@/components/StorageIndicator';
import { EmptyState } from '@/components/EmptyState';
import { useFileStorage } from '@/hooks/useFileStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const { 
    files, 
    isLoading, 
    uploadFile, 
    deleteFile, 
    downloadFile, 
    getStorageUsage 
  } = useFileStorage();
  
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(query)
    );
  }, [files, searchQuery]);

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    setIsUploading(true);
    
    let successCount = 0;
    let errorCount = 0;

    for (const file of selectedFiles) {
      try {
        await uploadFile(file);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('Upload error:', error);
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast({
        title: 'Upload complete',
        description: `${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully.`,
      });
    }

    if (errorCount > 0) {
      toast({
        title: 'Upload failed',
        description: `${errorCount} file${errorCount > 1 ? 's' : ''} could not be uploaded. Storage may be full.`,
        variant: 'destructive',
      });
    }
  }, [uploadFile, toast]);

  const handleDelete = useCallback((fileId: string) => {
    deleteFile(fileId);
    toast({
      title: 'File deleted',
      description: 'The file has been removed from your storage.',
    });
  }, [deleteFile, toast]);

  const storageUsage = getStorageUsage();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fileCount={files.length}
      />

      <main className="container mx-auto px-6 py-8 relative">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Upload Zone */}
            <UploadZone 
              onFilesSelected={handleFilesSelected}
              isUploading={isUploading}
            />

            {/* Files Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {searchQuery ? 'Search Results' : 'Your Files'}
                </h2>
                {filteredFiles.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
                  </span>
                )}
              </div>

              {filteredFiles.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredFiles.map(file => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDownload={downloadFile}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState isSearching={!!searchQuery} />
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <StorageIndicator {...storageUsage} />
            
            {/* Quick Tips */}
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <h3 className="text-sm font-medium text-foreground mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Drag & drop multiple files at once
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Click images to preview them
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Files are stored in your browser
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;
