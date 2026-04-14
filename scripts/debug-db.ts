import { db } from '../db';
import { schemes } from '../db/schemas/scheme';

async function run() {
    try {
        const all = await db.select({
            id: schemes.id,
            title: schemes.title,
            tags: schemes.tags,
            description: schemes.description,
            applicationUrl: schemes.applicationUrl
        }).from(schemes);
        console.log('--- ALL SCHEMES IN DB ---');
        all.forEach(s => {
            const acronym = s.title.split(/\s+/).filter(w => w.length > 0).map(w => w[0]).join('').toLowerCase();
            console.log(`Title: "${s.title}" | Acronym: "${acronym}" | Tags: ${JSON.stringify(s.tags)} | URL: ${s.applicationUrl}`);
        });
    } catch (e) {
        console.error(e);
    }
}

run();
