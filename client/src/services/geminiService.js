// Gemini AI Service - Interview Question Generation with API Key Rotation
// Uses multiple API keys with automatic fallback

const GEMINI_API_KEYS = [
    'AIzaSyDVY4zBTunPZt_92g0QJOk7zIO0cHt98jI',
    'AIzaSyAKpbPHV_mTHhm6qOGIeUbh63NeNpj6hcQ',
    'AIzaSyDvCSG7wqyKuufEUqJqBrb_2bebwwtic8s',
    'AIzaSyAu2dyrvY5uz-7w6a-4eZPQ9ZN_S9Qug60',
    'AIzaSyDw-2lvbbbxghnIM_HIbHji31f8ztE',
    'AIzaSyBa3JMR0keVPKdOt2qlNWkiDU2fCYkarzQ',
    'AIzaSyAlbf9bCDaeJQE-r_Kw4P-TZ4ZduKMig2I',
    'AIzaSyC83Dt_udhUzV-6zSOdpl5w9HsPAQrj6q0',
    'AIzaSyD0t8K7O5qG92AM-LdDL3Hi5HJi31f8ztE',
    'AIzaSyB-XwB1TntMXYYEBF_O_vs9cASOUoPoL8Q',
    'AIzaSyBsbK_K7PXqXfQiW7wbxGz2SYsS4V3ywTs',
    'AIzaSyA0f08esf39l7TkHIQNfwVCSCuG_4Asi0A',
    'AIzaSyBhwvjRJd79IOaMfRaQfElQ0Ncy2NdSH8U',
    'AIzaSyBeqgG0eq5AVyRFxewzpCSyaQPHlA7uuGk'
];

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

class GeminiService {
    constructor() {
        this.currentKeyIndex = 0;
        this.failedKeys = new Set();
    }

    // Get current API key
    getCurrentKey() {
        return GEMINI_API_KEYS[this.currentKeyIndex];
    }

    // Rotate to next available key
    rotateKey() {
        const startIndex = this.currentKeyIndex;
        do {
            this.currentKeyIndex = (this.currentKeyIndex + 1) % GEMINI_API_KEYS.length;
            if (!this.failedKeys.has(this.currentKeyIndex)) {
                return true;
            }
        } while (this.currentKeyIndex !== startIndex);
        return false; // All keys exhausted
    }

    // Mark current key as failed
    markKeyFailed() {
        this.failedKeys.add(this.currentKeyIndex);
    }

    // Reset failed keys (call after some time)
    resetFailedKeys() {
        this.failedKeys.clear();
    }

    // Make API request with automatic key rotation
    async makeRequest(prompt, maxRetries = 14) {
        let lastError = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            if (this.failedKeys.size >= GEMINI_API_KEYS.length) {
                throw new Error('RATE_LIMIT_EXCEEDED: All API keys exhausted. Please try again later.');
            }

            const apiKey = this.getCurrentKey();

            try {
                const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.9,
                            topP: 0.95,
                            topK: 40,
                            maxOutputTokens: 2048,
                        },
                        safetySettings: [
                            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                        ]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
                    console.warn(`Gemini API Key ${this.currentKeyIndex + 1} failed: ${errorMessage}`);

                    // Rotate on any error (429, 403, 400, etc.)
                    this.markKeyFailed();
                    this.rotateKey();
                    lastError = new Error(errorMessage);
                    continue;
                }

                const data = await response.json();

                if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }

                throw new Error('Invalid response format from Gemini API');
            } catch (error) {
                console.error(`Gemini Service Error (Key ${this.currentKeyIndex + 1}):`, error.message);
                lastError = error;

                // Rotate on network errors or other exceptions
                this.markKeyFailed();
                const canRotate = this.rotateKey();
                if (!canRotate) break;
                continue;
            }
        }

        throw lastError || new Error('Failed to get response from Gemini API');
    }

    // Generate interview questions based on type
    async generateInterviewQuestions(interviewType, customRole = '', previousQuestions = []) {
        const prompts = {
            'system-design': `You are an expert technical interviewer at a top tech company. Generate a unique system design interview question.

Context: This is a ${interviewType} interview.
${previousQuestions.length > 0 ? `Previously asked: ${previousQuestions.join(', ')}. Give something DIFFERENT.` : ''}

Generate ONE thoughtful system design question. Examples of topics:
- Design a URL shortener, video streaming platform, chat system, payment system, notification system, search engine, etc.
- Focus on scalability, availability, consistency, and performance.

Respond with ONLY the question text, nothing else. Make it conversational like a real interviewer would ask.`,

            'dbms': `You are an expert database and SQL interviewer. Generate a unique DBMS interview question.

Context: This is a ${interviewType} interview.
${previousQuestions.length > 0 ? `Previously asked: ${previousQuestions.join(', ')}. Give something DIFFERENT.` : ''}

Topics can include:
- SQL queries (joins, subqueries, aggregations)
- Normalization (1NF, 2NF, 3NF, BCNF)
- ACID properties and transactions
- Indexes and query optimization
- CAP theorem, sharding, replication
- NoSQL vs SQL comparison

Respond with ONLY the question text, nothing else. Make it conversational.`,

            'dsa': `You are an expert DSA/coding interviewer. Generate a unique algorithmic interview question.

Context: This is a ${interviewType} interview.
${previousQuestions.length > 0 ? `Previously asked: ${previousQuestions.join(', ')}. Give something DIFFERENT.` : ''}

Topics can include:
- Arrays, strings, linked lists
- Trees, graphs, dynamic programming
- Sorting, searching, two pointers
- Stack, queue, heap
- Recursion, backtracking

Respond with ONLY the question in the format:
**Problem Title**
[Problem description with input/output examples]

Make it like a real LeetCode-style problem.`,

            'custom': `You are an expert technical interviewer. Generate a unique interview question for a ${customRole || 'Software Developer'} position.

${previousQuestions.length > 0 ? `Previously asked: ${previousQuestions.join(', ')}. Give something DIFFERENT.` : ''}

The question should be relevant to the role and can be:
- Technical concepts related to the role
- Problem-solving scenarios
- System design (if senior role)
- Behavioral/situational questions

Respond with ONLY the question text, nothing else. Make it conversational like a real interviewer.`
        };

        const prompt = prompts[interviewType] || prompts['custom'];
        return await this.makeRequest(prompt);
    }

    // Generate follow-up question based on previous answer
    async generateFollowUp(interviewType, previousQuestion, userAnswer, customRole = '') {
        const prompt = `You are an expert technical interviewer conducting a ${interviewType} interview${customRole ? ` for a ${customRole} position` : ''}.

Previous question: "${previousQuestion}"
Candidate's answer: "${userAnswer}"

Based on the answer, generate a thoughtful follow-up question that:
1. Digs deeper into their understanding
2. Explores edge cases or alternative approaches
3. Tests practical application of concepts

Respond with ONLY the follow-up question text. Be conversational and encouraging.`;

        return await this.makeRequest(prompt);
    }

    // Evaluate user's answer
    async evaluateAnswer(question, answer, interviewType) {
        const prompt = `You are an expert technical interviewer evaluating a candidate's response.

Interview Type: ${interviewType}
Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer and respond in this JSON format ONLY:
{
    "score": <number 0-100>,
    "feedback": "<brief constructive feedback>",
    "strengths": ["<strength 1>", "<strength 2>"],
    "improvements": ["<area 1>", "<area 2>"],
    "followUp": "<optional follow-up question or null>"
}

Be fair but thorough in your evaluation.`;

        try {
            const response = await this.makeRequest(prompt);
            // Try to parse JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            // Fallback
            return {
                score: 70,
                feedback: response,
                strengths: ['Good attempt'],
                improvements: ['Could elaborate more'],
                followUp: null
            };
        } catch (error) {
            console.error('Error evaluating answer:', error);
            return {
                score: 65,
                feedback: 'Could not fully evaluate. Keep practicing!',
                strengths: ['Attempted the question'],
                improvements: ['Try to be more specific'],
                followUp: null
            };
        }
    }

    // Get intro message
    async getIntroMessage(interviewType, customRole = '') {
        const prompt = `You are a friendly AI interviewer starting a ${interviewType} interview${customRole ? ` for a ${customRole} position` : ''}.

Generate a warm, professional greeting (2-3 sentences) that:
1. Introduces yourself as an AI interviewer
2. Briefly explains what the interview will cover
3. Encourages the candidate

Keep it natural and friendly. Add a bit of Hindi/Hinglish flavor for an Indian audience (like "Namaste" or "All the best!").
Respond with ONLY the greeting text.`;

        try {
            return await this.makeRequest(prompt);
        } catch (error) {
            // Fallback greeting
            const greetings = {
                'dsa': "Namaste! I'm your AI interviewer for today's DSA round. We'll work through some coding problems together - don't worry about getting everything perfect, I'm here to see how you think! Let's get started! 💪",
                'system-design': "Hello and welcome! I'm your AI interviewer for the System Design round. We'll design a scalable system together, and I want to understand your thought process. Feel free to think out loud! Shuru karte hain! 🚀",
                'dbms': "Namaste! Ready for some database magic? I'm your AI interviewer for the DBMS round. We'll cover SQL, normalization, and core concepts. Don't stress - let's learn together!",
                'custom': `Welcome! I'm your AI interviewer for the ${customRole || 'technical'} interview. I'll ask you questions relevant to the role. Relax, be yourself, and let's have a great conversation! All the best! ✨`
            };
            return greetings[interviewType] || greetings['custom'];
        }
    }
}

// Export singleton
const geminiService = new GeminiService();
export default geminiService;
