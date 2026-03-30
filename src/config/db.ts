import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Ensure the connection string works with pg (it might need SSL options in prod, but local is fine)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL connected successfully');
        client.release();
    } catch (error) {
        console.error('❌ PostgreSQL connection error:', error);
    }
};

export const disconnectDB = async () => {
    await pool.end();
};

export default pool;
