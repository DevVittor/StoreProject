const Sequelize = require("sequelize");
const conn = require("../database/conn");

const Usuarios = conn.define("usuarios", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Usuarios.sync({ force: true })
    .then(() => {
        console.log("Usuario foi criado com sucesso!")
    }).catch((error) => console.error(`Não deu para criar a tabela Usuário por causa do error ${error}`));
module.exports = Usuarios;