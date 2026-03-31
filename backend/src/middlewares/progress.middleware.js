const {progressInputSchema} = require('./schema/progessInput.schema');

const progressInputValidation = (req,res,next) => {
    try{
        const payload = req.body;
        const parsedPayload = progressInputSchema.safeParse(payload);
        if(!parsedPayload.success){
            return res.status(400).json({
                message: "Invalid Inputs"
            });
        }
        next();
    } catch (error) {
        console.error("INTERNAL SERVER ERROR: ", error.message);
        res.status(500).json({
            message: "Some error occured while updating progress"
        })
    }
}

const rateLimit = (req,res,next) => {}

module.exports = {
    rateLimit,
    progressInputValidation
}