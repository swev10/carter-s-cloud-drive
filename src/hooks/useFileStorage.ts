import { useState, useEffect, useCallback } from 'react';
import { StoredFile, Folder } from '@/types/file';
import { useAuth } from '@/contexts/AuthContext';

const FILES_STORAGE_KEY = 'cartercloud_files';
const FOLDERS_STORAGE_KEY = 'cartercloud_folders';

export const useFileStorage = () => {
  const { currentUser, storageLimit } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);

  // Load files and folders from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedFiles = localStorage.getItem(FILES_STORAGE_KEY);
        const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
        
        if (storedFiles) {
          const parsedFiles: StoredFile[] = JSON.parse(storedFiles);
          setFiles(parsedFiles);
          const size = parsedFiles.reduce((acc, file) => acc + file.size, 0);
          setTotalSize(size);
        }
        
        if (storedFolders) {
          setFolders(JSON.parse(storedFolders));
        }
      } catch (error) {
        console.error('Failed to load data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save files to localStorage
  const saveFiles = useCallback((newFiles: StoredFile[]) => {
    try {
      localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(newFiles));
      setFiles(newFiles);
      const size = newFiles.reduce((acc, file) => acc + file.size, 0);
      setTotalSize(size);
    } catch (error) {
      console.error('Failed to save files:', error);
      throw new Error('Storage quota exceeded. Please delete some files.');
    }
  }, []);

  // Save folders to localStorage
  const saveFolders = useCallback((newFolders: Folder[]) => {
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(newFolders));
      setFolders(newFolders);
    } catch (error) {
      console.error('Failed to save folders:', error);
    }
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<StoredFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        const now = Date.now();
        
        const newFile: StoredFile = {
          id: `file_${now}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          data: base64,
          createdAt: now,
          updatedAt: now,
          folderId: currentFolderId,
        };

        try {
          const updatedFiles = [newFile, ...files];
          saveFiles(updatedFiles);
          resolve(newFile);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, [files, saveFiles, currentFolderId]);

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

  const deleteFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    saveFiles(updatedFiles);
  }, [files, saveFiles]);

  const deleteFolder = useCallback((folderId: string) => {
    // Delete folder and all contents recursively
    const folderIdsToDelete = new Set<string>();
    
    const collectFolderIds = (parentId: string) => {
      folderIdsToDelete.add(parentId);
      folders.filter(f => f.parentId === parentId).forEach(f => collectFolderIds(f.id));
    };
    
    collectFolderIds(folderId);
    
    const updatedFolders = folders.filter(f => !folderIdsToDelete.has(f.id));
    const updatedFiles = files.filter(f => !f.folderId || !folderIdsToDelete.has(f.folderId));
    
    saveFolders(updatedFolders);
    saveFiles(updatedFiles);
  }, [files, folders, saveFiles, saveFolders]);

  const downloadFile = useCallback((file: StoredFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
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
    navigateToFolder,
    getBreadcrumbs,
    getCurrentFiles,
    getCurrentFolders,
    getStorageUsage,
    totalSize,
  };
};
