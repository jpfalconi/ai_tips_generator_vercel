import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        if (request.method === 'GET') {
            // Fetch latest 50 tips
            const { rows } = await sql`SELECT * FROM tips ORDER BY created_at DESC LIMIT 50;`;
            return response.status(200).json({ tips: rows });
        }

        if (request.method === 'POST') {
            // Save a new tip
            const { title, content } = request.body;

            if (!title || !content) {
                return response.status(400).json({ error: 'Title and content are required' });
            }

            // Insert data
            const { rows } = await sql`
        INSERT INTO tips (title, content) 
        VALUES (${title}, ${content}) 
        RETURNING *;
      `;

            return response.status(201).json({ tip: rows[0] });
        }

        if (request.method === 'DELETE') {
            const { id } = request.query;

            if (!id) {
                return response.status(400).json({ error: 'ID is required' });
            }

            await sql`DELETE FROM tips WHERE id = ${id as string}`;
            return response.status(200).json({ message: 'Tip deleted successfully' });
        }

        return response.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        console.error('Database error:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
