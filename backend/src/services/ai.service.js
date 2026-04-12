const { OpenRouter } = require('@openrouter/sdk');

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const llmAPIcall = async (prompt, temp, maxTokens) => {

    try{

        console.log("Sending request to OpenRouter");

        const completion = await openRouter.chat.send({
            chatGenerationParams: {
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a strict JSON generator. Return only valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: temp, // lower = more deterministic
                max_tokens: maxTokens, 
                stream: false,
            }
        });

        console.log("LLM responded");

        if (!completion?.choices?.[0]?.message?.content) {
            throw new Error("Empty response from LLM");
        }

        const rawOutput = completion.choices[0].message.content;

        return rawOutput;

    } catch (error) {
        console.error("LLM API FAILURE: ", error.message);
        return null;
    }

}

module.exports = {
    llmAPIcall
};