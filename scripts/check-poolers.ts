import postgres from 'postgres';

const regions = [
  'aws-0-ap-south-1',
  'aws-1-ap-south-1',
  'aws-0-ap-southeast-1',
  'aws-1-ap-southeast-1',
  'aws-0-ap-northeast-1',
  'aws-0-ap-northeast-2',
  'aws-1-ap-northeast-2',
  'aws-0-us-east-1',
  'aws-0-eu-central-1'
];

async function checkPoolers() {
  for (const region of regions) {
    const poolerUrl = `postgresql://postgres.wtsknwbatuyjfumhtygk:Sangam%23%402026@${region}.pooler.supabase.com:6543/postgres?sslmode=require`;
    try {
      const sql = postgres(poolerUrl, { prepare: false, connect_timeout: 3 });
      const res = await sql`SELECT 1 as ok`;
      console.log(`Region SUCCESS: ${region}`, res);
      await sql.end();
      return region;
    } catch (e: any) {
      console.log(`Region failed ${region}: ${e.message}`);
    }
  }
}

checkPoolers();
