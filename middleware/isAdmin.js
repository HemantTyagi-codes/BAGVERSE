const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    const jwtKey = process.env.JWT_KEY || "bagverse-dev-secret";

    if(!req.cookies.token){
        req.flash("error", "Please log in as an admin");
        return res.redirect("/owners/login");
    }

    try{

        let decoded = jwt.verify(
            req.cookies.token,
            jwtKey
        );

        req.user = decoded;

        if(req.user.role !== "admin"){
            req.flash("error", "Access denied");
            return res.status(403)
            .send("Access Denied");
        }

        next();

    }
    catch(err){
        req.flash("error", "Your session has expired");
        return res.redirect("/owners/login");
    }
};