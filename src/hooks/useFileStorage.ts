import { useState, useEffect, useCallback } from 'react';
import { StoredFile, Folder } from '@/types/file';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = 'https://api.swevmc.cloud/api';

export const useFileStorage = () => {
  const { currentUser, storageLimit } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);

  // Load files and folders from API
  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/files`);
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
        const size = data.files.reduce((acc: number, file: StoredFile) => acc + file.size, 0);
        setTotalSize(size);
      }
      if (data.folders) {
        setFolders(data.folders);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, loadData]);

  // Sync folders to server
  const saveFolders = useCallback(async (newFolders: Folder[]) => {
    try {
      setFolders(newFolders);
      await fetch(`${API_URL}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFolders)
      });
    } catch (error) {
      console.error('Failed to save folders:', error);
    }
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<StoredFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const now = Date.now();

          const newFile: StoredFile = {
            id: `file_${now}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            data: '', // Server won't store data in metadata array, but we verify this field exists
            createdAt: now,
            updatedAt: now,
            folderId: currentFolderId,
          };

          // Send base64 in the body, separate from metadata if we want, or combined.
          // Server expects { file: storedFileWithData, metadata: ... } OR just one object.
          // My server.js expects: const { file, metadata: metaStr } = body; 
          // WAIT. My server.js logic for /api/upload was:
          // const body = await readBody();
          // const { file, metadata: metaStr } = body;
          // This is mismatched with what I thought.
          // Let's re-read server.js carefully in my thought process or view it.
          // Actually, I wrote server.js in Step 92.
          // "const { file, metadata: metaStr } = body;"
          // "if (!fileData || !fileData.id || !fileData.data) {" -> it uses fileData variable which was assigned "const fileData = body;"
          // Wait, in Step 92:
          // const body = await readBody();
          // const { file, metadata: metaStr } = body; 
          // const fileData = body;

          // This suggests I wrote conflicting logic in server.js.
          // "const fileData = body;" suggests body IS the file object.
          // But "const { file... } = body" suggests body has file property.
          // AND "fileData.data.replace..." implies fileData has data.

          // I should adhere to sending the whole object as the body.
          // So client sends: JSON.stringify({ ...newFile, data: base64 })
          // Server sees: body = { ...newFile, data: base64 }
          // Server says: const fileData = body;
          // Server checks fileData.id, fileData.data.
          // This works.

          // So client update:
          const payload = { ...newFile, data: base64 };

          const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!res.ok) throw new Error('Upload failed');

          const uploadedFile = await res.json();

          // Re-attach download URL for UI
          uploadedFile.data = `${API_URL}/files/${uploadedFile.id}`;

          const updatedFiles = [uploadedFile, ...files];
          setFiles(updatedFiles);
          setTotalSize(prev => prev + uploadedFile.size);

          resolve(uploadedFile);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, [files, currentFolderId]);

  const createFolder = useCallback((name: string): Folder => {
    const now = Date.now();
    const newFolder: Folder = {
      id: `folder_${now}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      parentId: currentFolderId,
      createdAt: now,
    };

    const updatedFolders = [newFolder, ...folders];
    saveFolders(updatedFolders);
    return newFolder;
  }, [folders, saveFolders, currentFolderId]);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await fetch(`${API_URL}/files/${fileId}`, { method: 'DELETE' });
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      // Recalculate size
      const size = updatedFiles.reduce((acc, file) => acc + file.size, 0);
      setTotalSize(size);
    } catch (e) {
      console.error("Delete failed", e);
    }
  }, [files]);

  const deleteFolder = useCallback((folderId: string) => {
    // Delete folder and all contents recursively
    // Frontend logic for ID collection remains, but we need to delete files via API
    const folderIdsToDelete = new Set<string>();

    const collectFolderIds = (parentId: string) => {
      folderIdsToDelete.add(parentId);
      folders.filter(f => f.parentId === parentId).forEach(f => collectFolderIds(f.id));
    };

    collectFolderIds(folderId);

    // Determine files to delete
    const filesToDelete = files.filter(f => f.folderId && folderIdsToDelete.has(f.folderId));

    // Execute deletes
    filesToDelete.forEach(f => deleteFile(f.id));

    const updatedFolders = folders.filter(f => !folderIdsToDelete.has(f.id));
    saveFolders(updatedFolders);
  }, [files, folders, saveFolders, deleteFile]);

  const downloadFile = useCallback((file: StoredFile) => {
    // If file.data is a URL (which we set in uploadFile), use it.
    // If it's base64 (legacy), standard link works.
    // We set it to `${API_URL}/files/${newFileMeta.id}`, so we need that endpoint.
    // I will add that endpoint to server.ts next.

    const link = document.createElement('a');
    // If we are "hosting on network", using localhost here won't work for other devices.
    // Ideally we use relative path "/api/files/..." or window.location.hostname
    // For now, let's fix the URL construction to make it work.

    // Construct valid URL
    const url = `${API_URL}/files/${file.id}`;

    // We want to force download, so fetching as blob is better or using 'download' attribute if same origin.
    // Since API is on diff port (3000) than React Dev (5173), CORS applies but we handled it.
    // 'download' attribute only works for same-origin.
    // Let's trying opening in new tab or just simple href for now.
    link.href = url;
    link.target = '_blank';
    link.download = file.name; // Might be ignored by browser for cross-origin
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
  }, []);

  const getBreadcrumbs = useCallback((): Folder[] => {
    const breadcrumbs: Folder[] = [];
    let currentId = currentFolderId;

    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return breadcrumbs;
  }, [currentFolderId, folders]);

  const getCurrentFiles = useCallback(() => {
    return files.filter(f => f.folderId === currentFolderId);
  }, [files, currentFolderId]);

  const getCurrentFolders = useCallback(() => {
    return folders.filter(f => f.parentId === currentFolderId);
  }, [folders, currentFolderId]);

  const getStorageUsage = useCallback(() => {
    const maxBytes = storageLimit;
    const percentage = Math.min((totalSize / maxBytes) * 100, 100);
    return {
      used: totalSize,
      total: maxBytes,
      percentage,
    };
  }, [totalSize, storageLimit]);


  const fetchFromUrl = useCallback(async (url: string) => {
    try {
      const res = await fetch(`${API_URL}/fetch-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, folderId: currentFolderId })
      });

      if (!res.ok) throw new Error('Download failed');

      const downloadedFile = await res.json();

      // Re-attach download URL for UI
      downloadedFile.data = `${API_URL}/files/${downloadedFile.id}`;

      const updatedFiles = [downloadedFile, ...files];
      setFiles(updatedFiles);
      setTotalSize(prev => prev + downloadedFile.size);

      return downloadedFile;
    } catch (error) {
      console.error('Fetch URL failed:', error);
      throw error;
    }
  }, [files, currentFolderId]);

  return {
    files,
    folders,
    currentFolderId,
    isLoading,
    uploadFile,
    createFolder,
    deleteFile,
    deleteFolder,
    downloadFile,
    fetchFromUrl,
    navigateToFolder,
    getBreadcrumbs,
    getCurrentFiles,
    getCurrentFolders,
    getStorageUsage,
    totalSize,
  };
};
