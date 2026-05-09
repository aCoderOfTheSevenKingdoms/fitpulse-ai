const zod = require("zod");

const registerSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string()
       .min(8)
       .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
    age: zod.coerce.number().optional().or(zod.literal('')),
    gender: zod.enum(["male", "female", "other"]).optional().or(zod.literal(''))
});

const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character")
});

module.exports = {
    registerSchema, loginSchema 
};