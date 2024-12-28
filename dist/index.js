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

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".apexx-uploader-container {\n  width: 100%;\n  max-width: 42rem;\n  margin: 0 auto;\n}\n\n.apexx-uploader-dropzone {\n  padding: 1.5rem;\n  border: 2px dashed #e5e7eb;\n  border-radius: 0.5rem;\n  transition: all 0.2s ease;\n  background: white;\n}\n\n.apexx-uploader-dropzone.active {\n  border-color: #3b82f6;\n  background: #eff6ff;\n}\n\n.apexx-uploader-dropzone:not(.disabled):hover {\n  border-color: #9ca3af;\n  cursor: pointer;\n}\n\n.apexx-uploader-progress {\n  margin-top: 1rem;\n}\n\n.apexx-uploader-progress-bar {\n  position: relative;\n  width: 100%;\n  height: 0.5rem;\n  background: #e5e7eb;\n  border-radius: 9999px;\n  overflow: hidden;\n}\n\n.apexx-uploader-progress-fill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background: #3b82f6;\n  transition: width 0.3s ease;\n}\n\n.apexx-uploader-content {\n  text-align: center;\n}\n\n.apexx-uploader-icon {\n  width: 3rem;\n  height: 3rem;\n  margin: 0 auto 1rem;\n  color: #9ca3af;\n  transition: color 0.2s ease;\n}\n\n.active .apexx-uploader-icon {\n  color: #3b82f6;\n}\n\n.apexx-uploader-error {\n  margin-top: 1rem;\n  padding: 0.75rem;\n  background: #fef2f2;\n  border-radius: 0.375rem;\n  color: #dc2626;\n  font-size: 0.875rem;\n}\n\n.apexx-uploader-cancel {\n  padding: 0.25rem 0.75rem;\n  color: #dc2626;\n  font-size: 0.875rem;\n  border-radius: 0.375rem;\n  transition: all 0.2s ease;\n}\n\n.apexx-uploader-cancel:hover {\n  background: #fef2f2;\n  color: #b91c1c;\n}\n\n.apexx-uploader-limits {\n  color: #666;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n}\n\n.apexx-uploader-error {\n  color: #dc2626;\n  margin-top: 0.5rem;\n  font-size: 0.875rem;\n}\n";
styleInject(css_248z);

const FileUploader = ({ getSignedUrl, onUploadComplete, onUploadError, multipart = false, accept, maxSize, }) => {
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
    const { getRootProps, getInputProps, isDragActive, fileRejections } = reactDropzone.useDropzone({
        onDrop: React.useCallback((acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file)
                handleUpload(file);
        }, [handleUpload]),
        accept,
        maxSize: maxSize ? maxSize * 1024 * 1024 : undefined,
        multiple: false,
        disabled: uploading,
    });
    const acceptedFileTypes = accept
        ? Object.values(accept).flat().join(", ")
        : "All files";
    const maxSizeFormatted = maxSize ? `${maxSize}MB` : "Unlimited";
    return (React__default["default"].createElement("div", { className: clsx__default["default"]("apexx-uploader-container") },
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
                React__default["default"].createElement("p", null, "Drop files here or click to upload"),
                React__default["default"].createElement("small", { className: "apexx-uploader-limits" },
                    "Accepted: ",
                    acceptedFileTypes,
                    React__default["default"].createElement("br", null),
                    "Max size: ",
                    maxSizeFormatted))),
            fileRejections.length > 0 && (React__default["default"].createElement("div", { className: "apexx-uploader-error" }, fileRejections[0].errors.map((err) => err.message).join(", "))),
            error && React__default["default"].createElement("div", { className: "apexx-uploader-error" }, error))));
};

exports.FileUploader = FileUploader;
exports.useApexxCloud = useApexxCloud;
//# sourceMappingURL=index.js.map
