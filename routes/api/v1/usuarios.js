const router = require("express").Router();
const UsuarioController = require("../../../controllers/UsuarioController");

const usuarioController = new UsuarioController();

router.get("/", usuarioController.index);//Auth
router.get("/:id", usuarioController.show);//Auth

router.post("/acessar", usuarioController.login);
router.post("/registrar", usuarioController.store);
router.put("/", usuarioController.update);//Auth
router.delete("/", usuarioController.remove);//Auth

router.get("/recuperar-senha", usuarioController.showRecovery);
router.post("/recuperar-senha", usuarioController.createRecovery);
router.get("/senha-recuperada", usuarioController.showCompleteRecovery);
router.post("/senha-recuperada", usuarioController.completeRecovery);

module.exports = router;