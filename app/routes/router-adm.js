const express = require("express");
const router = express.Router();
const admController = require("../controllers/admController");
const admControllerPainel = require("../controllers/admControllerPainel");
const { verificarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

router.get("/",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["A"], 'partials/401'),
    admControllerPainel.listarUsuarios,
    admControllerPainel.listarEscolas,
    admControllerPainel.buscarDadosGraficos,
    admController.listarUsuariosPaginados,

    function(req, res) {
        res.render('pages/adm/index-adm', {
            autenticado: req.session.autenticado,
            usuarios: res.locals.usuarios,
            escolas: res.locals.escolas,
            dadosGraficos: res.locals.dadosGraficos
        });
    }
);



router.get("/list",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["A"], 'partials/401'),
    admController.listarUsuarios,
    admController.listarEscolas,
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
    verificarUsuAutorizado(["A"], 'partials/401'),
    admControllerPainel.listarEscolas,
    function(req, res) {
        res.render('pages/adm/adm-list-escolas', {
            autenticado: req.session.autenticado,
            escolas: res.locals.escolas
        });
    }
);

router.get("/list-comum",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["A"], 'partials/401'),
    admControllerPainel.listarUsuariosComuns,
    function(req, res) {
        res.render('pages/adm/adm-list-comum', {
            autenticado: req.session.autenticado,
            usuariosComuns: res.locals.usuariosComuns
        });
    }
);

router.get("/list-adm",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["A"], 'partials/401'),
    admControllerPainel.listarUsuariosAdms,
    function(req, res) {
        res.render('pages/adm/adm-list-adm', {
            autenticado: req.session.autenticado,
            usuariosAdms: res.locals.usuariosAdms
        });
    }
);

router.get("/premium",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["A"], 'partials/401'),
    admControllerPainel.listarEscolasPremiumPaginadas
);

router.get("/denuncias",
    verificarUsuAutenticado,
    verificarUsuAutorizado(["A"], 'partials/401'),
    admControllerPainel.listarEscolas,
    function(req, res) {
        res.render('pages/adm/denuncias', {
            autenticado: req.session.autenticado,
            escolas: res.locals.escolas
        });
    }
);


module.exports = router;