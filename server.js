require('dotenv').config();
require('./database/conn');
const express = require('express');
const stripe = require("stripe")(process.env.STRIPE);
const app = express();
const bcrypt = require('bcrypt');
const compression = require("compression");
const cors = require('cors');
const Client = require('./models/Client');
const Product = require('./models/Products');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = require("./config/multer");
const sharp = require("sharp");
const fs = require("fs");
const bodyParser = require("body-parser");
const removeAccents = require('remove-accents');
//const Jimp = require("jimp");
const { Op } = require('sequelize');

//const productRoutes = require("./routes/ProductRoutes");

//app.use("/produto", productRoutes);

const port = process.env.PORT || 3000;
const keyPrivate = process.env.TOKENPRIVATE;

/*sharp.cache(false);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });*/

app.use('/upload', express.static('upload'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cors());
app.disable("x-powered-by");

app.get("/", async (req, res) => {
    const ordem = req.query.ordem;
    const busca = req.query.inputBusca;
    try {
        let whereClause = {}; // Inicializa um objeto vazio para a cláusula WHERE

        // Se houver uma busca por nome, configura a cláusula WHERE para filtrar pelo nome
        if (busca && busca !== 'undefined' && busca.trim() !== "") {
            whereClause = {
                [Op.or]: [
                    { nome: { [Op.like]: `%${busca}%` } },
                    { preco: { [Op.like]: `%${busca}%` } },
                    { estado: { [Op.like]: `%${busca}%` } }
                ]
            };
        } else {
            whereClause = {};
        }

        const cardProduct = await Product.findAll({
            attributes: ['id', 'avatar', 'nome', 'preco', 'estado', 'cidade', 'genero'],
            where: whereClause, // Aplica a cláusula WHERE na consulta
            order: [['id', ordem]]
        });
        const imageLocal = "http://localhost:8080/upload/";
        res.status(200).json({ resultado: cardProduct, localImg: imageLocal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar os dados do banco" });
    }
});

app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    const emailDuplicado = await Client.findOne({
        where: {
            email: email
        }
    });
    if (!emailDuplicado) {
        if (senha) {
            const salt = bcrypt.genSaltSync(16);
            const hash = bcrypt.hashSync(senha, salt);
            if (nome && hash) {
                const newUser = await Client.create({
                    nome: nome,
                    email: email,
                    senha: hash
                });
                const checkDados = await Client.findOne({
                    where: {
                        email: email
                    }
                })
                if (checkDados) {
                    jwt.sign(
                        { id: checkDados.id, email: checkDados.email },
                        keyPrivate,
                        { expiresIn: "48h" },
                        (error, token) => {
                            if (error) {
                                console.error("Erro ao criar token:", error);
                                res.status(500).json({ alert: "Falha Interna" });
                            } else {
                                console.log("Token foi criado", checkDados.id);
                                res.status(201).json({ token: token, user: newUser, useId: checkDados.id });
                            }
                        }
                    );
                } else {
                    res.status(500).json({ alert: "Erro ao criar usuário" });
                }
            } else {
                res.status(301).json({ error: `Não foi possível cadastrar o usuário ${nome}` });
            }
        } else {
            console.log("Você precisa cadastrar uma senha");
            res.status(301).json({ alert: "Não tem nenhum senha!" });
        }
    } else {
        console.log(`O email ${email} já cadastrado no sistema`);
        res.status(301).json({ alert: "Esse email já foi cadastrado" });
    }
});

app.get('/produto/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Lógica para buscar o produto no banco de dados usando o ID fornecido
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Retorna o produto encontrado
        res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar o produto' });
    }
});

app.post('/produto', upload.single("avatar"), async (req, res) => {
    if (req.file) {
        const { idClient, nome, preco, idade, estado, cidade, genero,
            altura, peso, descricao, pix, dinheiro, cartaoCredito,
            cartaoDebito, anal, boquete, beijo, massagem, chuvaDourada } = req.body;
        const imgName = req.file.filename;

        const servicosNormaisObj = { anal, boquete, beijo };
        const servicosEspeciaisObj = { massagem, chuvaDourada };

        /*//Inicio do Jimp
        const imagem = await Jimp.read(`upload/${imgName}`);
        const marcaDagua = await Jimp.read(`public/marca.png`);
        marcaDagua.opacity(1); // Ajuste a opacidade conforme necessário
        marcaDagua.resize(256, 256);
        // Obter as dimensões da imagem principal e da marca d'água
        const imagemWidth = imagem.bitmap.width;
        const imagemHeight = imagem.bitmap.height;
        const marcaWidth = marcaDagua.bitmap.width;
        const marcaHeight = marcaDagua.bitmap.height;

        // Definir as coordenadas para o canto inferior direito
        const coordenadaX = imagemWidth - marcaWidth - 10; // Ajuste os valores de margem conforme desejado
        const coordenadaY = imagemHeight - marcaHeight - 10; // Ajuste os valores de margem conforme desejado

        imagem.composite(marcaDagua, coordenadaX, coordenadaY, {
            mode: Jimp.BLEND_SOURCE_OVER,
        });
        await imagem.writeAsync(`upload/${imgName}`);*/
        //Fim do Jimp
        // Remove acentos e mantém apenas caracteres alfanuméricos no nome
        const nomeArquivo = removeAccents(nome).replace(/[^a-zA-Z0-9]+/g, '_');
        // Adiciona um carimbo de data e a extensão .webp ao nome do arquivo
        const convertedImgName = `${nomeArquivo}_${Date.now()}.webp`;
        await sharp(`upload/${imgName}`).resize({ width: 600, fit: 'cover', position: 'center' }).toFile(`upload/${convertedImgName}`);
        fs.unlinkSync(`upload/${imgName}`);
        const localImg = convertedImgName;

        if (localImg && idClient && nome && preco && idade && estado && cidade
            && genero && altura && peso && descricao && pix && dinheiro && cartaoCredito
            && cartaoDebito && anal && boquete && beijo && massagem && chuvaDourada) {
            const newProduct = await Product.create({
                avatar: localImg,
                id: idClient,
                nome: nome,
                preco: preco,
                idade: idade,
                estado: estado,
                cidade: cidade,
                genero: genero,
                altura: altura,
                peso: peso,
                descricao: descricao,
                pix: pix,
                dinheiro: dinheiro,
                cartaoCredito: cartaoCredito,
                cartaoDebito: cartaoDebito,
                servicosNormais: servicosNormaisObj,
                servicosEspeciais: servicosEspeciaisObj
            });
            console.log('Produto criado com sucesso!');
            res.status(200).json({ product: newProduct });
        } else {
            res.status(301).json({ error: "Não foi possível cadastrar o produto" });
        }
    } else {
        res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }
});

/*app.post('/produto', upload.single("avatar"), async (req, res) => {
    if (req.file) {
        const { idClient, nome, preco, idade, estado, cidade, genero,
            altura, peso, descricao, pix, dinheiro, cartaoCredito,
            cartaoDebito, anal, boquete, beijo, massagem, chuvaDourada } = req.body;
        const imgName = req.file.filename;

        const servicosNormaisObj = { anal, boquete, beijo };
        const servicosEspeciaisObj = { massagem, chuvaDourada };

        //Inicio do Jimp
        const imagem = await Jimp.read(`upload/${imgName}`);
        const marcaDagua = await Jimp.read(`public/marca.png`);
        marcaDagua.opacity(1); // Ajuste a opacidade conforme necessário
        marcaDagua.resize(256, 256);
        // Obter as dimensões da imagem principal e da marca d'água
        const imagemWidth = imagem.bitmap.width;
        const imagemHeight = imagem.bitmap.height;
        const marcaWidth = marcaDagua.bitmap.width;
        const marcaHeight = marcaDagua.bitmap.height;

        // Definir as coordenadas para o canto inferior direito
        const coordenadaX = imagemWidth - marcaWidth - 10; // Ajuste os valores de margem conforme desejado
        const coordenadaY = imagemHeight - marcaHeight - 10; // Ajuste os valores de margem conforme desejado

        imagem.composite(marcaDagua, coordenadaX, coordenadaY, {
            mode: Jimp.BLEND_SOURCE_OVER,
        });
        await imagem.writeAsync(`upload/${imgName}`);
        //Fim do Jimp
        // Remove acentos e mantém apenas caracteres alfanuméricos no nome
        const nomeArquivo = removeAccents(nome).replace(/[^a-zA-Z0-9]+/g, '_');
        // Adiciona um carimbo de data e a extensão .webp ao nome do arquivo
        const convertedImgName = `${nomeArquivo}_${Date.now()}.webp`;
        await sharp(`upload/${imgName}`).resize({ width: 600, fit: 'cover', position: 'center' }).toFile(`upload/${convertedImgName}`);
        fs.unlinkSync(`upload/${imgName}`);
        const localImg = convertedImgName;

        if (localImg && idClient && nome && preco && idade && estado && cidade
            && genero && altura && peso && descricao && pix && dinheiro && cartaoCredito
            && cartaoDebito && anal && boquete && beijo && massagem && chuvaDourada) {
            const newProduct = await Product.create({
                avatar: localImg,
                id: idClient,
                nome: nome,
                preco: preco,
                idade: idade,
                estado: estado,
                cidade: cidade,
                genero: genero,
                altura: altura,
                peso: peso,
                descricao: descricao,
                pix: pix,
                dinheiro: dinheiro,
                cartaoCredito: cartaoCredito,
                cartaoDebito: cartaoDebito,
                servicosNormais: servicosNormaisObj,
                servicosEspeciais: servicosEspeciaisObj
            });
            console.log('Produto criado com sucesso!');
            res.status(200).json({ product: newProduct });
        } else {
            res.status(301).json({ error: "Não foi possível cadastrar o produto" });
        }
    } else {
        res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }
});*/

app.post('/acessar', async (req, res) => {
    const { email, senha } = req.body;
    if (email) {
        const checkDados = await Client.findOne({
            where: {
                email: email
            }
        });
        if (checkDados && senha) {
            const hash = checkDados.senha;
            const checkHash = bcrypt.compareSync(senha, hash)
            if (checkHash) {
                jwt.sign(
                    { id: checkDados.id, email: checkDados.email },
                    keyPrivate,
                    { expiresIn: "48h" },
                    (error, token) => {
                        error
                            ? res.status(400).json({ alert: "Falha Interna" })
                            : res.status(200).json({ token: token, useId: checkDados.id });
                    }
                )
                console.log(`Login feito com sucesso!`);
            } else {
                console.log("A senha não é compatível!")
                res.status(301).redirect('/acessar')
            }
        } else {
            console.log("Não foi possível fazer Login");
            res.status(301).json({ alert: "Algum campo está vázio" });
        }
    } else {
        res.status(301);
        console.log("É preciso ter um email e uma senha")
    }
});

app.post("/criarPerfil", async (req, res) => {
    const userId = req.body.userId;
    res.json({ resposta: userId });
});

app.get("/:id", async (req, res) => {
    const id = req.params.id;
    const profileUser = await Product.findAll({
        attributes: ['id', 'avatar', 'nome', 'preco', 'idade', 'estado', 'cidade',
            'genero', 'altura', 'peso', 'descricao', 'pix', 'dinheiro', 'cartaoCredito',
            'cartaoDebito', 'servicosNormais', 'servicosEspeciais'],

        where: {
            id: id
        }
    })
    res.status(200).json({ infoData: profileUser });
});

app.get("/success", (req, res) => {
    res.json({ id: idUser });
});
app.get("/cancel", (req, res) => {
    res.send("Cancelada");
});
let idUser = 2;
app.post("/checkstripe", async (req, res) => {
    const { priceId } = req.body;
    console.log("Corpo da solicitação recebida:", req.body);
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `http://localhost:5173/success?session_id=${idUser}`,
        cancel_url: `http://localhost:5173/cancel`,
    });
    res.status(200).json({ url: session.url });
});
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} e servidor conectado`);
});