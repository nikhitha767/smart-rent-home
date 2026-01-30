/**
 * Pinata IPFS Upload Service
 * Handles image uploads to IPFS via Pinata API
 */

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

export interface UploadProgress {
    fileName: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
}

/**
 * Upload a single file to IPFS via Pinata
 */
export const uploadFileToIPFS = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> => {
    try {
        if (!PINATA_JWT) {
            throw new Error('Pinata JWT not configured. Please check your .env file.');
        }

        const formData = new FormData();
        formData.append('file', file);

        // Optional: Add metadata
        const metadata = JSON.stringify({
            name: file.name,
            keyvalues: {
                uploadedAt: new Date().toISOString(),
                type: 'property-image'
            }
        });
        formData.append('pinataMetadata', metadata);

        // Optional: Add pinning options
        const options = JSON.stringify({
            cidVersion: 1,
        });
        formData.append('pinataOptions', options);

        // Upload to Pinata
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Return the public gateway URL
        const ipfsUrl = `${PINATA_GATEWAY}/ipfs/${data.IpfsHash}`;

        if (onProgress) {
            onProgress(100);
        }

        return ipfsUrl;
    } catch (error) {
        console.error('IPFS upload error:', error);
        throw error;
    }
};

/**
 * Upload multiple property images to IPFS
 */
export const uploadPropertyImagesToIPFS = async (
    files: File[],
    onProgress?: (progress: number) => void
): Promise<string[]> => {
    try {
        if (!files || files.length === 0) {
            throw new Error('No files provided for upload');
        }

        const uploadPromises = files.map(async (file, index) => {
            const url = await uploadFileToIPFS(file, (fileProgress) => {
                // Calculate overall progress
                const overallProgress = ((index + (fileProgress / 100)) / files.length) * 100;
                if (onProgress) {
                    onProgress(Math.round(overallProgress));
                }
            });
            return url;
        });

        const urls = await Promise.all(uploadPromises);

        if (onProgress) {
            onProgress(100);
        }

        return urls;
    } catch (error) {
        console.error('Error uploading images to IPFS:', error);
        throw new Error('Failed to upload images to IPFS');
    }
};

/**
 * Verify if an IPFS URL is accessible
 */
export const verifyIPFSUrl = async (ipfsUrl: string): Promise<boolean> => {
    try {
        const response = await fetch(ipfsUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('IPFS URL verification failed:', error);
        return false;
    }
};

/**
 * Get IPFS CID from gateway URL
 */
export const getCIDFromUrl = (ipfsUrl: string): string | null => {
    const match = ipfsUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
};

/**
 * Convert IPFS CID to gateway URL
 */
export const cidToGatewayUrl = (cid: string): string => {
    return `${PINATA_GATEWAY}/ipfs/${cid}`;
};

/**
 * Delete/unpin file from IPFS (optional - requires additional Pinata API call)
 */
export const unpinFileFromIPFS = async (cid: string): Promise<void> => {
    try {
        if (!PINATA_JWT) {
            throw new Error('Pinata JWT not configured');
        }

        const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`
            }
        });

        if (!response.ok) {
            throw new Error(`Unpin failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error('IPFS unpin error:', error);
        throw error;
    }
};
