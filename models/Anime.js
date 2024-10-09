const mongoose = require("mongoose");

const Anime = mongoose.model("Anime", {

    nome: String,
    ano: String,
    genero:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genero"
    }
})

module.exports = Anime;