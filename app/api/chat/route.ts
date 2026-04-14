import { NextResponse } from 'next/server';
import { db } from '@/db';
import { schemes } from '@/db/schemas/scheme';
import { eq, sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages, userProfile } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;
    const lastMessageLower = lastMessage.toLowerCase();
    let schemeContext = "";

    // --- 1. DETECT SPECIFIC SCHEME INQUIRY ---
    const allActiveSchemes = await db.select().from(schemes).where(eq(schemes.status, 'active'));
    
    // Greedy matching: Look for scheme mentioned anywhere in message
    const findSpecificScheme = () => {
        // Remove conversational filler
        const cleanMsg = lastMessageLower.replace(/hey|hi|hello|please|am i|can i|is there|any|eligible for|tell me about|what is|how to apply for|details of|scheme|yojana/g, "").trim();
        const inputWords = cleanMsg.split(/\s+/).filter((w: string) => w.length >= 2);

        if (inputWords.length === 0) return null;

        for (const s of allActiveSchemes) {
            const titleLow = s.title.toLowerCase();
            const tagsLow = (s.tags || []).map(t => t.toLowerCase());
            const urlLow = (s.applicationUrl || "").toLowerCase();
            
            // 1. Check for Acronym match (MYSY)
            const acronym = s.title.split(/\s+/)
                .filter(w => w.length > 0 && !["for", "the", "of", "and", "under"].includes(w.toLowerCase()))
                .map(w => w[0]).join('').toLowerCase();
            
            if (inputWords.includes(acronym) || acronym === cleanMsg.replace(/\s+/g, '')) return s;

            // 2. Check each input word against title and tags
            for (const word of inputWords) {
                // Ignore very common words if they aren't part of a short acronym
                if (word.length < 3 && !["sc", "st", "bc"].includes(word)) continue;
                
                if (titleLow.includes(word) || tagsLow.includes(word) || urlLow.includes(word)) {
                    // If word is "mysy" and it's in the title or URL, high confidence
                    if (word === "mysy" || word === acronym) return s;
                    
                    // Otherwise, only match if it's a significant part of the title
                    if (word.length > 4 && titleLow.split(/\s+/).includes(word)) return s;
                }
            }
        }
        return null;
    };

    const specificScheme = findSpecificScheme();

    if (specificScheme) {
        let eligibilityStatus = "Unknown (ask for profile details if missing)";
        if (userProfile) {
            let age = 0;
            if (userProfile.dob) {
                const birth = new Date(userProfile.dob);
                const now = new Date();
                age = now.getFullYear() - birth.getFullYear();
                if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
            }
            const income = userProfile.income ? parseFloat(userProfile.income.toString().replace(/[^0-9.]/g, '')) : Infinity;
            
            const isAgeOk = (!specificScheme.ageMin || age >= specificScheme.ageMin) && (!specificScheme.ageMax || age <= specificScheme.ageMax);
            const isIncomeOk = !specificScheme.incomeLimit || income <= specificScheme.incomeLimit;
            const isGenderOk = !specificScheme.gender || specificScheme.gender === "All" || specificScheme.gender === userProfile.gender;
            const isCasteOk = !specificScheme.caste || specificScheme.caste.length === 0 || (userProfile.category && specificScheme.caste.includes(userProfile.category));

            if (isAgeOk && isIncomeOk && isGenderOk && isCasteOk) {
                eligibilityStatus = "ELIGIBLE. Congratulate them and explain why.";
            } else {
                let reason = [];
                if (!isAgeOk) reason.push(`age (${age})`);
                if (!isIncomeOk) reason.push(`income (₹${income})`);
                if (!isGenderOk) reason.push(`gender (${userProfile.gender})`);
                if (!isCasteOk) reason.push(`category (${userProfile.category})`);
                eligibilityStatus = `NOT ELIGIBLE because of: ${reason.join(", ")}. Explain this politely.`;
            }
        }

        schemeContext = `CRITICAL CONTEXT: The user is explicitly asking about "${specificScheme.title}".
DETAILS:
- Title: ${specificScheme.title}
- Benefits: ${specificScheme.benefits}
- Required Documents: ${specificScheme.documentsRequired ? specificScheme.documentsRequired.join(', ') : 'Aadhar, Income/Caste Certificate'}
- Eligibility: ${specificScheme.eligibility}
- Official URL: ${specificScheme.applicationUrl || 'N/A'}
- ELIGIBILITY FOR THIS USER: ${eligibilityStatus}

INSTRUCTION: 
1. Focus ONLY on "${specificScheme.title}". 
2. Do NOT suggest other schemes unless they are complementary.
3. If they asked if they are eligible, give the definitive answer from the 'ELIGIBILITY FOR THIS USER' field above.`;
    } 
    // --- 2. FALLBACK TO RECOMMENDATION FLOW ---
    else if (userProfile && (lastMessageLower.includes("recommend") || lastMessageLower.includes("suggest") || lastMessageLower.includes("eligible"))) {
        let age = 0;
        if (userProfile.dob) {
            const birth = new Date(userProfile.dob);
            const now = new Date();
            age = now.getFullYear() - birth.getFullYear();
            if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
        }
        
        const income = userProfile.income ? parseFloat(userProfile.income.toString().replace(/[^0-9.]/g, '')) : Infinity;

        const matched = allActiveSchemes.filter(s => {
            if (s.ageMin && age < s.ageMin) return false;
            if (s.ageMax && age > s.ageMax) return false;
            if (s.incomeLimit && income !== Infinity && income > s.incomeLimit) return false;
            if (s.gender && s.gender !== "All" && s.gender !== userProfile.gender) return false;
            if (s.caste && s.caste.length > 0 && !s.caste.includes(userProfile.category)) return false;
            return true;
        }).slice(0, 5);

        if (matched.length > 0) {
            schemeContext = `Based on user profile, these schemes are high-match candidates:
${matched.map(s => `- ${s.title}: ${s.description.substring(0, 100)}...`).join('\n')}`;
        }
    }

    const systemPrompt = `You are Sangam AI, a government scheme expert.
User: ${userProfile ? `${userProfile.name} (${userProfile.occupation}, ${userProfile.category})` : "Guest"}
${schemeContext}

Guidelines:
1. If schemeContext above contains "SPECIFIC SCHEME", focus strictly on providing details for that scheme.
2. If schemeContext contains "high-match candidates", suggest them to the user politely.
3. If no scheme context is provided, answer generally or ask for more details.
4. IMPORTANT: NEVER share internal database IDs.
5. Be concise and friendly.`;

    // Connect to Ollama
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
