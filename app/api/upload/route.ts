import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
        return NextResponse.json({ error: 'Filename and body are required' }, { status: 400 });
    }

    // Generate a unique filename to prevent overwrites or collisions
    const uniqueFilename = `${Date.now()}-${filename}`;

    try {
        const blob = await put(uniqueFilename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
