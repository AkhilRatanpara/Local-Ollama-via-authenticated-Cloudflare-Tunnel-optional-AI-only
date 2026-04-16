import { NextResponse } from 'next/server';
import { db } from '@/db';
import { schemes } from '@/db/schemas/scheme';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages, userProfile } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;
    const lastMessageLower = lastMessage.toLowerCase();

    // =============================================
    // 1. LOAD ENTIRE DATABASE INTO MEMORY
    // =============================================
    const allActiveSchemes = await db.select().from(schemes).where(eq(schemes.status, 'active'));

    // =============================================
    // 2. BUILD FULL DATABASE SUMMARY (always sent)
    // =============================================
    const categoryMap: Record<string, string[]> = {};
    for (const s of allActiveSchemes) {
      if (!categoryMap[s.category]) categoryMap[s.category] = [];
      categoryMap[s.category].push(s.title);
    }

    const dbSummary = `DATABASE OVERVIEW (REAL-TIME FROM DATABASE):
Total Active Schemes: ${allActiveSchemes.length}
Categories: ${Object.keys(categoryMap).join(', ')}
${Object.entries(categoryMap).map(([cat, titles]) =>
  `\n[${cat}] (${titles.length} schemes): ${titles.join(' | ')}`
).join('')}`;

    // =============================================
    // 3. INCOME PARSER UTILITY
    // =============================================
    const getIncome = (incomeStr: any) => {
      if (!incomeStr) return Infinity;
      const s = incomeStr.toString().toLowerCase();
      if (s.includes('below_1_lakh') || s.includes('below 1 lakh')) return 100000;
      if (s.includes('1_to_2.5_lakh') || s.includes('1 to 2.5 lakh')) return 250000;
      if (s.includes('2.5_to_5_lakh') || s.includes('2.5 to 5 lakh')) return 500000;
      if (s.includes('above_5_lakh') || s.includes('above 5 lakh')) return Infinity;
      if (!isNaN(Number(incomeStr))) return Number(incomeStr);
      return Infinity;
    };

    // =============================================
    // 4. USER PROFILE CALCULATIONS
    // =============================================
    let age = 0;
    let income = Infinity;
    if (userProfile) {
      if (userProfile.dob) {
        const birth = new Date(userProfile.dob);
        const now = new Date();
        age = now.getFullYear() - birth.getFullYear();
        if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
      }
      income = getIncome(userProfile.income);
    }

    // =============================================
    // 5. SMART SEARCH — score schemes against query
    // =============================================
    let queryLower = lastMessageLower.replace(/[^a-z0-9\s]/g, "");
    // Synonym expansion
    if (/scholarship|student|study|college/.test(queryLower)) queryLower += " education";
    if (/health|medical|hospital|doctor/.test(queryLower)) queryLower += " healthcare";
    if (/farmer|crop|kisan|agriculture/.test(queryLower)) queryLower += " agriculture";
    if (/startup|loan|business|enterprise/.test(queryLower)) queryLower += " business finance";
    if (/home|house|housing|awas/.test(queryLower)) queryLower += " housing";
    if (/pension|old age|senior|elderly/.test(queryLower)) queryLower += " social welfare";
    if (/woman|women|girl|mahila/.test(queryLower)) queryLower += " Female";

    const stopWords = new Set(["for", "with", "the", "and", "how", "what", "can", "tell", "about", "you", "have", "are", "there", "any", "please", "hey", "hi", "hello", "which", "show", "list", "give", "need", "want", "get", "find", "know", "many", "much", "does", "this", "that", "from"]);
    const userWords = queryLower.split(/\s+/).filter((w: string) => w.length > 2 && !stopWords.has(w));

    const scoredSchemes = allActiveSchemes.map(s => {
      let score = 0;
      const titleLow = s.title.toLowerCase();
      const descLow = s.description.toLowerCase();
      const catLow = s.category.toLowerCase();
      const tagLow = s.tags ? s.tags.map((t: string) => t.toLowerCase()) : [];
      const benefitsLow = s.benefits.toLowerCase();

      for (const word of userWords) {
        if (titleLow.includes(word)) score += 10;
        if (catLow.includes(word)) score += 5;
        if (tagLow.some((t: string) => t.includes(word))) score += 5;
        if (benefitsLow.includes(word)) score += 2;
        if (descLow.includes(word)) score += 1;
      }

      // Eligibility boost when user wants recommendations
      if (userProfile && /recommend|suggest|eligible|match|suit/.test(lastMessageLower)) {
        const isAgeOk = (!s.ageMin || age >= s.ageMin) && (!s.ageMax || age <= s.ageMax);
        const isIncomeOk = !s.incomeLimit || income <= s.incomeLimit;
        const isGenderOk = !s.gender || ["all", "any"].includes(s.gender.toLowerCase()) || s.gender.toLowerCase() === userProfile.gender?.toLowerCase();
        const isCasteOk = !s.caste || s.caste.length === 0 || s.caste.some((c: string) => ["all", "any"].includes(c.toLowerCase())) || (userProfile.category && s.caste.map((c: string) => c.toLowerCase()).includes(userProfile.category.toLowerCase()));
        if (isAgeOk && isIncomeOk && isGenderOk && isCasteOk) score += 3;
      }

      return { scheme: s, score };
    });

    // Top 5 relevant schemes with full detail
    const topMatches = scoredSchemes
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    let detailedContext = "";
    if (topMatches.length > 0) {
      detailedContext = "\n\nDETAILED SCHEME DATA (from database search):\n" + topMatches.map((match, index) => {
        const s = match.scheme;

        let eligLine = "";
        if (userProfile) {
          const isAgeOk = (!s.ageMin || age >= s.ageMin) && (!s.ageMax || age <= s.ageMax);
          const isIncomeOk = !s.incomeLimit || income <= s.incomeLimit;
          const isGenderOk = !s.gender || ["all", "any"].includes(s.gender.toLowerCase()) || s.gender.toLowerCase() === userProfile.gender?.toLowerCase();
          const isCasteOk = !s.caste || s.caste.length === 0 || s.caste.some((c: string) => ["all", "any"].includes(c.toLowerCase())) || (userProfile.category && s.caste.map((c: string) => c.toLowerCase()).includes(userProfile.category.toLowerCase()));

          if (isAgeOk && isIncomeOk && isGenderOk && isCasteOk) {
            eligLine = "\n- User Eligibility: ELIGIBLE ✓";
          } else {
            const reasons: string[] = [];
            if (!isAgeOk) reasons.push(`age needs ${s.ageMin ?? 'any'}-${s.ageMax ?? 'any'}, user is ${age}`);
            if (!isIncomeOk) reasons.push(`income limit ₹${s.incomeLimit}, user exceeds`);
            if (!isGenderOk) reasons.push(`needs ${s.gender}, user is ${userProfile.gender || 'unknown'}`);
            if (!isCasteOk) reasons.push(`needs ${s.caste?.join('/')}, user is ${userProfile.category || 'unknown'}`);
            eligLine = `\n- User Eligibility: NOT ELIGIBLE (${reasons.join('; ')})`;
          }
        }

        return `[${index + 1}] ${s.title}
- Category: ${s.category}
- Benefits: ${s.benefits}
- Eligibility: ${s.eligibility}
- Documents: ${s.documentsRequired?.join(', ') || 'Aadhar, Income Certificate'}
- Application URL: ${s.applicationUrl || 'N/A'}${eligLine}`;
      }).join('\n\n');
    }

    // =============================================
    // 6. SYSTEM PROMPT — database-grounded
    // =============================================
    const systemPrompt = `You are Sangam AI, a helpful government scheme assistant.
${userProfile ? `User: ${userProfile.name}, Age: ${age}, Gender: ${userProfile.gender || 'N/A'}, Category: ${userProfile.category || 'N/A'}, Occupation: ${userProfile.occupation || 'N/A'}, Income: ${userProfile.income || 'N/A'}, Location: ${[userProfile.village, userProfile.district, userProfile.state].filter(Boolean).join(', ') || 'N/A'}` : "User: Guest (not logged in)"}

${dbSummary}
${detailedContext}

RULES:
1. You have FULL access to the database above. Use it to answer ALL questions accurately.
2. When asked "how many schemes", answer with the exact total from DATABASE OVERVIEW.
3. When asked about a category, list scheme names from that category shown above.
4. When asked about a specific scheme, use DETAILED SCHEME DATA if available.
5. ONLY mention schemes that exist in the database above. NEVER invent or hallucinate schemes.
6. If a scheme is not found above, say "This scheme is not in our database."
7. Keep answers SHORT and DIRECT. Use bullet points. No filler text.
8. Refuse non-government-scheme questions politely.`;

    // =============================================
    // 7. SEND TO OLLAMA
    // =============================================
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) { controller.close(); return; }
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line);
                if (json.message?.content) {
                  controller.enqueue(new TextEncoder().encode(json.message.content));
                }
              } catch (e) {}
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

