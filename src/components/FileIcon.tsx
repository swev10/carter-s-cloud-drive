import { 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileText, 
  FileArchive, 
  FileCode, 
  File 
} from 'lucide-react';
import { FileType, getFileType } from '@/types/file';

interface FileIconProps {
  mimeType: string;
  fileName: string;
  className?: string;
}

const iconMap: Record<FileType, typeof File> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  document: FileText,
  archive: FileArchive,
  code: FileCode,
  other: File,
};

const colorMap: Record<FileType, string> = {
  image: 'text-pink-400',
  video: 'text-purple-400',
  audio: 'text-green-400',
  document: 'text-blue-400',
  archive: 'text-amber-400',
  code: 'text-emerald-400',
  other: 'text-muted-foreground',
};

export const FileIcon = ({ mimeType, fileName, className = '' }: FileIconProps) => {
  const fileType = getFileType(mimeType, fileName);
  const Icon = iconMap[fileType];
  const colorClass = colorMap[fileType];

  return <Icon className={`${colorClass} ${className}`} />;
};
