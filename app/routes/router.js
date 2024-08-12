var express = require("express");
var router = express.Router();


router.get('/', function(req, res) {
    res.render('pages/index');
});
router.get('/cadastro-escola', function(req, res) {
    res.render('pages/cadastro-escola');
});
router.get('/encontre-escolas', function(req, res) {
    res.render('pages/encontre-escolas');
});
router.get('/contato', function(req, res) {
    res.render('pages/contato');
});
router.get('/cadastro-usuario', function(req, res) {
    res.render('pages/cadastro-usuario');
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
    res.render('pages/login');
});

router.get('/navbar', function(req, res) {
    res.render('partials/navbar');
});


module.exports = router;