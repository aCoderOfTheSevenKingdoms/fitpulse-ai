const zod = require("zod");

const registerSchema = zod.object({
    name: zod.string().min(3).max(30),
    email: zod.string().email(),
    password: zod.string().min(8).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
    age: zod.coerce.number().min(18).max(100),
    gender: zod.enum(["male", "female", "other"])
});

const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character")
});

module.exports = {
    registerSchema, loginSchema 
};