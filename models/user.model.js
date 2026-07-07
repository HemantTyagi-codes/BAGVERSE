const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

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

    otp: {
        type: String,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false,
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

}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);