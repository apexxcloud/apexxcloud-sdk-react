import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useApexxCloud } from "../hooks/useApexxCloud";
import {
  GetSignedUrlFn,
  ProgressEvent,
  MultipartProgressEvent,
} from "@apexxcloud/sdk-js";
import clsx from "clsx";
import "./FileUploader.css";

interface FileUploaderProps {
  getSignedUrl: GetSignedUrlFn;
  onUploadComplete?: (response: any) => void;
  onUploadError?: (error: Error) => void;
  multipart?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  getSignedUrl,
  onUploadComplete,
  onUploadError,
  multipart = false,
  accept,
  maxSize,
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

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: useCallback(
        (acceptedFiles: File[]) => {
          const file = acceptedFiles[0];
          if (file) handleUpload(file);
        },
        [handleUpload]
      ),
      accept,
      maxSize: maxSize ? maxSize * 1024 * 1024 : undefined,
      multiple: false,
      disabled: uploading,
      getFilesFromEvent: async (event) => {
        const files = (await (event as any).dataTransfer)
          ? (event as any).dataTransfer.files
          : (event as any).target.files;
        return files;
      },
    });

  const acceptedFileTypes = accept
    ? Object.values(accept).flat().join(", ")
    : "All files";
  const maxSizeFormatted = maxSize ? `${maxSize}MB` : "Unlimited";

  return (
    <div className={clsx("apexx-uploader-container")}>
      <div
        {...getRootProps()}
        className={clsx(
          "apexx-uploader-dropzone",
          isDragActive && "active",
          uploading && "disabled"
        )}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="apexx-uploader-progress">
            <div className="apexx-uploader-progress-bar">
              <div
                className="apexx-uploader-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <span>{progress.toFixed(0)}% complete</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="apexx-uploader-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="apexx-uploader-content">
            <svg
              className="apexx-uploader-icon"
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
            <p>Drop files here or click to upload</p>
            <small className="apexx-uploader-limits">
              Accepted: {acceptedFileTypes}
              <br />
              Max size: {maxSizeFormatted}
            </small>
          </div>
        )}

        {fileRejections.length > 0 && (
          <div className="apexx-uploader-error">
            {fileRejections[0].errors
              .map((err) =>
                err.code === "file-too-large"
                  ? `File is too large. Maximum size is ${maxSize}MB`
                  : err.message
              )
              .join(", ")}
          </div>
        )}

        {error && <div className="apexx-uploader-error">{error}</div>}
      </div>
    </div>
  );
};
