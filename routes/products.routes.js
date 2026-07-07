const express = require("express");
const router = express.Router();

const upload = require("../config/multer.config");
const productController = require("../controllers/product.controller");

const isAdmin = require("../middleware/isAdmin");



// CREATE PRODUCT
router.post(
    "/create",
    
    upload.single("image"),
    productController.createProduct
);



// DELETE PRODUCT
router.get(
    "/delete/:id",
    
    productController.deleteProduct
);



// UPDATE PRODUCT
router.post(
    "/update/:id",
    
    productController.updateProduct
);



// UPDATE IMAGE
router.post(
    "/update-image/:id",
    
    upload.single("image"),
    productController.updateImage
);



// EDIT PAGE
router.get(
    "/edit/:id"
    ,
    productController.getEditPage
);


module.exports = router;
