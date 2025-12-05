import type { Media, MediaStore, MediaUploadOptions } from 'tinacms';

/**
 * A minimal custom media store that handles external URLs (http/https)
 * by passing them through unchanged, while delegating file uploads
 * to the default Tina behavior.
 */
export class ExternalMediaStore implements MediaStore {
    accept = '*';

    async persist(files: MediaUploadOptions[]): Promise<Media[]> {
        // For file uploads, we'll just return the file with a local path
        // In production with Tina Cloud, this would upload to Tina's media manager
        return files.map((file) => ({
            id: file.file.name,
            type: 'file',
            directory: file.directory,
            filename: file.file.name,
        }));
    }

    previewSrc(src: string) {
        // If it's an external URL (starts with http:// or https://), return it unchanged
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return src;
        }

        // Otherwise, treat it as a local file in the uploads directory
        return src;
    }

    async list(options?: { directory?: string; limit?: number }) {
        // Return empty list - we're not managing a file browser for external URLs
        return {
            items: [],
            offset: 0,
        };
    }

    async delete(media: Media): Promise<void> {
        // No-op for external URLs
        return;
    }
}
