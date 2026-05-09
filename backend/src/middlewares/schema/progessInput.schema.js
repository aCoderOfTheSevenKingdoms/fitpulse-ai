const zod = require('zod');

const progressInputSchema = zod.object({
    mealDescription: zod.string().nonempty(),
    workoutDescription: zod.string().nonempty(),
    sleepHours: zod.coerce.number().nonnegative(),
    stepCount: zod.coerce.number().nonnegative(),
    workoutDuration: zod.coerce.number().nonnegative()
});

module.exports = {
    progressInputSchema
}