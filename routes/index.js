const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");
const cartController = require("../controllers/cartController");
const productModel = require("../models/product-model");

// HOME PAGE
router.get("/", (req, res) => {
    let error = req.flash("error");

    res.render("index", {
        error,
        loggedin: false
    });
});

// SHOP PAGE
router.get("/shop", isLoggedIn, async function (req, res) {

    let success = req.flash("success");


    let search = req.query.search || "";
    let category = req.query.category || "";
    let price = req.query.price || "";



    // Base query (search)
    let query = {

        name: {
            $regex: search,
            $options: "i"
        }

    };




    // Category filter

    if(category)
    {
        query.category = category;
    }




    // Price filter

    if(price)
    {

        if(price == "1000")
        {
            query.price = {
                $lte: 1000
            };
        }


        else if(price == "2000")
        {
            query.price = {

                $gte: 1000,
                $lte: 2000

            };
        }



        else if(price == "5000")
        {
            query.price = {

                $gte: 2000,
                $lte: 5000

            };
        }

    }





    let products = await productModel.find(query);



    res.render("shop", {

        products,
        success,
        search,
        category,
        price

    });


});

// CART PAGE
router.get("/cart", isLoggedIn, cartController.getCart);

// ADD TO CART
router.get("/addtocart/:productid", isLoggedIn, cartController.addToCart);

module.exports = router;