if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
}

const { OpenAI } = require('openai');
const logger = require('../utils/logger');

const openRouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
});

const llmAPIcall = async (prompt, temp, maxTokens) => {
    const completion = await openRouter.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a strict JSON generator. Return only valid JSON." },
            { role: "user", content: prompt }
        ],
        temperature: temp,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
    });

    if (!completion?.choices?.[0]?.message?.content) {
        throw new Error("Empty response from LLM");
    }

    return completion.choices[0].message.content;
};

module.exports = { llmAPIcall };