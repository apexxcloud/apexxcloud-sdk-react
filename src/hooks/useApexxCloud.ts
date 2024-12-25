import { useCallback, useRef } from 'react';
import StorageSDK from '@apexxcloud/sdk-js';

interface UploadOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (response: any) => void;
  onError?: (error: Error) => void;
}

export function useApexxCloud() {
  const sdkRef = useRef<StorageSDK>(new StorageSDK());

  const upload = useCallback(async (signedUrl: string, file: File, options: UploadOptions = {}) => {
    try {
      const result = await sdkRef.current.files.upload(signedUrl, file, {
        onProgress: (event) => {
          options.onProgress?.(event.progress);
        },
        onComplete: (event) => {
          options.onComplete?.(event.response);
        },
        onError: (event) => {
          options.onError?.(event.error);
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  

  return {
    upload,

  };
} 