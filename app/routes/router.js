var express = require("express");
var router = express.Router();
const { body, validationResult} = require("express-validator")
var mysql = require("mysql2");
const dotenv = require('dotenv');
const usuarioController = require("../controllers/usuarioController");
const escolaController = require("../controllers/escolaController");
const loginController = require("../controllers/loginController");
const admController = require("../controllers/admController");
dotenv.config();

const {
  verificarUsuAutenticado,
  limparSessao,
  gravarUsuAutenticado,
  verificarUsuAutorizado,
} = require("../models/autenticador_middleware");



router.get("/", verificarUsuAutenticado, function (req, res) {
  res.render("pages/index", req.session.autenticado);
});
router.get('/cadastro-escola', function(req, res) {
    res.render('pages/cadastro-escola',  { "erros": null, dadosNotificacao: null, "valores": {"name_school":"","adress":"","adress_n":"", "city":"", "cep":"", "state":"", "email":"","password":"","reppassword":""},"retorno":null });
});

router.get('/encontre-escolas', function(req, res) {
    res.render('pages/encontre-escolas');
});
router.get('/contato', function(req, res) {
    res.render('pages/contato');
});
router.get('/cadastro-usuario', function(req, res) {
    res.render('pages/cadastro-usuario', {  erros : null, dadosNotificacao: null, valores : {"name":"","email":"","password":"", "reppassword":"","cellphone":""} });
});
router.get('/perfil-escola', function(req, res) {
    res.render('pages/perfil-escola');
});
router.get('/perfil-usuario', function(req, res) {
    res.render('pages/perfil-usuario');
});
router.get('/edu-infantil', function(req, res) {
    res.render('pages/edu-infantil');
});
router.get('/ensino-fund1', function(req, res) {
    res.render('pages/ensino-fund1');
});
router.get('/ensino-fund2', function(req, res) {
    res.render('pages/ensino-fund2');
});
router.get('/ensino-medio', function(req, res) {
    res.render('pages/ensino-medio');
});
router.get('/cursos-tecnicos', function(req, res) {
    res.render('pages/cursos-tecnicos');
});
router.get('/cursos', function(req, res) {
    res.render('pages/cursos');
});
router.get('/redefinicao-senha', function(req, res) {
    res.render('pages/redefinicao-senha');
});
router.get('/mais-filtros', function(req, res) {
    res.render('pages/mais-filtros');
});
router.get('/login', function(req, res) {
    res.render('pages/login', { "erros": null, dadosNotificacao: null, "valores": {"email":"","password":"", "cnpj":""},"retorno":null });
});
router.get('/perfil-escola-e', function(req, res) {
  res.render('pages/perfil-escola-e');
});

router.get('/navbar', function(req, res) {
    res.render('partials/navbar');
});

router.get('/adm', admController.listarUsuarios, admController.listarEscolas);

router.get('/ativacao-de-conta', function(req, res) {
    res.render('pages/ativacao');
});
 
router.get('/redefinir-senha', function(req, res) {
    res.render('pages/redefinicao-senha');
});
 
router.get('/redefinir-senha-st2', function(req, res) {
    res.render('pages/redefinir');
});

router.get("/sair", limparSessao, function (req, res) {
  res.redirect("/");
});

router.post(
    "/login_post", loginController.regrasValidacaoLogin, loginController.login);

  router.post(
    "/registro_post",
    usuarioController.regrasValidacaoUsuario,
    (req, res) => {
        usuarioController.cadastrarUsuario(req, res);
    }
);

  router.post(
    "/cadastro_escola_post",
    escolaController.regrasValidacaoEscola,
    (req, res) =>{
        escolaController.cadastrarEscola(req, res);
    }
);

module.exports = router;