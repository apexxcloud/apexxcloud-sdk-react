import { GetSignedUrlFn, UploadOptions, MultipartUploadOptions } from '@apexxcloud/sdk-js';
export declare function useApexxCloud(): {
    upload: (getSignedUrl: GetSignedUrlFn, file: File, options?: UploadOptions) => Promise<any>;
    uploadMultipart: (getSignedUrl: GetSignedUrlFn, file: File, options?: MultipartUploadOptions) => Promise<any>;
};
