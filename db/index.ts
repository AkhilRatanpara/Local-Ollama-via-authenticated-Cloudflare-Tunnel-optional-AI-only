import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from "dotenv";

import * as usersSchema from './schemas/user';
import * as schemesSchema from './schemas/scheme';
import * as newsSchema from './schemas/news';
import * as settingsSchema from './schemas/settings';

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_LINK;

if (!connectionString) {
  throw new Error("SUPABASE_DB_LINK or DATABASE_URL must be set. Did you forget to provision a database?");
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { 
  schema: { ...usersSchema, ...schemesSchema, ...newsSchema, ...settingsSchema } 
});

export * from './schemas/user';
export * from './schemas/scheme';
export * from './schemas/news';
export * from './schemas/settings';

