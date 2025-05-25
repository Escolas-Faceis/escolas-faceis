var express = require("express");
var router = express.Router();
const { body, validationResult} = require("express-validator")
var {validarTelefone} = require("../helpers/validacoes");
var mysql = require("mysql2");
const dotenv = require('dotenv');
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
    "/login_post",
    body("email").isEmail().withMessage("Email inválido."),
    body("password").isStrongPassword().withMessage("Senha muito fraca!"),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/login", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfil-usuario", { "erros": null, "valores":req.body,"retorno":req.body});
    }
  );

  router.post(
    "/registro_post",
    body("name").isLength({min:3,max:50}).withMessage("Nome Inválido"),
    body("email").isEmail().withMessage("Email inválido."),
    body("cellphone").custom((value) => {
        if (validarTelefone(value)) {
          return true;
        } else {
          throw new Error('Telefone inválido!');
        }
        }),
        body("password").isStrongPassword().withMessage("Senha muito fraca!"),
        body("reppassword").custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage("Senhas estão diferentes"),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/cadastro-usuario", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfil-usuario", { "erros": null, "valores":req.body,"retorno":req.body});
    }
  );

  router.post(
    "/cadastro_escola_post",
    body("name_school").isLength({min:3,max:70}).withMessage("Nome Inválido"),
    body("adress").isLength({min:3, max:50}).withMessage("Endereço Inválido"),
    body("adress_n").isNumeric().withMessage("Insira um número"),
    body("city").isLength({min:3,max:30}).withMessage("Insira uma cidade válida"),
    body("email").isEmail().withMessage("Email inválido."),
    body("password").isStrongPassword().withMessage("Senha muito fraca!"),
    body("reppassword").custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage("Senhas estão diferentes"),
    body("cnpj")
    .isLength({ min: 18, max: 18 }).withMessage('O CNPJ tem 18 caracteres!')
    .custom((value) => {
      if (validarCNPJ(value)) {
        return true;
      } else {
        throw new Error('CNPJ inválido!');
      }
    }),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/cadastro-escola", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfil-usuario", { "erros": null, "valores":req.body,"retorno":req.body});
    }
  );

module.exports = router;