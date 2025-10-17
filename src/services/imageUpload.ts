// services/imageUploadService.ts
export interface ImageUploadResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    delete_url?: string;
  };
  error?: {
    message: string;
    code?: number;
  };
}

class ImageUploadService {
  private API_KEY: string;
  private BASE_URL = 'https://api.imgbb.com/1/upload';

  constructor() {
    // Use environment variable for API key
    this.API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'your_imgbb_api_key_here';
  }

  /**
   * Upload image to ImgBB
   * @param file - The image file to upload
   * @returns Promise with the image URL
   */
  async uploadImage(file: File): Promise<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error('Image size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${this.BASE_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data: ImageUploadResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Image upload failed');
      }

      return data.data!.url;
    } catch (error) {
      console.error('Image upload error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  /**
   * Upload multiple images to ImgBB
   * @param files - Array of image files to upload
   * @returns Promise with array of image URLs
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return await Promise.all(uploadPromises);
  }

  /**
   * Validate if a string is a valid image URL
   * @param url - The URL to validate
   * @returns boolean indicating if the URL is valid
   */
  isValidImageUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

// Create a singleton instance
export const imageUploadService = new ImageUploadService();