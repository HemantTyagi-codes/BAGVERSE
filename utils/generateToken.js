const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const jwtKey = process.env.JWT_KEY || "bagverse-dev-secret";

    return jwt.sign(
        {
            email: user.email,
            id: user._id,
            role: user.role
        },
        jwtKey,
        { expiresIn: "1h" }
    );
};

module.exports = { generateToken };