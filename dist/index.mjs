import React, { useRef, useCallback, useState } from 'react';
import StorageSDK from '@apexxcloud/sdk-js';

function useApexxCloud() {
    const sdkRef = useRef(new StorageSDK());
    const upload = useCallback(async (signedUrl, file, options = {}) => {
        try {
            const result = await sdkRef.current.files.upload(signedUrl, file, {
                onProgress: (event) => {
                    var _a;
                    (_a = options.onProgress) === null || _a === void 0 ? void 0 : _a.call(options, event.progress);
                },
                onComplete: (event) => {
                    var _a;
                    (_a = options.onComplete) === null || _a === void 0 ? void 0 : _a.call(options, event.response);
                },
                onError: (event) => {
                    var _a;
                    (_a = options.onError) === null || _a === void 0 ? void 0 : _a.call(options, event.error);
                }
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    }, []);
    return {
        upload,
    };
}

const FileUploader = ({ getSignedUrl, onUploadComplete, onUploadError, onUploadProgress, }) => {
    const { upload } = useApexxCloud();
    const [progress, setProgress] = useState(0);
    const handleFileChange = useCallback(async (event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        try {
            const signedUrl = await getSignedUrl(file);
            await upload(signedUrl, file, {
                onProgress: (progress) => {
                    setProgress(progress);
                    onUploadProgress === null || onUploadProgress === void 0 ? void 0 : onUploadProgress(progress);
                },
                onComplete: (response) => {
                    onUploadComplete === null || onUploadComplete === void 0 ? void 0 : onUploadComplete(response);
                },
                onError: (error) => {
                    onUploadError === null || onUploadError === void 0 ? void 0 : onUploadError(error);
                },
            });
        }
        catch (error) {
            console.error("Upload failed:", error);
            onUploadError === null || onUploadError === void 0 ? void 0 : onUploadError(error);
        }
    }, [getSignedUrl, onUploadComplete, onUploadError, onUploadProgress, upload]);
    return (React.createElement("div", null,
        React.createElement("input", { type: "file", onChange: handleFileChange }),
        progress > 0 && React.createElement("progress", { value: progress, max: "100" })));
};

export { FileUploader, useApexxCloud };
//# sourceMappingURL=index.mjs.map
