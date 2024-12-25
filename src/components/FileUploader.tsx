import React, { useCallback, useState } from "react";
import { useApexxCloud } from "../hooks/useApexxCloud";

interface FileUploaderProps {
  getSignedUrl: (file: File) => Promise<string>;
  onUploadComplete?: (response: any) => void;
  onUploadError?: (error: Error) => void;
  onUploadProgress?: (progress: number) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  getSignedUrl,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
}) => {
  const { upload } = useApexxCloud();
  const [progress, setProgress] = useState(0);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const signedUrl = await getSignedUrl(file);
        await upload(signedUrl, file, {
          onProgress: (progress) => {
            setProgress(progress);
            onUploadProgress?.(progress);
          },
          onComplete: (response) => {
            onUploadComplete?.(response);
          },
          onError: (error) => {
            onUploadError?.(error);
          },
        });
      } catch (error) {
        console.error("Upload failed:", error);
        onUploadError?.(error as Error);
      }
    },
    [getSignedUrl, onUploadComplete, onUploadError, onUploadProgress, upload]
  );

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {progress > 0 && <progress value={progress} max="100" />}
    </div>
  );
};
