const express = require("express");
const router = express.Router();

const {
    registerUser,
    verifyOtp,
    resendOtp
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;

