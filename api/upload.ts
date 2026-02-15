import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const filename = request.query.filename as string;

    if (!filename) {
        return response.status(400).json({ error: 'Filename is required' });
    }

    try {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
            throw new Error('BLOB_READ_WRITE_TOKEN is missing');
        }

        // Capture the raw body. 
        // In Vercel Node.js functions, `request.body` is usually already parsed if JSON.
        // For binary/image uploads, passing `request.body` directly to `put` works 
        // if the client sends the binary data as the body.

        const blob = await put(filename, request.body, {
            access: 'public',
            token: token,
            contentType: request.headers['content-type'] || 'image/png'
        });

        return response.status(200).json(blob);
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return response.status(500).json({ error: `Failed to upload image: ${message}` });
    }
}
