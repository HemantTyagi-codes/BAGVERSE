const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const { generateToken } = require("../utils/generateToken");
const {
    registerUser,
    verifyOtp,
    resendOtp
} = require("../controllers/auth.controller");

router.post("/register", registerUser);

router.get("/verify-otp", (req, res) => {
    res.render("pages/verify-otp", {
        email: req.query.email || "",
        error: req.flash("error"),
        success: req.flash("success"),
        loggedin: false
    });
});

router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            req.flash("error", "Email or password is incorrect");
            return res.redirect("/");
        }

        if (!user.isVerified) {
            req.flash("error", "Please verify your email before logging in");
            return res.redirect(`/users/verify-otp?email=${encodeURIComponent(email)}`);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash("error", "Email or password is incorrect");
            return res.redirect("/");
        }

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true
        });

        return res.redirect("/shop");

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while logging in");
        return res.redirect("/");
    }
});

router.get("/profile", isLoggedIn, (req, res) => {
    res.render("pages/profile", {
        user: req.user,
        loggedin: true
    });
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

module.exports = router;

