import dotenv from 'dotenv';
import { createPool } from '@vercel/postgres';

dotenv.config({ path: '.env.local' });

async function main() {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
        console.error('POSTGRES_URL not found in .env.local');
        process.exit(1);
    }

    const pool = createPool({
        connectionString: connectionString,
    });

    try {
        console.log('Connecting to database...');
        // The query itself triggers the connection
        console.log('Creating "tips" table...');
        await pool.sql`
      CREATE TABLE IF NOT EXISTS tips (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        console.log('✅ Table "tips" created successfully!');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    } finally {
        await pool.end();
    }
}

main();
