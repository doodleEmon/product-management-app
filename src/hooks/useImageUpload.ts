// hooks/useImageUpload.ts
import { imageUploadService } from '@/services/imageUpload';
import { useState } from 'react';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string>;
  uploadMultipleImages: (files: File[]) => Promise<string[]>;
  uploading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      const url = await imageUploadService.uploadImage(file);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    setUploading(true);
    setError(null);

    try {
      const urls = await imageUploadService.uploadMultipleImages(files);
      return urls;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    uploadImage,
    uploadMultipleImages,
    uploading,
    error,
    resetError,
  };
};