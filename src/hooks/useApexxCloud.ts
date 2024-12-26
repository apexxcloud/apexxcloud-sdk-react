import { useCallback, useRef } from 'react';
import ApexxCloud, { 
  GetSignedUrlFn, 
  UploadOptions, 
  MultipartUploadOptions,
  SignedUrlOptions
} from '@apexxcloud/sdk-js';

export function useApexxCloud() {
  const sdkRef = useRef(new ApexxCloud());

  const upload = useCallback(async (
    getSignedUrl: GetSignedUrlFn,
    file: File,
    options: UploadOptions = {}
  ) => {
    try {
      const result = await sdkRef.current.files.upload(file, getSignedUrl, options);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const uploadMultipart = useCallback(async (
    getSignedUrl: GetSignedUrlFn,
    file: File,
    options: MultipartUploadOptions = {}
  ) => {
    try {
      const result = await sdkRef.current.files.uploadMultipart(file, getSignedUrl, options);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    upload,
    uploadMultipart,
  };
} 