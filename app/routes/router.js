var express = require("express");
var router = express.Router();
const { body, validationResult} = require("express-validator")
var {validarTelefone} = require("../helpers/validacoes");
var mysql = require("mysql2");
const dotenv = require('dotenv');
const usuarioController = require("../controllers/usuarioController");
const escolaController = require("../controllers/usuarioController");
dotenv.config();

module.exports = function () {
    try {
        let conexao = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORDITB,
            database: process.env.DATABASE,
            port: process.env.PORT
        });
        console.log("Conexão estabelecida!");
        return conexao;
    } catch (e) {
        console.log("Falha ao estabelecer a conexão!");
        console.log(e);
        return null;
    }
}


router.get('/', function(req, res) {
    res.render('pages/index');
});
router.get('/cadastro-escola', function(req, res) {
    res.render('pages/cadastro-escola',  { "erros": null, "valores": {"name_school":"","adress":"","adress_n":"", "city":"","state":"", "email":"","password":"","reppassword":""},"retorno":null });
});
router.get('/encontre-escolas', function(req, res) {
    res.render('pages/encontre-escolas');
});
router.get('/contato', function(req, res) {
    res.render('pages/contato');
});
router.get('/cadastro-usuario', function(req, res) {
    res.render('pages/cadastro-usuario', { "erros": null, "valores": {"name":"","email":"","password":"", "reppassword":"","cellphone":""},"retorno":null });
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
    res.render('pages/login', { "erros": null, "valores": {"email":"","password":"", "cnpj":""},"retorno":null });
});
router.get('/perfil-escola-e', function(req, res) {
  res.render('pages/perfil-escola-e');
});

router.get('/navbar', function(req, res) {
    res.render('partials/navbar');
});

router.get('/adm', function(req, res) {
  res.render('pages/index-adm');
});


router.post(
    "/login_post", usuarioController.regrasValidacaoLogin,);

  router.post(
    "/registro_post", usuarioController.regrasValidacaoUsuario,);

  router.post(
    "/cadastro_escola_post", usuarioController.regrasValidacaoEscola,);

module.exports = router;