import React from "react";
import { GetSignedUrlFn } from "@apexxcloud/sdk-js";
import "./FileUploader.css";
interface FileUploaderProps {
    getSignedUrl: GetSignedUrlFn;
    onUploadComplete?: (response: any) => void;
    onUploadError?: (error: Error) => void;
    multipart?: boolean;
    accept?: Record<string, string[]>;
    maxSize?: number;
    className?: string;
}
export declare const FileUploader: React.FC<FileUploaderProps>;
export {};
