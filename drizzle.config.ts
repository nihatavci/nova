import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Parse the connection string
var parsedUrl = new URL(process.env.DATABASE_URL);
var credentials = parsedUrl.username.split(':');
var username = credentials[0];
var password = credentials[1];

export default {
  schema: './models/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port),
    user: username,
    password: password,
    database: parsedUrl.pathname.substring(1), // Remove leading slash
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
} satisfies Config; 