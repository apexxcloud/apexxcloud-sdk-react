import React from "react";
interface FileUploaderProps {
    getSignedUrl: (file: File) => Promise<string>;
    onUploadComplete?: (response: any) => void;
    onUploadError?: (error: Error) => void;
    onUploadProgress?: (progress: number) => void;
}
export declare const FileUploader: React.FC<FileUploaderProps>;
export {};
