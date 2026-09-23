import postgres from 'postgres';
import * as dotenv from 'dotenv';
import dns from 'dns/promises';

dotenv.config();

async function test() {
  console.log('Resolving DNS for db.wtsknwbatuyjfumhtygk.supabase.co:');
  try {
    const addresses = await dns.lookup('db.wtsknwbatuyjfumhtygk.supabase.co', { all: true });
    console.log('DNS addresses:', addresses);
  } catch (e: any) {
    console.error('DNS error:', e.message);
  }

  console.log('Connecting with SUPABASE_DB_LINK:', process.env.SUPABASE_DB_LINK);
  const sql = postgres(process.env.SUPABASE_DB_LINK!, { prepare: false });
  try {
    const res = await sql`SELECT count(*) FROM schemes`;
    console.log('Schemes count:', res);
  } catch (e: any) {
    console.error('Query error:', e);
  } finally {
    await sql.end();
  }
}

test();
