const express=require('express');
const app=express();
const cookieParser=require("cookie-parser");
const path=require("path");
const ownersRouter=require("./routes/ownersRouter");
const usersRouter=require("./routes/usersRouter");
const productsRouter=require("./routes/productsRouter");
const index = require("./routes/index");
const expressSession=require("express-session");
const flash =require("connect-flash");

require("dotenv").config();

const db=require("./config/mongoose-connection");
const PORT = process.env.PORT || 3000;
const jwtKey = process.env.JWT_KEY || "bagverse-dev-secret";

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));

app.use(
    expressSession({
        secret: jwtKey,
        resave: false,
        saveUninitialized: false
    })
);

app.use(flash());
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/",index);
app.use("/owners",ownersRouter);
app.use("/users",usersRouter);
app.use("/products",productsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});