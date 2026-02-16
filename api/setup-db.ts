import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        // Create the "tips" table if it doesn't exist
        const result = await sql`
      CREATE TABLE IF NOT EXISTS tips (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
        return response.status(200).json({ message: 'Table "tips" created successfully', result });
    } catch (error) {
        console.error('Error creating table:', error);
        return response.status(500).json({ error: error });
    }
}
