# ApexxCloud React Components

A React library for integrating ApexxCloud file upload functionality into your applications.

## Installation

```bash
npm install @apexxcloud/react
```

## Components

### FileUploader

A React component that provides file upload functionality with progress tracking. The component renders a file input and a progress bar, handling all the upload logic internally.

#### Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `getSignedUrl` | `(file: File) => Promise<string>` | Function to get a signed URL for file upload. This function should implement your backend integration logic. | Yes |
| `onUploadComplete` | `(response: any) => void` | Callback function that fires when the upload successfully completes. The response contains upload details including timestamp and server response. | No |
| `onUploadError` | `(error: any) => void` | Callback function that fires if the upload fails. Receives an error object with type, error details, and timestamp. | No |
| `onUploadProgress` | `(progress: any) => void` | Callback function that fires during upload progress. Receives an object with loaded bytes, total bytes, and progress percentage. | No |

#### Features

- Built-in progress tracking with visual progress bar
- Error handling with optional error callback
- Upload progress updates
- Automatic file selection handling
- TypeScript support

#### Example Usage

```tsx
import { FileUploader } from '@apexxcloud/react';

function MyComponent() {
  // Function to get signed URL from your backend
  const getSignedUrl = async (file: File) => {
    const response = await fetch('/api/get-signed-url', {
      method: 'POST',
      body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    });
    const { signedUrl } = await response.json();
    return signedUrl;
  };

  // Optional callback handlers
  const handleUploadComplete = (response) => {
    console.log('Upload successful:', response);
    // Handle successful upload (e.g., show success message)
  };

  const handleUploadError = (error) => {
    console.error('Upload failed:', error);
    // Handle error (e.g., show error message)
  };

  const handleProgress = (progress) => {
    console.log(`Upload progress: ${progress}%`);
    // Update UI with progress if needed
  };

  return (
    <FileUploader
      getSignedUrl={getSignedUrl}
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      onUploadProgress={handleProgress}
    />
  );
}
```

#### Implementation Details

The FileUploader component:
- Uses the `useApexxCloud` hook internally for upload functionality
- Manages its own progress state
- Renders a basic file input and progress bar
- Handles file selection changes automatically
- Cleans up event listeners properly using useCallback

## Hooks

### useApexxCloud

A custom hook that provides access to ApexxCloud SDK functionality.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `upload` | `(signedUrl: string, file: File, options?: UploadOptions) => Promise<any>` | Function to upload a file |

#### UploadOptions

| Option | Type | Description |
|--------|------|-------------|
| `onProgress` | `(event: { loaded: number, total: number, progress: number, type: string }) => void` | Callback for upload progress updates |
| `onComplete` | `(event: { type: string, response: any, timestamp: Date }) => void` | Callback when upload completes |
| `onError` | `(event: { type: string, error: Error, timestamp: Date }) => void` | Callback when upload fails |
| `onStart` | `(event: { type: string, timestamp: Date, file: { name: string, size: number, type: string } }) => void` | Callback when upload starts |
| `signal` | `AbortSignal` | Optional AbortSignal to cancel the upload |

#### Example Usage

```tsx
import { useApexxCloud } from '@apexxcloud/react';

function MyCustomUploader() {
  const { upload } = useApexxCloud();
  const abortController = new AbortController();

  const handleUpload = async (file: File) => {
    const signedUrl = await getSignedUrl(file);
    
    try {
      await upload(signedUrl, file, {
        onStart: (event) => console.log(`Upload starting for ${event.file.name}`),
        onProgress: (event) => console.log(`Upload progress: ${event.progress}%`),
        onComplete: (event) => console.log('Upload complete:', event.response),
        onError: (event) => console.error('Upload failed:', event.error),
        signal: abortController.signal
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const cancelUpload = () => {
    abortController.abort();
  };

  return (
    // Your custom upload UI
  );
}
```

## Requirements

- React 16.8+ (Hooks support)
- @apexxcloud/sdk-js

## License

[Add your license information here]
