const Sequelize = require("sequelize");
const conn = require("../database/conn");

const Usuarios = conn.define("usuarios",{
    nome:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:"É necessário digitar o seu primeiro nome"}
        }
    },
    sobrenome:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:"É necessário digitar o seu sobrenome"}
        }
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:"É necessário digitar um email válido"}
        }
    },
    senha:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:"Tem que escolher uma senha válida"}
        }
    }
});
Usuarios.sync({ force: true })
.then(()=>{
    console.log(`A tabela usuários foi criada!`)
}).catch((error)=>{
    console.error(`Não deu para criar a tabela usuarios por causa do error: ${error}`);
})
module.exports = Usuarios;