interface UploadOptions {
    onProgress?: (progress: number) => void;
    onComplete?: (response: any) => void;
    onError?: (error: Error) => void;
}
export declare function useApexxCloud(): {
    upload: (signedUrl: string, file: File, options?: UploadOptions) => Promise<any>;
};
export {};
