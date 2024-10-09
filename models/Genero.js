const mongoose = require("mongoose");

const Genero = mongoose.model("Genero", {
    genero: String
})

module.exports = Genero;