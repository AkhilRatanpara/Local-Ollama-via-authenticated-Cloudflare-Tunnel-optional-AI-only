import fs from 'fs';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// Parse CSV properly handling quoted multiline fields
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      cur.push(field); field = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      cur.push(field);
      if (cur.some(f => f.trim())) rows.push(cur);
      cur = []; field = '';
    } else {
      field += c;
    }
  }
  if (cur.length > 0) { cur.push(field); if (cur.some(f => f.trim())) rows.push(cur); }
  return rows;
}

function safeArr(val: string): string[] | null {
  if (!val || val.trim() === '' || val.trim() === '[]') return null;
  try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
}

function safeNum(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function safeInt(val: string): number | null {
  const n = parseInt(val);
  return isNaN(n) ? null : n;
}

function safeBool(val: string): boolean | null {
  if (!val || val.trim() === '') return null;
  return val.toLowerCase() === 'true';
}

function safeDate(val: string): Date | null {
  if (!val || val.trim() === '' || val.toLowerCase() === 'ongoing' || val.toLowerCase() === 'null') return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function safeStatus(val: string): string {
  const v = val?.toLowerCase().trim();
  if (v === 'active' || v === 'closed' || v === 'upcoming') return v;
  return 'active';
}

async function run() {
  const connStr = process.env.SUPABASE_DB_LINK!;
  const sql = postgres(connStr, { prepare: false });

  // Get existing titles from DB
  const existing = await sql`SELECT id, title FROM schemes`;
  const existingTitles = new Set(existing.map(r => (r.title as string).toLowerCase().trim()));
  console.log(`DB currently has ${existing.length} schemes`);

  // Parse new CSV
  const content = fs.readFileSync('Sangam_schems.csv', 'utf8');
  const rows = parseCSV(content);
  const header = rows[0];
  const records = rows.slice(1);
  console.log(`New CSV has ${records.length} records`);

  // Map header to indices
  const col = (name: string) => header.indexOf(name);

  let insertedCount = 0;
  let skippedCount = 0;
  const batchSize = 50;
  const toInsert: any[] = [];

  for (const r of records) {
    const title = r[col('title')]?.trim();
    if (!title) { skippedCount++; continue; }
    if (existingTitles.has(title.toLowerCase())) { skippedCount++; continue; }

    toInsert.push({
      title,
      ministry: r[col('ministry')]?.trim() || 'Unknown Ministry',
      description: r[col('description')]?.trim() || '',
      category: r[col('category')]?.trim() || 'General',
      type: r[col('type')]?.trim() || 'Scheme',
      state: r[col('state')]?.trim() || 'Central',
      benefits: safeArr(r[col('benefits')]) || [],
      eligibility: safeArr(r[col('eligibility')]) || [],
      documents_required: safeArr(r[col('documents_required')]),
      amount: safeNum(r[col('amount')]),
      short_benefits: r[col('short_benefits')]?.trim() || null,
      interest_rate: safeNum(r[col('interest_rate')]),
      tenure_max: safeInt(r[col('tenure_max')]),
      collateral_required: safeBool(r[col('collateral_required')]),
      moratorium_months: safeInt(r[col('moratorium_months')]),
      interest_subvention: safeNum(r[col('interest_subvention')]),
      lending_partners: safeArr(r[col('lending_partners')]),
      subsidy_percentage: safeNum(r[col('subsidy_percentage')]),
      subsidy_max_amount: safeNum(r[col('subsidy_max_amount')]),
      dbt_status: safeBool(r[col('dbt_status')]),
      vendor_empanelled: safeBool(r[col('vendor_empanelled')]),
      gender: r[col('gender')]?.trim() || 'All',
      age_min: safeInt(r[col('age_min')]),
      age_max: safeInt(r[col('age_max')]),
      income_limit: safeNum(r[col('income_limit')]),
      caste: safeArr(r[col('caste')]),
      residence: r[col('residence')]?.trim() || 'Both',
      deadline: safeDate(r[col('deadline')]),
      status: safeStatus(r[col('status')]),
      application_url: r[col('application_url')]?.trim() || null,
      tags: safeArr(r[col('tags')]),
      applications_count: safeInt(r[col('applications_count')]) || 0,
    });
  }

  console.log(`Will insert ${toInsert.length} new schemes, skipping ${skippedCount} already in DB`);

  // Insert in batches
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    await sql`INSERT INTO schemes ${sql(batch)}`;
    insertedCount += batch.length;
    console.log(`Inserted ${insertedCount}/${toInsert.length}...`);
  }

  const finalCount = await sql`SELECT count(*) FROM schemes`;
  console.log(`\n✅ Done! Inserted ${insertedCount} new schemes.`);
  console.log(`✅ DB now has ${finalCount[0].count} total schemes.`);

  await sql.end();
}

run().catch(e => { console.error('Error:', e); process.exit(1); });
