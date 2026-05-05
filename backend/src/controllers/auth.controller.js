const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmailToResetPassword');
const logger = require('../utils/logger');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const userCheck = async (req,res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ 
            message: 'Failed to fetch user' 
        });
    }
}

const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if(!idToken) {
            return res.status(400).json({ message: "idToken missing" });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name,
                avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                provider: 'google',
                providerId: sub,
                isPasswordSet: false
            });
        }
    
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            message: "Google Login Successful",
            isPasswordSet: user.isPasswordSet,
            user: {
                ...user,
                memberSince: user.createdAt.toISOString().split('T')[0]
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ 
            message: 'Failed to login with Google' 
        });
    }
};

const userRegister = async (req,res) => {

    const { name, email, password, age, gender } = req.body;

    try{

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            isPasswordSet: true,
            age,
            gender,
            provider: 'email',
        });

        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                ...newUser,
                memberSince: newUser.createdAt.toISOString().split('T')[0]
            }
        });
     
    } catch(error){
        logger.error(error);
        res.status(500).json({ 
            message: 'Failed to register user' 
        });
    }
}

const userLogin = async (req,res) => {

    const { email, password } = req.body;

    try{

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            message: "User logged in successfully",
            user
        });
    } catch(error){
        logger.error(error);
        res.status(500).json({ 
            message: 'Failed to login user' 
        });
    }
}

const setPassword = async (req,res) => {
    const { password } = req.body;
    try{

        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        user.password = await bcrypt.hash(password, 10);
        user.isPasswordSet = true;
        await user.save();
        res.status(200).json({
            message: "Password set successfully"
        })

    } catch (error) {
        logger.error(error);
        res.status(500).json({ 
            message: 'Failed to set password' 
        });
    }
}

const userLogout = (req,res) => {
    try{
        res.clearCookie('token');
        res.status(200).json({ message: "User logged out successfully" });
    } catch(error){
        logger.error(error);
        res.status(500).json({ 
            message: 'Failed to logout user' 
        });
    }
}

const forgotPassword = async (req,res) => {
    
    const { email } = req.body;

    try {
 
        const user = await User.findOne({ email }); 
        if(!user) return res.status(404).json({ message: "User not found" });

        // Create reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 15*60*1000; // 15 min
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail(resetLink,email);

        res.status(200).json({
            message: "Password reset link sent, check your email"
        })

    } catch(error) {
      
        logger.error(error.message);
        res.status(500).json("Some error occured while sending password reset link");

    }

}

const resetPassword = async (req,res) => {

    const { token } = req.params;
    const { newPassword } = req.body;
    
    try {

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        })

        if(!user){
            return res.status(401).json({
                message: "Invalid or expired token"
            })
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        })

    } catch(error) {

        logger.error("PASSSWORD RESET ERROR: ", error.message);
        res.status(500).json({
            message: "Some error occured while password reset"
        })

    }

}

module.exports = {
    googleLogin,
    userCheck,
    userRegister,
    userLogin,
    setPassword,
    userLogout,
    forgotPassword,
    resetPassword
};