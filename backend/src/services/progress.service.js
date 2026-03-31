const { llmAPIcall } = require('./ai.service');
const { sanitizeLLMoutput } = require('../utils/progress.utilities');

/**
 * This service checks if goals are met or not.
 */

const evaluateProgress = (targets = {}, progress = {}) => {
    const METRICS = [
        "burnCalories",
        "consumeCalories",
        "steps",
        "workoutDuration",
        "proteinGrams",
        "sleepHours"
    ];

    const result = {};

    METRICS.forEach((metric) => {
        const targetValue = targets[metric];
        const progressValue = progress[metric];

        // If target is missing or invalid → mark false
        if (typeof targetValue !== "number" || targetValue <= 0) {
            result[metric] = false;
            return;
        }

        // If progress is missing → treat as 0
        const safeProgress = (typeof progressValue === "number" && progressValue >= 0)
            ? progressValue
            : 0;

        const threshold = 0.6 * targetValue;

        result[metric] = safeProgress >= threshold;
    });

    return result;
};

/**
 * This service takes meal & workout description of user and makes an API call to a LLM to compute three values:
 * caloriesConsumed
 * caloriesBurnt
 * proteinGrams
 */

const computeMetrics = async (prompt) => {
    if (!prompt) return null;

    try {

        const rawOutput = await llmAPIcall(prompt, 0, 100);

        // Attempt to parse JSON
        let parsed;

        try{
            parsed = JSON.parse(rawOutput);
        } catch (error) {
            console.error("Invalid JSON output from LLM:", error.message);
            throw new Error("Invalid JSON output from LLM");
        }

        // Sanitize the parsed object
        parsed = sanitizeLLMoutput(parsed);

        return parsed;

    } catch (error) {
        console.error("LLM API FAILURE:", error.message);
        return null;
    }
}

/**
 * This service generates the prompt to put in LLM API call
 */
const generatePrompt = (mealDescription, workoutDescription) => {

    if(!mealDescription && !workoutDescription) return null;

    const prompt = `You are a strict data parser and nutrition/fitness estimator.

    Your task is to analyze the given user input and return ONLY a valid JSON object with EXACTLY the following three integer fields:

    - caloriesConsumed
    - caloriesBurnt
    - proteinGrams

    IMPORTANT RULES (MUST FOLLOW STRICTLY):

    1. Output ONLY valid JSON. Do NOT include any explanation, text, markdown, or comments.
    2. All values MUST be integers (no decimals, no strings, no nulls).
    3. If any value cannot be determined, return 0 for that field.
    4. Do NOT add extra fields. Do NOT rename fields.

    INPUT DATA:

    User's Meal Description: ${mealDescription}
    User's Workout Description: ${workoutDescription}

    INSTRUCTIONS:

    - Use ONLY mealDescription to calculate:
    → caloriesConsumed
    → proteinGrams

    - Use ONLY workoutDescription to calculate:
    → caloriesBurnt

    - If mealDescription is empty or irrelevant, set:
    → caloriesConsumed = 0
    → proteinGrams = 0

    - If workoutDescription is empty or irrelevant, set:
    → caloriesBurnt = 0

    - Use realistic approximations based on common nutrition and fitness data.

    OUTPUT FORMAT (STRICT):

    {
    "caloriesConsumed": <integer>,
    "caloriesBurnt": <integer>,
    "proteinGrams": <integer>
    }`;

    return prompt;
}

module.exports = {
    computeMetrics,
    generatePrompt,
    evaluateProgress
}