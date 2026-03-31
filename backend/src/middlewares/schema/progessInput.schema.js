const zod = require('zod');

const progressInputSchema = zod.object({
    mealDescription: zod.string().nonempty(),
    workoutDescription: zod.string().nonempty(),
    sleepHours: zod.number().nonnegative(),
    stepCount: zod.number().nonnegative(),
    workoutDuration: zod.number().nonnegative()
});

module.exports = {
    progressInputSchema
}