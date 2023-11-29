const Sequelize = require("sequelize");
const conn = require("../database/conn");

const Permissoes = conn.define("permissoes",{
    gravarVideo:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
    },
    tirarFotos:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
    },
    viagemNacionais:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
    },
    viagemInternacionais:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
    }
})
Permissoes.sync({ force: true })
.then(()=>{
    console.log("Tabela permissões foi criada!")
}).catch((error)=>{
    console.error(`Não deu para criar a tabela permissões por causa do error: ${error}`);
});
module.exports = Permissoes;