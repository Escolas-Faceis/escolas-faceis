const express = require("express");
const router = express.Router();
const admController = require("../controllers/admController");
const admControllerPainel = require("../controllers/admControllerPainel");
const { verificarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

router.get("/",
    verificarUsuAutenticado,
    admControllerPainel.listarUsuarios,
    admControllerPainel.listarEscolas,
    verificarUsuAutorizado(["ADM"], 'partials/401'),
    function(req, res) {
        res.render('pages/adm/index-adm', {
            autenticado: req.session.autenticado,
            usuarios: res.locals.usuarios,
            escolas: res.locals.escolas
        });
    }
);

router.get("/list",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["ADM"], 'partials/401'),
    admControllerPainel.listarUsuarios,
    admControllerPainel.listarEscolas,
    function(req, res) {
        res.render('pages/adm/adm-list', {
            autenticado: req.session.autenticado,
            usuarios: res.locals.usuarios,
            escolas: res.locals.escolas
        });
    }
);

router.get("/list-escolas",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["ADM"], 'partials/401'),
    admControllerPainel.listarEscolas,
    function(req, res) {
        res.render('pages/adm/adm-list-escolas', {
            autenticado: req.session.autenticado,
            escolas: res.locals.escolas
        });
    }
);

module.exports = router;