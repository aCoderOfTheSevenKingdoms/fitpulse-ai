if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
}

const { OpenRouter } = require('@openrouter/sdk');
const logger = require('../utils/logger');

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const models = [
    "openai/gpt-4o-mini",
    "anthropic/claude-3-haiku",
    "meta-llama/llama-3-70b-instruct"
];

const LLM_TIMEOUT_MS = 30000;

const llmAPIcall = async (prompt, temp, maxTokens) => {
    for (const model of models) {
        try {
            const completion = await Promise.race([
                openRouter.chat.send({
                    chatGenerationParams: {
                        model,
                        messages: [
                            { role: "system", content: "You are a strict JSON generator. Return only valid JSON." },
                            { role: "user", content: prompt }
                        ],
                        temperature: temp,
                        max_tokens: maxTokens,
                        stream: false,
                    }
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("LLM request timed out")), LLM_TIMEOUT_MS)
                )
            ]);

            if (!completion?.choices?.[0]?.message?.content) {
                throw new Error("Empty response from LLM");
            }

            return completion.choices[0].message.content;

        } catch (err) {
            const status = err?.status || err?.response?.status;
            logger.warn(`Model ${model} failed (status: ${status}): ${err.message}`);

            if (status === 401 || status === 400) {
                throw new Error(`Fatal LLM error: ${err.message}`);
            }
        }
    }

    throw new Error("[LLM API FAILURE] All models exhausted");
};

module.exports = { llmAPIcall };