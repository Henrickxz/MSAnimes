const mongoose = require("mongoose");
const Genero = require('./Genero')

const Manga = mongoose.model("Manga", {
    nome: String,
    autor: String,
    genero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genero"
    }
})

module.exports = Manga;