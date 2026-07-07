
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");


//cart

module.exports.getCart = async (req, res) => {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");

    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/");
    }

    let cartItems = user.cart || [];
    let totalMRP = 0;
    let totalDiscount = 0;

    cartItems.forEach(product => {
        totalMRP += product.price || 0;
        totalDiscount += product.discount || 0;
    });

    let platformFee = 20;
    let totalAmount = totalMRP - totalDiscount + platformFee;

    res.render("pages/cart", {
        user,
        totalMRP,
        totalDiscount,
        platformFee,
        totalAmount
    });

};



//add to cart
module.exports.addToCart = async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/");
    }

    user.cart = user.cart || [];
    user.cart.push(req.params.productid);
    await user.save();

    req.flash("success", "Added to cart");
    res.redirect("/shop");
};




