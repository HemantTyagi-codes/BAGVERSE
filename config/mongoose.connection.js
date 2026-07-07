const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");
const config = require("config");





mongoose.connect(config.get("MONGODB_URL"))
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

module.exports = mongoose.connection;