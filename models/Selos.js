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
// Exemplo de como remover a restrição de chave estrangeira na tabela selos
Selos.destroy({ where: { /* Condição para encontrar os registros que fazem referência a clients */ } })
    .then(() => {
        // Após a remoção dos dados, tente criar a tabela selos novamente
        Selos.sync({ force: true })
            .then(() => {
                console.log(`Tabela Selos foi criada com sucesso!`);
            })
            .catch((error) => console.error(`Não foi possível criar a tabela Selos: ${error}`));
    })
    .catch((error) => console.error(`Erro ao remover os dados da tabela Selos: ${error}`));
module.exports = Selos;