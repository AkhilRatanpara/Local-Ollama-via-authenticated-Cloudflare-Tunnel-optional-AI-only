
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { schemes } from '@/db/schemas/scheme';
import { AIService } from '@/lib/ai-service';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const { userProfile } = await req.json();

        if (!userProfile) {
            return NextResponse.json({ error: 'User profile is required' }, { status: 400 });
        }

        // Fetch all active schemes
        const allSchemes = await db.select().from(schemes).where(eq(schemes.status, 'active'));

        // --- PRE-FILTERING (Reduce LLM load) ---
        // 1. Calculate user age
        let age = 0;
        if (userProfile.dob) {
            const birthDate = new Date(userProfile.dob);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        // 2. Parse Income (assuming it might be a string with commas/symbols)
        const userIncome = userProfile.income ? parseFloat(userProfile.income.toString().replace(/[^0-9.]/g, '')) : Infinity;

        // 3. Filter criteria (Filter at least by hard limits)
        const candidateSchemes = allSchemes.filter(s => {
            // Check Age
            if (s.ageMin && age < s.ageMin) return false;
            if (s.ageMax && age > s.ageMax) return false;

            // Check Income (if scheme has limit and user has income data)
            if (s.incomeLimit && userIncome !== Infinity && userIncome > s.incomeLimit) return false;

            // Check Gender
            if (s.gender && s.gender !== "All" && s.gender !== userProfile.gender) return false;

            // Check Caste/Category
            if (s.caste && s.caste.length > 0 && !s.caste.includes(userProfile.category)) return false;

            return true;
        });

        // 4. Limit to top N for AI processing (to keep it fast)
        const topCandidates = candidateSchemes.slice(0, 12); 

        // If no hard matches found, fall back to a small subset of all schemes (or just say none)
        const schemesToRank = topCandidates.length > 0 ? topCandidates : allSchemes.slice(0, 5);

        // Rank them using AI
        const rankedResults = await AIService.rankSchemes(userProfile, schemesToRank);

        // Sort by score descending
        rankedResults.sort((a, b) => b.score - a.score);

        // Attach full scheme details to the response
        const enrichedResults = rankedResults.map(r => {
            const scheme = allSchemes.find(s => s.id === r.schemeId);
            return {
                ...r,
                title: scheme?.title,
                category: scheme?.category,
                amount: scheme?.amount
            };
        });

        return NextResponse.json(enrichedResults);
    } catch (error: any) {
        console.error('Ranking API Error:', error);
        return NextResponse.json({ error: 'Failed to rank schemes' }, { status: 500 });
    }
}
