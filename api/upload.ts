import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false, // Disabling parsing allows us to consume the request as a stream
    },
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

        // With bodyParser disabled, 'request' is a raw Readable stream.
        // @vercel/blob 'put' accepts a Readable stream.
        // We pass the stream directly for efficient upload.

        // Note: When bodyParser is false, request is a stream.
        // However, the types for VercelRequest might not perfectly reflect this in all TS configs.
        // Casting to any or check if it is compatible with PutCommandOptions['data']

        const blob = await put(filename, request, {
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
