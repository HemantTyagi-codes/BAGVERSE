const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
    const jwtKey = process.env.JWT_KEY || "bagverse-dev-secret";

    if (!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(
            req.cookies.token,
            jwtKey
        );

        const user = await userModel
            .findById(decoded.id)
            .select("-password");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
    }
};