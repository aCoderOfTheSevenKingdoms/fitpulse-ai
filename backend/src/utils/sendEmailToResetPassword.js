const nodemailer = require('nodemailer');

const sendEmail = async (resetLink,email) => {
     
    if(!resetLink || resetLink.length === 0) return; 

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            html: `<p>Click below to reset password:</p>
                <a href="${resetLink}">${resetLink}</a>`
        });

    } catch(error) {
        console.error("Email couldn't be sent", error.message);
    }
}

module.exports = { sendEmail }