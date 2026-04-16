import cron from 'node-cron';
import puppeteer from 'puppeteer';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { schemes } from '../db/schemas/scheme';

const TARGET_URL = "https://www.india.gov.in/my-government/schemes/search?schemeCategory=12";

// run the scraper every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log("running daily scheme sync...");
    await scrapeGovData();
});

async function scrapeGovData() {
    try {
        console.log("starting puppeteer...");
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // pretending to be a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0');

        console.log("going to the portal...");
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

        // extract links from the page
        const scrapedSchemes = await page.evaluate(() => {
            const results: any[] = [];
            const links = document.querySelectorAll('a');
            
            links.forEach(link => {
                const text = link.innerText.trim();
                
                // check if the link looks like a scheme
                if (text.length > 15 && (text.toLowerCase().includes('yojana') || text.toLowerCase().includes('scheme'))) {
                    results.push({
                        title: text,
                        applicationUrl: link.href,
                        ministry: "Ministry of Agriculture",
                        description: "Data from gov portal",
                        category: "Agriculture",
                        type: "TBD",
                        state: "Central",
                        status: "active",
                        benefits: "TBD",
                        eligibility: "TBD"
                    });
                }
            });
            return results;
        });

        console.log(`found ${scrapedSchemes.length} schemes`);
        await browser.close();

        // save to database
        console.log("checking for duplicates and saving into postgres db...");
        
        let added = 0;
        let updated = 0;

        for (const scheme of scrapedSchemes) {
            // check if scheme already exists so we don't add duplicates
            const existing = await db.query.schemes.findFirst({
                where: eq(schemes.title, scheme.title)
            });

            if (existing) {
                // update existing record
                await db.update(schemes)
                    .set({
                        applicationUrl: scheme.applicationUrl,
                        updatedAt: new Date(),
                    })
                    .where(eq(schemes.id, existing.id));
                
                updated++;
            } else {
                // insert new scheme
                await db.insert(schemes).values(scheme);
                added++;
            }
        }

        console.log(`done! added: ${added}, updated: ${updated}`);
        
    } catch (error) {
        console.error("something went wrong during scraping:", error);
    }
}
