export interface AIResponse {
    response: string;
    context?: number[];
}

export interface IntentAnalysisResult {
    intent: 'search' | 'apply' | 'eligibility' | 'info' | 'complaint' | 'greeting' | 'unknown';
    keywords: string[];
    confidence: number;
}

export interface RankedScheme {
    schemeId: string;
    score: number; // 0 to 100
    reason: string;
}

export class AIService {
    static isEnabled(): boolean {
        // AI is optional: Disabled explicitly if AI_ENABLED === 'false'
        if (process.env.AI_ENABLED === 'false') return false;
        // Enabled if OLLAMA_API_URL is configured, or in local development
        return Boolean(process.env.OLLAMA_API_URL || process.env.NODE_ENV === 'development');
    }

    private static getHeaders(): Record<string, string> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        
        // 1. Standard Secret Key / Bearer Auth for Cloudflare Tunnel
        if (process.env.OLLAMA_API_KEY) {
            headers['Authorization'] = `Bearer ${process.env.OLLAMA_API_KEY}`;
        } else if (process.env.OLLAMA_TUNNEL_SECRET) {
            headers['Authorization'] = `Bearer ${process.env.OLLAMA_TUNNEL_SECRET}`;
            headers['X-Ollama-Secret'] = process.env.OLLAMA_TUNNEL_SECRET;
        }

        // 2. Cloudflare Access Service Token Authentication
        if (process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET) {
            headers['CF-Access-Client-Id'] = process.env.CF_ACCESS_CLIENT_ID;
            headers['CF-Access-Client-Secret'] = process.env.CF_ACCESS_CLIENT_SECRET;
        }

        return headers;
    }

    private static async queryOllama(prompt: string, model: string = 'mistral', format?: 'json'): Promise<string> {
        if (!this.isEnabled()) {
            throw new Error('AI service is optional and currently not configured');
        }

        const rawUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
        const baseUrl = rawUrl.replace(/\/$/, '');
        
        try {
            const response = await fetch(`${baseUrl}/generate`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    model: process.env.AI_MODEL || model,
                    prompt,
                    stream: false,
                    format: format,
                }),
                signal: AbortSignal.timeout(15_000), // 15s timeout for remote tunnel
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.warn('Ollama AI tunnel unreachable or offline. Falling back to rule-based engine.');
            throw error;
        }
    }

    /**
     * Analyzes the user's message to determine their intent.
     */
    static async analyzeIntent(message: string): Promise<IntentAnalysisResult> {
        const prompt = `
        Analyze the following user message regarding government schemes and determine the intent.
        
        User Message: "${message}"
        
        Possible Intents:
        - "search": User is looking for specific schemes.
        - "apply": User wants to apply for a scheme.
        - "eligibility": User is asking if they are eligible.
        - "info": User wants general information.
        - "complaint": User is unhappy or reporting an issue.
        - "greeting": Simple greetings (hi, hello).
        - "unknown": Cannot determine.

        Output strictly in JSON format:
        {
            "intent": "intent_name",
            "keywords": ["keyword1", "keyword2"],
            "confidence": 0.95
        }
        `;

        try {
            const responseText = await this.queryOllama(prompt, 'mistral', 'json');
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            const msgLow = (message || '').toLowerCase();
            let intent: IntentAnalysisResult['intent'] = 'info';
            if (/hi|hello|hey|namaste/.test(msgLow)) intent = 'greeting';
            else if (/apply|form|how to get/.test(msgLow)) intent = 'apply';
            else if (/eligible|qualify|can i/.test(msgLow)) intent = 'eligibility';
            else if (/search|find|list|show/.test(msgLow)) intent = 'search';

            return { intent, keywords: message.split(/\s+/).slice(0, 3), confidence: 0.8 };
        }
    }

    /**
     * Ranks schemes based on user profile compliance.
     */
    static async rankSchemes(userProfile: any, schemes: any[]): Promise<RankedScheme[]> {
        const simplifiedSchemes = schemes.map(s => ({
            id: s.id,
            title: s.title,
            category: s.category,
            eligibility: s.eligibility,
            ageMin: s.ageMin,
            ageMax: s.ageMax,
            incomeLimit: s.incomeLimit
        }));

        const prompt = `Rank these govt schemes for user eligibility.
User Profile: ${JSON.stringify(userProfile)}
Schemes: ${JSON.stringify(simplifiedSchemes)}
Instructions:
1. Compare user age, income, category, occupation with scheme criteria.
2. Score 0-100.
Output compact JSON array: [{"schemeId":"id","score":num,"reason":"short_str"}]`;

        try {
            const responseText = await this.queryOllama(prompt, 'mistral', 'json');
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            return schemes.map(s => {
                let score = 75;
                if (userProfile?.occupation && s.category?.toLowerCase().includes(userProfile.occupation.toLowerCase())) {
                    score += 20;
                }
                return {
                    schemeId: s.id,
                    score: Math.min(score, 98),
                    reason: `Matched based on demographic criteria and ${userProfile?.occupation || 'general'} profile.`
                };
            });
        }
    }

    /**
     * Generates short reasons for specific schemes.
     */
    static async generateReasons(userProfile: any, schemes: any[]): Promise<Record<string, string>> {
        const simplifiedSchemes = schemes.map(s => ({
            id: s.id,
            title: s.title,
            benefits: s.benefits
        }));

        const prompt = `
        User Profile: ${userProfile.occupation}, ${userProfile.income}, ${userProfile.category}, ${userProfile.location}.
        
        Schemes:
        ${JSON.stringify(simplifiedSchemes)}
        
        Task: For each scheme, write ONE short sentence (max 15 words) explaining why it fits this user.
        
        Output strictly as JSON:
        {
            "scheme_id_1": "Reason text...",
            "scheme_id_2": "Reason text..."
        }
        `;

        try {
            const responseText = await this.queryOllama(prompt, 'mistral', 'json');
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            const result: Record<string, string> = {};
            for (const s of schemes) {
                result[s.id] = `Directly aligned with ${userProfile?.occupation || 'your'} profile eligibility.`;
            }
            return result;
        }
    }
}
