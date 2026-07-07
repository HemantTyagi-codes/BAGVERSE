const nodemailer = require("nodemailer");

const sendOtpMail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "BagVerse OTP Verification",
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2>BagVerse Email Verification</h2>
                    <p>Your OTP code is:</p>
                    <h1 style="color: #2b6cb0;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        console.log("OTP Email sent successfully to:", email);
        return true;

    } catch (error) {
        console.log("Email sending failed:", error);
        return false;
    }
};

module.exports = sendOtpMail;