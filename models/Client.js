const Sequelize = require('sequelize');
const conn = require('../database/conn');

const userClient = conn.define("client",{
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    senha:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
userClient.sync()
.then(()=>{
    console.log('Tabela client foi criado com sucesso!');
}).catch(error=>console.error(`Não foi possível criar a tabela client por causa do error ${error}`));   
module.exports = userClient;
