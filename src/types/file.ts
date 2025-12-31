export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // base64 encoded
  createdAt: number;
  updatedAt: number;
}

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other';

export const getFileType = (mimeType: string, fileName: string): FileType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt'];
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  const codeExtensions = ['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'c', 'go', 'rs'];
  
  if (documentExtensions.includes(extension || '')) return 'document';
  if (archiveExtensions.includes(extension || '')) return 'archive';
  if (codeExtensions.includes(extension || '')) return 'code';
  
  return 'other';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'Just now' : `${diffMins} min ago`;
    }
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
