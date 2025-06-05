const express = require("express");
const router = express.Router();
const admController = require("../controllers/admController");

// Use o controller para buscar usuários e escolas
router.get("/", admController.listarUsuarios, admController.listarEscolas, );

router.get("/novo", (req, res)=>{
    res.render("pages/adm-usuario-novo");
});

router.get("/list", (req, res)=>{
    res.render("pages/adm-list");
});

router.get("/escolas", (req, res)=>{
    res.render("pages/adm-list-escolas");
});

module.exports = router;