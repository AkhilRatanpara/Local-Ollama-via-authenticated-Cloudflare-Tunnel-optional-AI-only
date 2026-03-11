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
    
    // Try to find if user mentioned a scheme title specifically
    const specificScheme = allActiveSchemes.find(s => 
        lastMessageLower.includes(s.title.toLowerCase()) || 
        (s.title.length > 10 && lastMessageLower.includes(s.title.toLowerCase().substring(0, 15)))
    );

    if (specificScheme) {
        schemeContext = `User is asking about a SPECIFIC SCHEME:
Title: ${specificScheme.title}
Category: ${specificScheme.category}
Benefits: ${specificScheme.benefits}
Eligibility: ${specificScheme.eligibility}
Documents Required: ${specificScheme.documentsRequired ? specificScheme.documentsRequired.join(', ') : 'Not specified'}
Amount: ${specificScheme.amount}

Provide full details about this specific scheme and answer the user's question accurately based on this data.`;
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
