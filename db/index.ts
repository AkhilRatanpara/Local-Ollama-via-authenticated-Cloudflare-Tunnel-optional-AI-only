import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from "dotenv";

import * as usersSchema from './schemas/user';
import * as schemesSchema from './schemas/scheme';
import * as newsSchema from './schemas/news';

dotenv.config({ path: ".env" });

const connectionString = process.env.SUPABASE_DB_LINK || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or SUPABASE_DB_LINK must be set. Did you forget to provision a database?");
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { 
  schema: { ...usersSchema, ...schemesSchema, ...newsSchema } 
});

export * from './schemas/user';
export * from './schemas/scheme';
export * from './schemas/news';
