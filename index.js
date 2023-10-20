require('dotenv').config();
require('./database/conn');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Client = require('./models/Client');
const Product = require('./models/Products');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require("sharp");
const fs = require("fs");
const path = require('path');
const removeAccents = require('remove-accents');
sharp.cache(false);
// Configurar o módulo Multer para o upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });
const keyPrivate = process.env.TOKENPRIVATE;

app.use('/upload', express.static('upload'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.get("/", async (req, res) => {
    const ordem = req.query.ordem; // Acesse 'ordem' dos parâmetros de consulta
    try {
      // Consulta os dados do banco de dados
      const cardProduct = await Product.findAll({
        attributes: ['id', 'logo', 'marca', 'preco'],
        order: [['id', ordem]]
      });
      const imageLocal = "http://localhost:5000/upload/";
      // Envie os dados de volta como resposta
      res.status(200).json({ resultado: cardProduct, localImg: imageLocal });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar os dados do banco" });
    }
});  

app.post('/cadastrar',async (req,res)=>{
    const {nome,email,senha}=req.body;
    const emailDuplicado =await Client.findOne({
        where:{
            email:email
        }
    });
    if(!emailDuplicado){
        if(senha){
            const salt = bcrypt.genSaltSync(16);
            const hash = bcrypt.hashSync(senha,salt)
            if(nome && hash){
                const newUser = await Client.create({
                    nome:nome,
                    email:email,
                    senha:hash
                });
                res.status(201).json({client:newUser});
                console.log("Usuário criado com sucesso!");
            }else{
                res.status(301).json({error:`Não foi possível cadastrar o usuário ${nome}`});
            }
        }else{
            console.log("Você precisa cadastrar uma senha");
            res.status(301).json({alert:"Não tem nenhum senha!"});
        }
    }else{
        console.log(`O email ${email} já cadastrado no sistema`);
        res.status(301).json({alert:"Esse email já foi cadastrado"});
    } 
});

app.post('/produto', upload.single("logo"), async (req, res) => {
        if (req.file) {
            const { marca, preco } = req.body;
            const imgName = req.file.filename;
            // Remove acentos e mantém apenas caracteres alfanuméricos na marca
            const nomeArquivo = removeAccents(marca).replace(/[^a-zA-Z0-9]+/g, '_');
             // Adiciona um carimbo de data e a extensão .webp ao nome do arquivo
            const convertedImgName = `${nomeArquivo}_${Date.now()}.webp`;
            await sharp(`upload/${imgName}`).resize({ width: 300, fit: 'cover', position: 'center' }).toFile(`upload/${convertedImgName}`);
            fs.unlinkSync(`upload/${imgName}`);
            const localImg = convertedImgName;
            if (localImg && marca && preco) {
                const newProduct = await Product.create({
                    logo: localImg,
                    marca: marca,
                    preco: preco
                });
                console.log('Produto criado com sucesso!');
                res.status(200).json({ product: newProduct});
            } else {
                res.status(301).json({ error: "Não foi possível cadastrar o produto" });
            }
        } else {
            res.status(400).json({ error: "Nenhum arquivo foi enviado" });
        }
});


app.post('/acessar',async (req,res)=>{
    const {email, senha} =req.body;
    if(email){
        const checkDados = await Client.findOne({
            where:{
                email:email
            }
        });
        if(checkDados && senha) {
            const hash = checkDados.senha;
            const checkHash = bcrypt.compareSync(senha,hash);
            if(checkHash){
                jwt.sign(
                    {id:checkDados.id,email:checkDados.email},
                    keyPrivate,
                    {expiresIn:"48h"},
                    (error,token)=>{
                        error 
                        ? res.status(400).json({alert:"Falha Interna"})
                        : res.status(200).json({token:token});
                    }
                )
                console.log(`Login feito com sucesso!`);
            }else{
                console.log("A senha não é compatível!")
                res.status(301).redirect('/acessar')
            }
        }else{
            console.log("Não foi possível fazer Login");
            res.status(301).json({alert:"Algum campo está vázio"});
        }
    }else{
        res.status(301);
        console.log("É preciso ter um email e uma senha")
    }
});
app.get("/:id",async(req,res)=>{
    const id = req.params.id;
    const profileUser = await Product.findAll({
        attributes: ['id', 'logo', 'marca', 'preco'],
        where:{
            id:id
        }
    })
    res.status(200).json({infoData: profileUser});
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`);
});