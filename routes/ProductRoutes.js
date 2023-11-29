const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const uploadMiddleware = require("../middleware/uploadImagem");
const validationMiddleware = require("../middleware/validacao");
const upload = require("../config/multer");


router.post("/",
    upload.single("avatar"),
    validationMiddleware.validarCampos,
    uploadMiddleware.processarImagem,
    productController.createProduct,
);

module.exports = router;