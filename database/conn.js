const Sequelize = require('sequelize');
const conn = new Sequelize(
    "Lojinha","root","mint",{
        host:"localhost",
        dialect:"mysql"
    }
)
conn.authenticate()
.then(()=>{
    console.log("Banco de dados foi sincronizado com sucesso!");
})
.catch(error=>console.error(`O banco de dados não pode ser sincronizado pelo error ${error}`));

module.exports=conn;