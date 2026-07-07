const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({

    fullname: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ],

    picture: String,

    gstin: {
        type: String,
        trim: true,
        uppercase: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("owner", ownerSchema);