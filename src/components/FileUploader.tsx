import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useApexxCloud } from "../hooks/useApexxCloud";
import {
  GetSignedUrlFn,
  ProgressEvent,
  MultipartProgressEvent,
} from "@apexxcloud/sdk-js";
import clsx from "clsx";
import styles from "./FileUploader.module.css";

interface FileUploaderProps {
  getSignedUrl: GetSignedUrlFn;
  onUploadComplete?: (response: any) => void;
  onUploadError?: (error: Error) => void;
  multipart?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  getSignedUrl,
  onUploadComplete,
  onUploadError,
  multipart = false,
  accept,
  maxSize,
  className,
}) => {
  const { upload, uploadMultipart } = useApexxCloud();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleProgress = useCallback(
    (event: ProgressEvent | MultipartProgressEvent) => {
      setProgress(event.progress);
    },
    []
  );

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      setProgress(0);
      abortControllerRef.current = new AbortController();

      try {
        const uploadFn = multipart ? uploadMultipart : upload;
        const result = await uploadFn(getSignedUrl, file, {
          onProgress: handleProgress,
          onComplete: (event) => {
            setProgress(100);
            onUploadComplete?.(event.response);
          },
          onError: (event) => {
            setError(event.error.message);
            onUploadError?.(event.error);
          },
          signal: abortControllerRef.current.signal,
          ...(multipart && {
            partSize: 5 * 1024 * 1024, // 5MB chunks
            concurrency: 3,
          }),
        });
        return result;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          onUploadError?.(error);
        }
      } finally {
        setUploading(false);
      }
    },
    [
      upload,
      uploadMultipart,
      getSignedUrl,
      multipart,
      onUploadComplete,
      onUploadError,
    ]
  );

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setUploading(false);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) handleUpload(file);
      },
      [handleUpload]
    ),
    accept,
    maxSize,
    multiple: false,
    disabled: uploading,
  });

  const acceptedFileTypes = accept
    ? Object.keys(accept).join(", ")
    : "All files";
  const maxSizeFormatted = maxSize
    ? `${(maxSize / (1024 * 1024)).toFixed(2)}MB`
    : "Unlimited";

  return (
    <div className={clsx(styles.container, className)}>
      <div
        {...getRootProps()}
        className={clsx(
          styles.dropzone,
          isDragActive ? styles.dropzoneActive : styles.dropzoneInactive,
          uploading
            ? "apexx-cursor-default"
            : "apexx-cursor-pointer hover:apexx-border-gray-400"
        )}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-4">
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{progress.toFixed(0)}% complete</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <svg
                className={clsx(
                  "w-12 h-12 transition-colors duration-200",
                  isDragActive ? "text-blue-500" : "text-gray-400"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-gray-700">
                {isDragActive
                  ? "Drop your file here"
                  : "Drag & drop your file or click to browse"}
              </p>
              <p className="text-sm text-gray-500">
                {acceptedFileTypes} up to {maxSizeFormatted}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
