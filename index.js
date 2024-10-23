const express = require('express')
const app = express()
const mongoose = require('mongoose')
const crypto = require('crypto');
const User = require('./models/User')
const Anime = require('./models/Anime')
const Genero = require('./models/Genero')
const Manga = require('./models/Manga')

const cipher = {
    algorithm : "aes256",
    secret : "chaves",
    type : "hex"
};

//Função p criptografar a senha
async function getCrypto(senha) {
    return new Promise((resolve, reject) => {
        const cipherStream = crypto.createCipher(cipher.algorithm, cipher.secret);
        let encryptedData = '';

        cipherStream.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipherStream.read())) {
                encryptedData += chunk.toString(cipher.type);
            }
        });

        cipherStream.on('end', () => {
            resolve(encryptedData);
        });

        cipherStream.on('error', (error) => {
            reject(error);
        });

        cipherStream.write(senha);
        cipherStream.end();
    });
};

app.use(
    express.urlencoded({
      extended: true,
    }),
  )
  
  app.use(express.json())

//Cadastrar User
app.post('/user', async (req, res) => {
    let { email, senha, idade } = req.body;
    try {
        let newSenha = await getCrypto(senha);
        const user = {
            email,
            senha: newSenha,
            idade,
        };
        await User.create(user);
        res.status(201).json({ message: 'User criado com sucesso!' });
    }catch (error) {
        res.status(500).json({ erro: error });
    }
});

//Login
app.post('/login', async (req, res) => {
    let { email, senha } = req.body;
    try {
        let encryptedSenha = await getCrypto(senha);
        const user = await User.findOne({ email, senha: encryptedSenha });
        if (!user) {
            res.status(422).json({ message: 'Credenciais inválidas!' });
            return;
        }
        res.status(200).json({ message: 'Usuário Logado', user: user });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Crud Genero
//Cadastrar Gênero
app.post('/cadgenero', async(req, res) => {
    const {genero} = req.body

    const gener = {
        genero,
    }

    try{
        await Genero.create(gener)
        res.status(201).json({ message: 'Gênero registrado com sucesso' })
    } catch (error) {
        res.status(500).json({ erro: error })
        }   
});

//Ler Genero
app.get('/lergenero', async(req, res)=> {
    try{
        const gener = await Genero.find()

        res.status(200).json(gener)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
});

//Ler Genero por id
app.get('/lergenero/:id', async(req, res) =>{
    const id = req.params.id

    try{
        const gener = await Genero.findOne({_id: id})

        if(!gener){
            res.status(422).json({ message: 'Gênero não encontrado!' })
            return
        }
    

        res.status(200).json(gener)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
});

//Deletar Genero
app.delete('/deletargenero/:id', async(req, res) =>{
    const id = req.params.id

    const gener = await Genero.findOne({_id: id})

    if(!gener){
        res.status(422).json({ message: 'Gênero não encontrado!' })
        return
    }

    try{
        await Genero.deleteOne({_id: id})
        
        res.status(200).json({ message: 'Gênero removido com sucesso!' })
    }catch (error) {
        res.status(500).json({ erro: error })
    }
})

//Crud Anime
//Cadastrar anime
app.post('/cadanime', async(req, res) => {
    const { nome, ano, genero} = req.body

    const anime = {
        nome,
        ano,
        genero
    }

    try{
        await Anime.create(anime)
        res.status(201).json({ message: 'Anime registrado com sucesso' })
    } catch (error) {
        res.status(500).json({ erro: error })
        }   
});

//Ler anime
app.get('/leranime', async (req, res) => {
    try {
        const anime = await Anime.find().populate('genero');

        const resultado = anime.map(anime => ({
            _id: anime._id,
            nome: anime.nome,
            ano: anime.ano,
            genero: anime.genero.genero
        }));

        
        res.status(200).json(resultado);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ erro: 'Erro ao ler animes.' });
    }
});

//Ler anime por id
app.get('/leranime/:id', async(req, res) =>{
    const id = req.params.id

    try{
        const anime = await Anime.findOne({_id: id});

        

        if(!anime){
            res.status(422).json({ message: 'Anime não encontrado!' })
            return
        }
    

        res.status(200).json(anime)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
});

//Alterar anime por id
app.patch('/alteraranime/:id', async(req, res) => {
    const id = req.params.id

    const {nome, ano, genero} = req.body

    const anime = {
        nome,
        ano,
        genero
    }

    try{
        const AlterarAnime = await Anime.updateOne({_id: id}, anime)

        if(AlterarAnime.matchedCount === 0){
            res.status(422).json({message: "Anime não encontrado"})
            return
        }

        res.status(200).json(anime)
    }catch (error) {
        res.status(500).json({ erro: error })
    }  
})

//Deletar Anime
app.delete('/deletaranime/:id', async(req, res) =>{
    const id = req.params.id

    const anime = await Anime.findOne({_id: id})

    if(!anime){
        res.status(422).json({ message: 'Anime não encontrado!' })
        return
    }

    try{
        await Anime.deleteOne({_id: id})
        
        res.status(200).json({ message: 'Anime removido com sucesso!' })
    }catch (error) {
        res.status(500).json({ erro: error })
    }
})

//Crud Manga
//Cadastrar Manga
app.post('/cadmanga', async(req, res) => {
    const { nome, autor, genero} = req.body

    const manga = {
        nome,
        autor,
        genero
    }

    try{
        await Manga.create(manga)
        res.status(201).json({ message: 'Mangá registrado com sucesso' })
    } catch (error) {
        res.status(500).json({ erro: error })
        }   
});

//Ler Manga
app.get('/lermanga', async(req, res)=> {
    try{
        const manga = await Manga.find()

        res.status(200).json(manga)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
});

//Ler Manga por id
app.get('/lermanga/:id', async(req, res) =>{
    const id = req.params.id

    try{
        const manga = await Manga.findOne({_id: id})

        if(!manga){
            res.status(422).json({ message: 'Mangá não encontrado!' })
            return
        }
    

        res.status(200).json(manga)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
})

//Alterar Manga
app.patch('/alterarmanga/:id', async(req, res) => {
    const id = req.params.id

    const {nome, autor, genero} = req.body

    const manga = {
        nome,
        autor,
        genero
    }

    try{
        const AlterarManga = await Manga.updateOne({_id: id}, manga)

        if(AlterarManga.matchedCount === 0){
            res.status(422).json({message: "Mangá não encontrado"})
            return
        }

        res.status(200).json(manga)
    }catch (error) {
        res.status(500).json({ erro: error })
    }  
})

//Deletar Manga
app.delete('/deletarmanga/:id', async(req, res) =>{
    const id = req.params.id

    const manga = await Manga.findOne({_id: id})

    if(!manga){
        res.status(422).json({ message: 'Mangá não encontrado!' })
        return
    }

    try{
        await Manga.deleteOne({_id: id})
        
        res.status(200).json({ message: 'Mangá removido com sucesso!' })
    }catch (error) {
        res.status(500).json({ erro: error })
    }
})

//Total animes cadastrados
app.get('/totalanimes', async (req, res) => {
    try {
        const totalAnimes = await Anime.countDocuments();
        res.status(200).json({ total: totalAnimes });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Total de Animes com Mais de um Gênero
app.get('/animes-multigenero', async (req, res) => {
    try {
        const animesComMultigenero = await Anime.aggregate([
            {
                $match: { genero: { $exists: true, $not: { $size: 0 } } } // Filtra animes com a propriedade genero
            },
            {
                $project: {
                    numGeneros: { $size: "$genero" } // Conta o número de gêneros
                }
            },
            {
                $match: { numGeneros: { $gt: 1 } } // Filtra apenas aqueles com mais de um gênero
            }
        ]);

        res.status(200).json({ total: animesComMultigenero.length });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

//Conexão Mongobd
mongoose.connect(`mongodb://localhost:27017`).then(()=>{
    console.log("Conectamos ao mongoDB")
    app.listen(3000)
})
