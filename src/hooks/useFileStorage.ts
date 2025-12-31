import { useState, useEffect, useCallback } from 'react';
import { StoredFile } from '@/types/file';

const STORAGE_KEY = 'cartercloud_files';
const MAX_STORAGE_MB = 50; // localStorage limit is ~5-10MB, but we'll set a reasonable limit

export const useFileStorage = () => {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);

  // Load files from localStorage
  useEffect(() => {
    const loadFiles = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedFiles: StoredFile[] = JSON.parse(stored);
          setFiles(parsedFiles);
          const size = parsedFiles.reduce((acc, file) => acc + file.size, 0);
          setTotalSize(size);
        }
      } catch (error) {
        console.error('Failed to load files from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, []);

  // Save files to localStorage
  const saveFiles = useCallback((newFiles: StoredFile[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
      setFiles(newFiles);
      const size = newFiles.reduce((acc, file) => acc + file.size, 0);
      setTotalSize(size);
    } catch (error) {
      console.error('Failed to save files:', error);
      throw new Error('Storage quota exceeded. Please delete some files.');
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
  }, [files, saveFiles]);

  const deleteFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    saveFiles(updatedFiles);
  }, [files, saveFiles]);

  const downloadFile = useCallback((file: StoredFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const getStorageUsage = useCallback(() => {
    const maxBytes = MAX_STORAGE_MB * 1024 * 1024;
    const percentage = Math.min((totalSize / maxBytes) * 100, 100);
    return {
      used: totalSize,
      total: maxBytes,
      percentage,
    };
  }, [totalSize]);

  return {
    files,
    isLoading,
    uploadFile,
    deleteFile,
    downloadFile,
    getStorageUsage,
    totalSize,
  };
};
