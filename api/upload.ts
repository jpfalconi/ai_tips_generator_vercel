import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false,
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
        console.log('Token check:', token ? `Present (${token.substring(0, 10)}...)` : 'Missing');

        if (!token) {
            throw new Error('BLOB_READ_WRITE_TOKEN is missing');
        }

        // Manually consume the stream to a Buffer to avoid stream compatibility issues
        const chunks: Uint8Array[] = [];
        for await (const chunk of request) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const blob = await put(filename, buffer, {
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
