import React, { useRef, useCallback, useState } from 'react';
import ApexxCloud from '@apexxcloud/sdk-js';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

function useApexxCloud() {
    const sdkRef = useRef(new ApexxCloud());
    const upload = useCallback(async (getSignedUrl, file, options = {}) => {
        try {
            const result = await sdkRef.current.files.upload(file, getSignedUrl, options);
            return result;
        }
        catch (error) {
            throw error;
        }
    }, []);
    const uploadMultipart = useCallback(async (getSignedUrl, file, options = {}) => {
        try {
            const result = await sdkRef.current.files.uploadMultipart(file, getSignedUrl, options);
            return result;
        }
        catch (error) {
            throw error;
        }
    }, []);
    return {
        upload,
        uploadMultipart,
    };
}

const FileUploader = ({ getSignedUrl, onUploadComplete, onUploadError, multipart = false, accept, maxSize, className, }) => {
    const { upload, uploadMultipart } = useApexxCloud();
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const handleProgress = useCallback((event) => {
        setProgress(event.progress);
    }, []);
    const handleUpload = useCallback(async (file) => {
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
                    onUploadComplete === null || onUploadComplete === void 0 ? void 0 : onUploadComplete(event.response);
                },
                onError: (event) => {
                    setError(event.error.message);
                    onUploadError === null || onUploadError === void 0 ? void 0 : onUploadError(event.error);
                },
                signal: abortControllerRef.current.signal,
                ...(multipart && {
                    partSize: 5 * 1024 * 1024, // 5MB chunks
                    concurrency: 3,
                }),
            });
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                onUploadError === null || onUploadError === void 0 ? void 0 : onUploadError(error);
            }
        }
        finally {
            setUploading(false);
        }
    }, [
        upload,
        uploadMultipart,
        getSignedUrl,
        multipart,
        onUploadComplete,
        onUploadError,
    ]);
    const handleCancel = useCallback(() => {
        var _a;
        (_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.abort();
        setUploading(false);
        setProgress(0);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: useCallback((acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file)
                handleUpload(file);
        }, [handleUpload]),
        accept,
        maxSize,
        multiple: false,
        disabled: uploading,
    });
    accept
        ? Object.keys(accept).join(", ")
        : "All files";
    maxSize
        ? `${(maxSize / (1024 * 1024)).toFixed(2)}MB`
        : "Unlimited";
    return (React.createElement("div", { className: clsx("apexx-uploader-container", className) },
        React.createElement("div", { ...getRootProps(), className: clsx("apexx-uploader-dropzone", isDragActive && "active", uploading && "disabled") },
            React.createElement("input", { ...getInputProps() }),
            uploading ? (React.createElement("div", { className: "apexx-uploader-progress" },
                React.createElement("div", { className: "apexx-uploader-progress-bar" },
                    React.createElement("div", { className: "apexx-uploader-progress-fill", style: { width: `${progress}%` } })),
                React.createElement("div", { style: {
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "0.5rem",
                    } },
                    React.createElement("span", null,
                        progress.toFixed(0),
                        "% complete"),
                    React.createElement("button", { onClick: (e) => {
                            e.stopPropagation();
                            handleCancel();
                        }, className: "apexx-uploader-cancel" }, "Cancel")))) : (React.createElement("div", { className: "apexx-uploader-content" },
                React.createElement("svg", { className: "apexx-uploader-icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" })),
                React.createElement("p", null, "Drop files here or click to upload"))),
            error && React.createElement("div", { className: "apexx-uploader-error" }, error))));
};

export { FileUploader, useApexxCloud };
//# sourceMappingURL=index.mjs.map
