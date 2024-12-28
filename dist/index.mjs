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
    const acceptedFileTypes = accept
        ? Object.keys(accept).join(", ")
        : "All files";
    const maxSizeFormatted = maxSize
        ? `${(maxSize / (1024 * 1024)).toFixed(2)}MB`
        : "Unlimited";
    return (React.createElement("div", { className: clsx("apexx-w-full apexx-max-w-2xl apexx-mx-auto", className) },
        React.createElement("div", { ...getRootProps(), className: clsx("apexx-p-6 apexx-border-2 apexx-border-dashed apexx-rounded-lg apexx-transition-colors apexx-duration-200", isDragActive
                ? "apexx-border-blue-500 apexx-bg-blue-50"
                : "apexx-border-gray-300 apexx-bg-white", uploading
                ? "apexx-cursor-default"
                : "apexx-cursor-pointer hover:apexx-border-gray-400") },
            React.createElement("input", { ...getInputProps() }),
            uploading ? (React.createElement("div", { className: "apexx-space-y-4" },
                React.createElement("div", { className: "apexx-relative apexx-w-full apexx-h-2 apexx-bg-gray-200 apexx-rounded-full apexx-overflow-hidden" },
                    React.createElement("div", { className: "apexx-absolute apexx-top-0 apexx-left-0 apexx-h-full apexx-bg-blue-500 apexx-transition-all apexx-duration-300", style: { width: `${progress}%` } })),
                React.createElement("div", { className: "apexx-flex apexx-items-center apexx-justify-between apexx-text-sm apexx-text-gray-600" },
                    React.createElement("span", null,
                        progress.toFixed(0),
                        "% complete"),
                    React.createElement("button", { onClick: (e) => {
                            e.stopPropagation();
                            handleCancel();
                        }, className: "apexx-px-3 apexx-py-1 apexx-text-sm apexx-text-red-600 hover:apexx-text-red-700 hover:apexx-bg-red-50 apexx-rounded-md apexx-transition-colors apexx-duration-200" }, "Cancel")))) : (React.createElement("div", { className: "apexx-text-center apexx-space-y-4" },
                React.createElement("div", { className: "apexx-flex apexx-justify-center" },
                    React.createElement("svg", { className: clsx("apexx-w-12 apexx-h-12 apexx-transition-colors apexx-duration-200", isDragActive ? "apexx-text-blue-500" : "apexx-text-gray-400"), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }))),
                React.createElement("div", { className: "apexx-space-y-1" },
                    React.createElement("p", { className: "apexx-text-base apexx-font-medium apexx-text-gray-700" }, isDragActive
                        ? "Drop your file here"
                        : "Drag & drop your file or click to browse"),
                    React.createElement("p", { className: "apexx-text-sm apexx-text-gray-500" },
                        acceptedFileTypes,
                        " up to ",
                        maxSizeFormatted)))),
            error && (React.createElement("div", { className: "apexx-mt-4 apexx-p-3 apexx-bg-red-50 apexx-rounded-md" },
                React.createElement("p", { className: "apexx-text-sm apexx-text-red-600" }, error))))));
};

export { FileUploader, useApexxCloud };
//# sourceMappingURL=index.mjs.map
