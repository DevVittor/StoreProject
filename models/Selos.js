const Sequelize = require("sequelize");
const conn = require("../database/conn");
const Client = require("../models/Client");

const Selos = conn.define("selos", {
    verificada: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    destaque: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    gratuita: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})
Selos.belongsTo(Client, { foreignKey: 'id' });
Selos.sync()
    .then(() => {
        console.log(`Tabela Selos foi criada com sucesso!`);
    }).catch((error) => console.error(`Não deu para criar a tabela Selos por causa disso. Error: ${error}`))