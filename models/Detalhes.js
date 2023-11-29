const Sequelize = require("sequelize");
const conn = require("../database/conn");

const Detalhes = conn.define("detalhes", {
    corPele: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Não informado"
    },
    corOlhos: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Não informado"
    },
    corCabelo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Não informado"
    },
    estiloCabelo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Não informado"
    },
    aparelhoBocal: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Não informado"
    },
    pelos: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: "Não informado"
    }
})
Detalhes.sync({ force: true })
    .then(() => {
        console.log(`Tabela de detalhes foi criada!`);
    })
    .catch((error) => {
        console.error(`Não deu para criar a tabela detalhes por causa do error: ${error}`);
    });
module.exports = Detalhes;