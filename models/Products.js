const Sequelize = require('sequelize');
const conn = require('../database/conn');
const Client = require("../models/Client");

const Product = conn.define("products", {
    avatar: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    genero: {
        type: Sequelize.STRING,
        allowNull: false
    },
    altura: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    peso: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    vericado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    destaque: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    pix: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    dinheiro: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    cartaoCredito: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    cartaoDebito: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
})
Product.belongsTo(Client, { foreignKey: 'id' });
Product.sync()
    .then(() => {
        console.log('A tabela products foi criada com sucesso!');
    })
    .catch(error => console.error(`Não deu para criar a tabela por causa do error ${error}`));
module.exports = Product;