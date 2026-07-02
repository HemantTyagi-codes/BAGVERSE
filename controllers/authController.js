const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {

    try {

        const { fullname, email, password ,contact} = req.body;

        let existingUser = await userModel.findOne({ email });

        if (existingUser) {
            req.flash("error", "You already have an account, please login");
            return res.redirect("/");
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullname,
            email,
            password: hash,
            contact:Number(contact)
        });

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict"
        });

        req.flash("success", `Welcome ${user.fullname}! Your account is created.`);
        return res.redirect("/shop");

    } catch (err) {

        res.status(500).send(err.message);
    }
};

module.exports.loginUser = async function (req, res) {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401)
                .send("Email or Password incorrect");
        }

        const result = await bcrypt.compare(
            password,
            user.password
        );

        if (!result) {
            return res.status(401)
                .send("Email or Password incorrect");
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict"
        });

        req.flash(
            "success",
            `Welcome back ${user.fullname}!`
        );

        if(user.role === "admin"){
            return res.redirect("/owners/admin");
        }

        return res.redirect("/shop");

    } catch (err) {

        res.status(500).send(err.message);
    }
};