const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    fullname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    contact: {
        type: Number,
        required: true
    },

    role: {
        type: String,
        default: "user"
    },

    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ],

    orders: {
        type: Array,
        default: []
    },

    picture: Buffer

});

module.exports = mongoose.model("user", userSchema);