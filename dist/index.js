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

var styles = {"container":"FileUploader-module_container__SnM6i","dropzone":"FileUploader-module_dropzone__0gzjg","dropzoneActive":"FileUploader-module_dropzoneActive__uDrdn","dropzoneInactive":"FileUploader-module_dropzoneInactive__gtwy7","uploadProgress":"FileUploader-module_uploadProgress__Ty9oG","progressBar":"FileUploader-module_progressBar__tMYO1","progressFill":"FileUploader-module_progressFill__eg7jm","uploadContent":"FileUploader-module_uploadContent__ji3NP","iconContainer":"FileUploader-module_iconContainer__klW7K","icon":"FileUploader-module_icon__eVJBw","errorContainer":"FileUploader-module_errorContainer__um5Cq","errorText":"FileUploader-module_errorText__Wu1Jb"};

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
    const acceptedFileTypes = accept
        ? Object.keys(accept).join(", ")
        : "All files";
    const maxSizeFormatted = maxSize
        ? `${(maxSize / (1024 * 1024)).toFixed(2)}MB`
        : "Unlimited";
    return (React__default["default"].createElement("div", { className: clsx__default["default"](styles.container, className) },
        React__default["default"].createElement("div", { ...getRootProps(), className: clsx__default["default"](styles.dropzone, isDragActive ? styles.dropzoneActive : styles.dropzoneInactive, uploading
                ? "apexx-cursor-default"
                : "apexx-cursor-pointer hover:apexx-border-gray-400") },
            React__default["default"].createElement("input", { ...getInputProps() }),
            uploading ? (React__default["default"].createElement("div", { className: "space-y-4" },
                React__default["default"].createElement("div", { className: "relative w-full h-2 bg-gray-200 rounded-full overflow-hidden" },
                    React__default["default"].createElement("div", { className: "absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300", style: { width: `${progress}%` } })),
                React__default["default"].createElement("div", { className: "flex items-center justify-between text-sm text-gray-600" },
                    React__default["default"].createElement("span", null,
                        progress.toFixed(0),
                        "% complete"),
                    React__default["default"].createElement("button", { onClick: (e) => {
                            e.stopPropagation();
                            handleCancel();
                        }, className: "px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200" }, "Cancel")))) : (React__default["default"].createElement("div", { className: "text-center space-y-4" },
                React__default["default"].createElement("div", { className: "flex justify-center" },
                    React__default["default"].createElement("svg", { className: clsx__default["default"]("w-12 h-12 transition-colors duration-200", isDragActive ? "text-blue-500" : "text-gray-400"), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React__default["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }))),
                React__default["default"].createElement("div", { className: "space-y-1" },
                    React__default["default"].createElement("p", { className: "text-base font-medium text-gray-700" }, isDragActive
                        ? "Drop your file here"
                        : "Drag & drop your file or click to browse"),
                    React__default["default"].createElement("p", { className: "text-sm text-gray-500" },
                        acceptedFileTypes,
                        " up to ",
                        maxSizeFormatted)))),
            error && (React__default["default"].createElement("div", { className: "mt-4 p-3 bg-red-50 rounded-md" },
                React__default["default"].createElement("p", { className: "text-sm text-red-600" }, error))))));
};

exports.FileUploader = FileUploader;
exports.useApexxCloud = useApexxCloud;
//# sourceMappingURL=index.js.map
