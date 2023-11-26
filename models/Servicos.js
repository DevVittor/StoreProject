const Sequelize = require("sequelize");
const conn = require("../database/conn");
const Client = require("../models/Client");

const Servicos = conn.define("servicos", {
    servicosNormais: {
        type: Sequelize.JSON,
        allowNull: false
    },
    servicosEspeciais: {
        type: Sequelize.JSON,
        allowNull: false
    }
});
Servicos.belongsTo(Client, { foreignKey: 'id' });
Servicos.sync()
    .then(() => {
        console.log(`Tabela serviços foi criada com sucesso!`)
    }).catch(error => console.error(`Não foi possível criar a tabela serviços por causa do error: ${error}`));
module.exports = Servicos;