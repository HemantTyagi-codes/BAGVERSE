const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

require("dotenv").config();

// DB
require("./config/mongoose.connection");

// Routers
const ownersRouter = require("./routes/owners.routes");
const usersRouter = require("./routes/users.routes");
const productsRouter = require("./routes/products.routes");
const index = require("./routes/index");
const authRoutes = require("./routes/auth.routes");

// Utils
const sendOtpMail = require("./utils/sendOtpMail");

// PORT
const PORT = process.env.PORT || 3000;
const jwtKey = process.env.JWT_KEY || "bagverse-dev-secret";

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    expressSession({
        secret: jwtKey,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash());

// Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", index);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

// 🔥 API ROUTE (KEEP THIS TOGETHER)
app.use("/api/auth", authRoutes);

// Test email
app.get("/test-email", async (req, res) => {
    const email = "hemantlpu09@gmail.com";
    const otp = Math.floor(100000 + Math.random() * 900000);

    const result = await sendOtpMail(email, otp);

    if (result) return res.send("Email sent successfully!");
    else return res.status(500).send("Email failed!");
});

// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
