if (!process.env.NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not set");
}

const { OpenAI } = require('openai');
const logger = require('../utils/logger');

const nvidia = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1'
});

const llmAPIcall = async (prompt, temp, maxTokens) => {
    const completion = await nvidia.chat.completions.create({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
            { role: "system", content: "You are a strict JSON generator. Return only valid JSON." },
            { role: "user", content: prompt }
        ],
        temperature: temp,
        max_tokens: maxTokens,
    });

    if (!completion?.choices?.[0]?.message?.content) {
        throw new Error("Empty response from LLM");
    }

    return completion.choices[0].message.content;
};

module.exports = { llmAPIcall };