const { llmAPIcall } = require('./ai.service');
const logger = require('../utils/logger');

const generatePrompt = (userActivityDetails) => {
   
    if(!userActivityDetails) return;

    const formattedDetails = JSON.stringify(userActivityDetails, null, 2);

    const prompt = `You are an AI health roadmap generator.

        Your task is to generate a structured 90-day personalized health roadmap.

        The user’s activityDetails will be provided as key-value pairs.

        You MUST generate exactly 90 goals following STRICTLY the schema provided below.

        --------------------------------------------------
        USER ACTIVITY DETAILS:
        ${formattedDetails}
        --------------------------------------------------

        IMPORTANT RULES:

        1. You MUST generate exactly 90 goals.
        2. Output ONLY valid JSON.
        3. Do NOT include explanations.
        4. Do NOT include markdown formatting.
        5. Do NOT include comments.
        6. Do NOT add extra fields.
        7. Do NOT change field names.
        8. All numeric fields must be numbers (not strings).
        9. Goals must be progressive and realistic based on user data.
        10. goalNumber must start from 1 and increment sequentially to 90.

        --------------------------------------------------

        STRICT OUTPUT FORMAT:

        {
        "goals": [
            {
            "goalNumber": Number,
            "description": String,
            "metrics": {
                "burnCalories": Number,
                "consumeCalories": Number,
                "sleepHours": Number,
                "proteinGrams": Number,
                "workoutDuration": Number,
                "steps": Number
            }
            }
        ]
        }

        --------------------------------------------------

        ROADMAP GENERATION LOGIC:

        - Tailor calorie burn and intake based on BMR and activity level.
        - Adjust protein intake based on muscleTraining and body goals.
        - Adjust sleepHours based on wakeUpTime and bedTime.
        - Increase workoutDuration gradually over weeks.
        - Increase steps gradually.
        - Respect medicalConditions, bloodPressureRange, bloodSugarLevels, and cholesterol.
        - If user smokes or drinks, incorporate gradual reduction goals.
        - If user skips lunch or eats junk frequently, incorporate dietary correction goals.
        - Ensure safe progression across 90 days.
        - Each day should represent one goal (1 goal per day for 90 days).

        Return ONLY the JSON.`;

    return prompt;    
}

const computePlan = async (prompt) => {
    if (!prompt) return null;

    try {

        logger.info("Calling LLM");
        const rawOutput = await llmAPIcall(prompt, 0.4, 6000);
        logger.info("LLM returned output");

        logger.info(`Raw length: ${rawOutput?.length}`);

        let cleanedOutput = rawOutput?.trim();

        if (cleanedOutput?.startsWith("```")) {
        cleanedOutput = cleanedOutput
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        }

        let parsed;

        try {
        parsed = JSON.parse(cleanedOutput);
        logger.info("JSON parsed successfully ✅");
        } catch (err) {
        logger.error(`Parse failed ❌ ${err.message}`);
        logger.info(`Preview: ${cleanedOutput.slice(0, 300)}`);
        throw new Error("Invalid JSON output");
        }

        logger.info(`Type of goals: ${typeof parsed.goals}`);
        logger.info(`Is array: ${Array.isArray(parsed.goals)}`);
        logger.info(`Goals length: ${parsed.goals?.length}`);

        // Validate
        if (!parsed.goals || parsed.goals.length !== 90) {
            throw new Error("Invalid roadmap length");
        }

        return parsed;

    } catch (error) {
        logger.error(`[LLM API FAILURE]: ${error.message}`);
        return null;
    }
};

const generateGoalDates = (goals) => {
    const startDate = new Date();

    return goals.map((goal, index) => {
        const goalDate = new Date(startDate);
        goalDate.setDate(startDate.getDate() + index);

        return {
            ...goal,
            viewableFrom: goalDate.toISOString(),
            updatableFrom: goalDate.toISOString(),
            completedAt: null
        };
    });
};

module.exports = {
    generatePrompt,
    generateGoalDates,
    computePlan
}