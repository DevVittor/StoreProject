const Product = require("../models/Products");

async function createProduct(req, res) {
    const {
        idClient, nome, preco, idade, estado, cidade,
        genero, altura, peso, descricao, pix, dinheiro,
        cartaoCredito, cartaoDebito, anal, boquete,
        beijo, massagem, chuvaDourada
    } = req.body;

    const { localImg } = req; // Obtém o local da imagem processada do middleware anterior

    const servicosNormaisObj = { anal, boquete, beijo };
    const servicosEspeciaisObj = { massagem, chuvaDourada };

    try {
        const newProduct = await Product.create({
            avatar: localImg,
            id: idClient,
            nome,
            preco,
            idade,
            estado,
            cidade,
            genero,
            altura,
            peso,
            descricao,
            pix,
            dinheiro,
            cartaoCredito,
            cartaoDebito,
            servicosNormais: servicosNormaisObj,
            servicosEspeciais: servicosEspeciaisObj
        });

        console.log('Produto criado com sucesso!');
        res.status(200).json({ product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar o produto' });
    }
};
module.exports = { createProduct };