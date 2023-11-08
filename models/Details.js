const Sequelize = require("sequelize");
const conn = require("../database/conn");
const Client = require("../models/Client");

const Details = conn.define("details", {
    altura: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    idade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true, // Defina allowNull como true para remover a obrigatoriedade
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
});
Details.belongsTo(Client);
Details.sync()
    .then(() => {
        console.log("Tabela Details Criada com sucesso!")
    }).catch(error => console.error(`Não foi possível criar a tabela Details por causa do error ${error}`));
module.exports = Details;