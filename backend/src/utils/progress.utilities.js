const sanitizeLLMoutput = (parsed) => {
    const expectedKeys = ["caloriesConsumed", "caloriesBurnt", "proteinGrams"];

    const sanitized = {};

    expectedKeys.forEach((key) => {
        let value = parsed[key];

        if (typeof value !== "number" || isNaN(value)) {
            value = 0;
        }

        sanitized[key] = Math.round(value);
    });

    return sanitized;
}

module.exports = {
    sanitizeLLMoutput
}