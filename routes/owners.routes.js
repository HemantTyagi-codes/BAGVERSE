const express = require("express");
const router = express.Router();

const ownerController =
require("../controllers/owner.controller");

const isAdmin = require("../middleware/isAdmin");



// first owner creation
router.post(
"/create",
ownerController.createOwner
);



// login page
router.get(
"/login",
function(req,res){

    res.render("pages/owner-login");

});




// login process

router.post(
"/login",
ownerController.loginOwner
);




// logout
router.get("/logout", ownerController.logoutOwner);

// protected admin page
router.get(
    "/admin",
    isAdmin,
    ownerController.adminPage
);



module.exports = router;
