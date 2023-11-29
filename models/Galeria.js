const Sequelize = require("sequelize");
const conn = require("../database/conn");

const Galeria = conn.define("galerias", {
    fotos: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: "Sem imagens"
    }
})
Galeria.sync({ force: true })
    .then(() => {
        console.log("A tabela Galeria foi criada!");
    }).catch((error) => {
        console.error(`Não deu pra criar a tabela Galeria por causa do error: ${error}`);
    });
module.exports = Galeria;