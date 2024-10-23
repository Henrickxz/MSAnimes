const mongoose = require("mongoose");

const User = mongoose.model("User", {
    email: String,
    senha: String,
    idade: Number
});

module.exports = User;
