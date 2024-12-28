'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ApexxCloud = require('@apexxcloud/sdk-js');
var reactDropzone = require('react-dropzone');
var clsx = require('clsx');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var ApexxCloud__default = /*#__PURE__*/_interopDefaultLegacy(ApexxCloud);
var clsx__default = /*#__PURE__*/_interopDefaultLegacy(clsx);

function useApexxCloud() {
    const sdkRef = React.useRef(new ApexxCloud__default["default"]());
    const upload = React.useCallback(async (getSignedUrl, file, options = {}) => {
        try {
            const result = await sdkRef.current.files.upload(file, getSignedUrl, options);
            return result;
        }
        catch (error) {
            throw error;
        }
    }, []);
    const uploadMultipart = React.useCallback(async (getSignedUrl, file, options = {}) => {
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
    const [progress, setProgress] = React.useState(0);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const abortControllerRef = React.useRef(null);
    const handleProgress = React.useCallback((event) => {
        setProgress(event.progress);
    }, []);
    const handleUpload = React.useCallback(async (file) => {
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
    const handleCancel = React.useCallback(() => {
        var _a;
        (_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.abort();
        setUploading(false);
        setProgress(0);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = reactDropzone.useDropzone({
        onDrop: React.useCallback((acceptedFiles) => {
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
    return (React__default["default"].createElement("div", { className: clsx__default["default"]("apexx-uploader-container", className) },
        React__default["default"].createElement("div", { ...getRootProps(), className: clsx__default["default"]("apexx-uploader-dropzone", isDragActive && "active", uploading && "disabled") },
            React__default["default"].createElement("input", { ...getInputProps() }),
            uploading ? (React__default["default"].createElement("div", { className: "apexx-uploader-progress" },
                React__default["default"].createElement("div", { className: "apexx-uploader-progress-bar" },
                    React__default["default"].createElement("div", { className: "apexx-uploader-progress-fill", style: { width: `${progress}%` } })),
                React__default["default"].createElement("div", { style: {
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "0.5rem",
                    } },
                    React__default["default"].createElement("span", null,
                        progress.toFixed(0),
                        "% complete"),
                    React__default["default"].createElement("button", { onClick: (e) => {
                            e.stopPropagation();
                            handleCancel();
                        }, className: "apexx-uploader-cancel" }, "Cancel")))) : (React__default["default"].createElement("div", { className: "apexx-uploader-content" },
                React__default["default"].createElement("svg", { className: "apexx-uploader-icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React__default["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" })),
                React__default["default"].createElement("p", null, "Drop files here or click to upload"))),
            error && React__default["default"].createElement("div", { className: "apexx-uploader-error" }, error))));
};

exports.FileUploader = FileUploader;
exports.useApexxCloud = useApexxCloud;
//# sourceMappingURL=index.js.map
