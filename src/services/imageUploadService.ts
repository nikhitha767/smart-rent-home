import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Upload multiple property images to Firebase Storage
 * @param files - Array of image files to upload
 * @param propertyId - Unique property ID for organizing images
 * @param onProgress - Optional callback for upload progress
 * @returns Array of download URLs
 */
export const uploadPropertyImages = async (
    files: File[],
    propertyId: string,
    onProgress?: (progress: number) => void
): Promise<string[]> => {
    const uploadPromises = files.map((file, index) => {
        return new Promise<string>((resolve, reject) => {
            // Create unique filename
            const timestamp = Date.now();
            const filename = `${timestamp}_${index}_${file.name}`;
            const storageRef = ref(storage, `properties/${propertyId}/${filename}`);

            // Create upload task
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Calculate overall progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(progress);
                    }
                },
                (error) => {
                    console.error("Upload error:", error);
                    reject(error);
                },
                async () => {
                    // Upload completed successfully
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    });

    try {
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error("Error uploading images:", error);
        throw new Error("Failed to upload images");
    }
};

/**
 * Delete property images from Firebase Storage
 * @param urls - Array of image URLs to delete
 */
export const deletePropertyImages = async (urls: string[]): Promise<void> => {
    const deletePromises = urls.map(async (url) => {
        try {
            // Extract path from URL
            const urlObj = new URL(url);
            const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
            const imageRef = ref(storage, path);
            await deleteObject(imageRef);
        } catch (error) {
            console.error("Error deleting image:", error);
            // Continue with other deletions even if one fails
        }
    });

    await Promise.all(deletePromises);
};

/**
 * Upload a single image with progress tracking
 * @param file - Image file to upload
 * @param path - Storage path
 * @param onProgress - Progress callback
 * @returns Download URL
 */
export const uploadSingleImage = async (
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) {
                    onProgress(progress);
                }
            },
            (error) => {
                console.error("Upload error:", error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};
