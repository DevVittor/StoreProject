const Sequelize = require('sequelize');
const conn = require('../database/conn');

const Product = conn.define("products",{
    logo:{
        type:Sequelize.STRING,
        allowNull:false
    },
    marca:{
        type:Sequelize.STRING,
        allowNull:false
    },
    preco:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
})
Product.sync()
.then(()=>{
    console.log('A tabela products foi criada com sucesso!');
})
.catch(error=>console.error(`Não deu para criar a tabela por causa do error ${error}`));
module.exports = Product;