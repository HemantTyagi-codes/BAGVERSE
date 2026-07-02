const productModel = require("../models/product-model");

module.exports.createProduct = async (req, res) => {
    const { name, price, discount,category, bgcolor, panelcolor, textcolor } = req.body;

    let product = await productModel.create({
        image: req.file ? req.file.filename : "",
        name,
        price,
        discount,
        category,
        bgcolor,
        panelcolor,
        textcolor
    });

    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");
};

module.exports.deleteProduct = async (req, res) => {
    await productModel.findByIdAndDelete(req.params.id);

    req.flash("success", "Product deleted successfully");
    res.redirect("/owners/admin");
};

module.exports.updateProduct = async (req, res) => {
    const { name, price, discount,category, bgcolor, panelcolor, textcolor } = req.body;

    await productModel.findByIdAndUpdate(req.params.id, {
        name,
        price,
        discount,
        category,
        bgcolor,
        panelcolor,
        textcolor
    });

    req.flash("success", "Product updated successfully");
    res.redirect("/owners/admin");
};

module.exports.updateImage = async (req, res) => {
    const product = await productModel.findById(req.params.id);

    if (req.file) {
        product.image = req.file.filename;
    }

    await product.save();

    res.redirect("/owners/admin");
};


module.exports.getEditPage = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/owners/admin");
        }

        res.render("editproduct", {
            product
        });

    } catch (err) {
        res.send(err.message);
    }
};