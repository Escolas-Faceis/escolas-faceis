const express = require("express");
const router = express.Router();
const admController = require("../controllers/admController");
const admControllerPainel = require("../controllers/admController");

// Use o controller para buscar usuários e escolas
router.get("/", admController.listarUsuarios, admController.listarEscolas, );

router.get("/list", admControllerPainel.listarUsuarios, admControllerPainel.listarEscolas); 

router.get("/list-escolas", admControllerPainel.listarEscolas);

// router.get("/list-padrao", admControllerPainel.listarDefault);


module.exports = router;