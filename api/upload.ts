import { put } from '@vercel/blob';

export const config = {
    runtime: 'edge', // Using Edge runtime for better performance and potential Blob compatibility
};

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');

    if (!filename) {
        return new Response(JSON.stringify({ error: 'Filename is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
            throw new Error('BLOB_READ_WRITE_TOKEN is missing');
        }

        // Edge runtime receives the body directly in the request stream
        const blob = await put(filename, request.body, {
            access: 'public',
            token: token,
        });

        return new Response(JSON.stringify(blob), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: `Failed to upload image: ${message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
