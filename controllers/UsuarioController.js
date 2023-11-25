const Usuario = require('../models/usuarioModel');
const conn = require("../database/conn");

class UsuarioController {

    index(req, re, next) {
        //
    }
    //Get /:id
    show(req, res, next) {
        Usuario.findById(req.params.id)
            .then(usuario => {
                if (!usuario) return res.status(401).json({ errors: "Usuário não registrado" })
                return res.json({
                    usuario: {
                        nome: usuario.nome,
                        email: usuario.email,
                    }
                })
            }).catch(next);
    }

    store(req, res, next) {
        const { nome, email, password } = req.body;
    }

}