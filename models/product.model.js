const mongoose = require("mongoose");


const productSchema = mongoose.Schema({


    image: String,


    name: {
        type: String,
        required: true
    },


    price: {
        type: Number,
        required: true
    },


    discount: {
        type: Number,
        default: 0
    },


    // NEW FIELD
    category: {
        type: String,
        enum: [
            "Travel",
            "Premium",
            "Laptop",
            "School"
        ],
        required: true
    },


    bgcolor: String,


    panelcolor: String,


    textcolor: String


}, {
    timestamps: true
});


module.exports = mongoose.model("product", productSchema);