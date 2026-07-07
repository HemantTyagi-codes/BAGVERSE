const bcrypt = require("bcrypt");

const userModel = require("../models/user.model");
const sendOtpMail = require("../utils/sendOtpMail");
const { generateToken } = require("../utils/generateToken");

const OTP_EXPIRY_MINUTES = 5;

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpExpiry() {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

module.exports.registerUser = async function (req, res) {
    try {
        const { fullname, email, password, contact } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            req.flash("error", "User already exists, please login");
            return res.redirect("/");
        }

        const otp = generateOtp();
        const otpExpiry = getOtpExpiry();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUser) {
            existingUser.fullname = fullname;
            existingUser.password = hashedPassword;
            existingUser.contact = Number(contact);
            existingUser.otp = otp;
            existingUser.otpExpiry = otpExpiry;
            await existingUser.save();
        } else {
            await userModel.create({
                fullname,
                email,
                password: hashedPassword,
                contact: Number(contact),
                otp,
                otpExpiry,
                isVerified: false
            });
        }

        const emailSent = await sendOtpMail(email, otp);

        if (!emailSent) {
            req.flash("error", "Could not send OTP email. Please try again.");
            return res.redirect("/");
        }

        req.flash("success", "OTP sent to your email");
        return res.redirect(`/users/verify-otp?email=${encodeURIComponent(email)}`);

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while creating your account");
        return res.redirect("/");
    }
};

module.exports.verifyOtp = async function (req, res) {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            req.flash("error", "Please register first");
            return res.redirect("/");
        }

        if (user.isVerified) {
            req.flash("success", "Account is already verified");
            return res.redirect("/");
        }

        if (!user.otp || user.otp !== otp) {
            req.flash("error", "Invalid OTP");
            return res.redirect(`/users/verify-otp?email=${encodeURIComponent(email)}`);
        }

        if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
            req.flash("error", "OTP expired. Please request a new one.");
            return res.redirect(`/users/verify-otp?email=${encodeURIComponent(email)}`);
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true
        });

        req.flash("success", "Email verified successfully");
        return res.redirect("/shop");

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while verifying OTP");
        return res.redirect("/");
    }
};

module.exports.resendOtp = async function (req, res) {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            req.flash("error", "Please register first");
            return res.redirect("/");
        }

        if (user.isVerified) {
            req.flash("success", "Account is already verified");
            return res.redirect("/");
        }

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = getOtpExpiry();
        await user.save();

        const emailSent = await sendOtpMail(email, otp);

        if (!emailSent) {
            req.flash("error", "Could not resend OTP email. Please try again.");
        } else {
            req.flash("success", "New OTP sent to your email");
        }

        return res.redirect(`/users/verify-otp?email=${encodeURIComponent(email)}`);

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while resending OTP");
        return res.redirect("/");
    }
};

