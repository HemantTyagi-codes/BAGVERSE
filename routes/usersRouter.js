const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");
const userController = require("../controllers/authController");

// REGISTER
router.post("/register", userController.registerUser);

// LOGIN
router.post("/login", userController.loginUser);

// LOGOUT
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// PROFILE (still simple, can move to controller later)
router.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile", {
        user: req.user
    });
});

module.exports = router;