
import { NextResponse } from 'next/server';
import { db, schemes, users } from '@/db';
import { AIService } from '@/lib/ai-service';
import { eq, and, or, desc } from 'drizzle-orm';
import { getSession } from "@/lib/auth";
import { isLocationMatch } from "@/lib/locationMap";

export async function GET(req: Request) {
    try {
        const userPayload = await getSession();
        if (!userPayload?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userProfile = await db.query.users.findFirst({
            where: eq(users.id, userPayload.userId)
        });

        if (!userProfile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // profile data
        const dob = userProfile.dob;
        let userAge = 0;
        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            userAge = today.getFullYear() - birthDate.getFullYear();
            if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
                userAge--;
            }
        }
        
        const userIncome = userProfile.income ? parseFloat(userProfile.income.replace(/[^0-9.]/g, '')) : 0;
        const userOccupation = (userProfile.occupation || '').toLowerCase();
        const userGender = userProfile.gender || 'All';
        const userCategory = (userProfile.category || '').toLowerCase();
        const userLocDetails = [userProfile.village, userProfile.district, userProfile.state].filter(Boolean).join(', ');
        const userLocation = (userLocDetails || userProfile.address || '').toLowerCase();

        // 1. Fetch Candidates (Basic filter)
        let candidates = await db.select().from(schemes).where(eq(schemes.status, 'active'));
        
        // 2. High Precision Scoring
        const rankedCandidates = candidates
            .filter(s => {
                // STRICT GENDER CHECK
                if (s.gender !== 'All' && s.gender !== userGender) return false;

                // STRICT AGE CHECK
                if (userAge > 0) {
                    if (s.ageMin && userAge < s.ageMin) return false;
                    if (s.ageMax && userAge > s.ageMax) return false;
                }

                // STRICT INCOME CHECK
                if (userIncome > 0 && s.incomeLimit && userIncome > s.incomeLimit) return false;

                // STRICT CASTE CHECK (if scheme lists specific castes)
                if (s.caste && s.caste.length > 0 && userCategory) {
                    const normalizedCaste = s.caste.map(c => c.toLowerCase());
                    if (!normalizedCaste.includes(userCategory)) return false;
                }

                const schemeState = s.state.toLowerCase();
                if (schemeState !== 'central' && schemeState !== 'all india') {
                    const { match } = isLocationMatch(userLocation, schemeState);
                    if (!match) return false;
                }

                return true; // Eligible
            })
            .map(s => {
                let score = 50.0; // Base score for eligibility
                const schemeCat = s.category.toLowerCase();
                const schemeTitle = s.title.toLowerCase();

                // --- PRIORITY 1: Occupation-Category Alignment (+40) ---
                if (userOccupation) {
                    // Logic: Farmer -> Agriculture, Student -> Education, Business -> Business/Finance
                    if (userOccupation.includes('farmer') && schemeCat.includes('agri')) score += 40;
                    else if (userOccupation.includes('student') && schemeCat.includes('education')) score += 40;
                    else if ((userOccupation.includes('entrepreneur') || userOccupation.includes('business') || userOccupation.includes('shopkeeper') || userOccupation.includes('self')) && (schemeCat.includes('business') || schemeCat.includes('finance'))) score += 40;
                    
                    // Minor boost for keyword in title/tags (+10)
                    if (schemeTitle.includes(userOccupation)) score += 10;
                    if (s.tags?.some(t => t.toLowerCase().includes(userOccupation))) score += 10;
                }

                // --- PRIORITY 2: Targeted Caste Relevance (+10) ---
                if (s.caste && s.caste.length > 0 && s.caste.length < 4) {
                    score += 10;
                }

                // --- PRIORITY 3: State Specificity (+5) ---
                if (s.state.toLowerCase() !== 'central') {
                    score += 5;
                }

                const finalScore = Math.min(score, 99);
                return { ...s, matchScore: parseFloat(finalScore.toFixed(1)) };
            });

        // Filter and ensure at least 3 candidates are suggested (relaxing matchScore > 50 if needed)
        let finalPool = rankedCandidates.filter(s => s.matchScore > 50);
        if (finalPool.length < 3) {
            const baseEligible = rankedCandidates.filter(s => s.matchScore === 50);
            finalPool = [...finalPool, ...baseEligible];
        }

        const sortedCandidates = finalPool
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 20);

        if (sortedCandidates.length === 0) return NextResponse.json([]);

        const aiReasons = await AIService.generateReasons(userProfile, sortedCandidates.slice(0, 3));

        const finalResults = sortedCandidates.map(s => {
            let reason = "Your profile aligns with the baseline eligibility criteria of this scheme.";
            const cat = s.category.toLowerCase();
            const occ = userOccupation.toLowerCase();
            
            if (occ) {
                if (occ.includes('student') && cat.includes('edu')) {
                    reason = "Recommended specifically to support your educational goals and student status.";
                } else if (occ.includes('farmer') && cat.includes('agri')) {
                    reason = "Directly recommended to support agricultural productivity and farming operations.";
                } else if ((occ.includes('business') || occ.includes('entrepreneur')) && (cat.includes('bus') || cat.includes('fin'))) {
                    reason = "Selected to support your business venture and entrepreneurial expansion.";
                } else if (s.title.toLowerCase().includes(occ)) {
                    reason = `Directly matched with your stated occupation '${userProfile.occupation}'.`;
                }
            }
            
            return {
                ...s,
                // The first three cards use an AI-written explanation when an AI service is
                // configured. The deterministic explanation keeps recommendations available
                // when the AI provider is offline or reaches a free-tier limit.
                matchReason: aiReasons[s.id] || reason
            };
        });

        return NextResponse.json(finalResults);

    } catch (error: any) {
        console.error('Recommendation API Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
