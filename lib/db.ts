import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/models/schema';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Helper function to get a client from the pool
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// Helper function to execute a query with a client
export const executeQuery = async <T>(
  query: string, 
  params: any[] = []
): Promise<T[]> => {
  const client = await getClient();
  try {
    const result = await client.query(query, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
};

// Helper function to execute a transaction
export const executeTransaction = async <T>(
  callback: (client: any) => Promise<T>
): Promise<T> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}; 