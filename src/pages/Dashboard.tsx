import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { UploadZone } from '@/components/UploadZone';
import { FileCard } from '@/components/FileCard';
import { FolderCard } from '@/components/FolderCard';
import { StorageIndicator } from '@/components/StorageIndicator';
import { EmptyState } from '@/components/EmptyState';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { CreateFolderDialog } from '@/components/CreateFolderDialog';
import { DirectDownloadDialog } from '@/components/DirectDownloadDialog';
import { useFileStorage } from '@/hooks/useFileStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    files,
    isLoading,
    uploadFile,
    createFolder,
    deleteFile,
    deleteFolder,
    downloadFile,
    navigateToFolder,
    getBreadcrumbs,
    getCurrentFiles,
    getCurrentFolders,
    getStorageUsage,
    currentFolderId,
    fetchFromUrl,
  } = useFileStorage();

  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const currentFiles = getCurrentFiles();
  const currentFolders = getCurrentFolders();
  const breadcrumbs = getBreadcrumbs();

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return currentFiles;
    const query = searchQuery.toLowerCase();
    return currentFiles.filter(file =>
      file.name.toLowerCase().includes(query)
    );
  }, [currentFiles, searchQuery]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return currentFolders;
    const query = searchQuery.toLowerCase();
    return currentFolders.filter(folder =>
      folder.name.toLowerCase().includes(query)
    );
  }, [currentFolders, searchQuery]);

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

  const handleCreateFolder = useCallback((name: string) => {
    createFolder(name);
    toast({
      title: 'Folder created',
      description: `"${name}" has been created.`,
    });
  }, [createFolder, toast]);

  const handleDirectDownload = useCallback(async (url: string) => {
    try {
      await fetchFromUrl(url);
      toast({
        title: 'Download complete',
        description: 'File has been downloaded to your storage.',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not fetch the file from the URL.',
        variant: 'destructive',
      });
      throw error; // Re-throw for dialog to handle state
    }
  }, [fetchFromUrl, toast]);

  const handleDeleteFile = useCallback((fileId: string) => {
    deleteFile(fileId);
    toast({
      title: 'File deleted',
      description: 'The file has been removed from your storage.',
    });
  }, [deleteFile, toast]);

  const handleDeleteFolder = useCallback((folderId: string) => {
    deleteFolder(folderId);
    toast({
      title: 'Folder deleted',
      description: 'The folder and its contents have been removed.',
    });
  }, [deleteFolder, toast]);

  const storageUsage = getStorageUsage();
  const totalItems = filteredFiles.length + filteredFolders.length;
  const isEmpty = totalItems === 0;

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
          <div className="space-y-6">
            {/* Upload Zone */}
            <UploadZone
              onFilesSelected={handleFilesSelected}
              isUploading={isUploading}
            />

            {/* Navigation & Actions */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <BreadcrumbNav
                breadcrumbs={breadcrumbs}
                onNavigate={navigateToFolder}
              />
              <CreateFolderDialog onCreate={handleCreateFolder} />
              <DirectDownloadDialog onDownload={handleDirectDownload} />
            </div>

            {/* Files Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {searchQuery ? 'Search Results' : currentFolderId ? 'Contents' : 'Your Files'}
                </h2>
                {totalItems > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {!isEmpty ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredFolders.map(folder => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onOpen={navigateToFolder}
                      onDelete={handleDeleteFolder}
                    />
                  ))}
                  {filteredFiles.map(file => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDownload={downloadFile}
                      onDelete={handleDeleteFile}
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
                  Create folders to organize files
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Drag & drop multiple files at once
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Click images to preview them
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
