import fs from 'fs';
import { db } from '../db/index';
import { schemes } from '../db/schemas/scheme';

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      cur.push(field);
      field = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  return rows.filter(r => r.length > 1);
}

async function run() {
  const existingDbSchemes = await db.select().from(schemes);
  console.log(`Current schemes in DB: ${existingDbSchemes.length}`);

  const csvFile = fs.readFileSync('sangam_schemes_cleaned_enriched.csv', 'utf8');
  const csvRows = parseCSV(csvFile);
  const header = csvRows[0];
  const records = csvRows.slice(1);
  console.log(`CSV records in sangam_schemes_cleaned_enriched.csv: ${records.length}`);

  const dbIds = new Set(existingDbSchemes.map(s => s.id));
  const dbTitles = new Set(existingDbSchemes.map(s => s.title.toLowerCase().trim()));

  let inDbById = 0;
  let inDbByTitle = 0;
  let newRecords = 0;

  for (const r of records) {
    const id = r[0];
    const title = r[1]?.toLowerCase().trim();
    if (dbIds.has(id)) {
      inDbById++;
    } else if (dbTitles.has(title)) {
      inDbByTitle++;
    } else {
      newRecords++;
    }
  }

  console.log(`Matching DB by ID: ${inDbById}`);
  console.log(`Matching DB by Title (different ID): ${inDbByTitle}`);
  console.log(`Completely New Records not in DB: ${newRecords}`);
}

run().catch(console.error).finally(() => process.exit(0));
