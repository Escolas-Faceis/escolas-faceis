const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const mysql = require("mysql2");
const dotenv = require("dotenv");

const usuarioController = require("../controllers/usuarioController");
const escolaController = require("../controllers/escolaController");
const loginController = require("../controllers/loginController");
const admController = require("../controllers/admController");
const usuarioModel = require("../models/usuarioModel");

const uploadFile = require("../helpers/uploader")("app/public/imagem/uploads");

const {
  verificarUsuAutenticado,
  limparSessao,
  gravarUsuAutenticado,
  verificarUsuAutorizado,
} = require("../models/autenticador_middleware");

dotenv.config();

router.get("/", verificarUsuAutenticado, (req, res) => {
  res.render("pages/index");
});

router.get("/cadastro-escola", (req, res) => {
  res.render("pages/cadastro-escola", {
    erros: null,
    dadosNotificacao: null,
    valores: {
      name_school: "",
      adress: "",
      adress_n: "",
      city: "",
      state: "",
      email: "",
      password: "",
      reppassword: "",
    },
    retorno: null,
  });
});

router.get("/cadastro-usuario", (req, res) => {
  res.render("pages/cadastro-usuario", {
    erros: null,
    dadosNotificacao: null,
    valores: {
      name: "",
      email: "",
      password: "",
      reppassword: "",
      cellphone: "",
    },
  });
});

router.get("/contato", (req, res) => res.render("pages/contato"));
router.get("/edu-infantil", (req, res) => res.render("pages/edu-infantil"));
router.get("/ensino-fund1", (req, res) => res.render("pages/ensino-fund1"));
router.get("/ensino-fund2", (req, res) => res.render("pages/ensino-fund2"));
router.get("/ensino-medio", (req, res) => res.render("pages/ensino-medio"));
router.get("/cursos-tecnicos", (req, res) => res.render("pages/cursos-tecnicos"));
router.get("/cursos", (req, res) => res.render("pages/cursos"));
router.get("/mais-filtros", (req, res) => res.render("pages/mais-filtros"));
router.get("/perfil-escola-e", (req, res) => res.render("pages/perfil-escola-e"));
router.get("/navbar", (req, res) => res.render("partials/navbar"));
router.get("/401", (req, res) => res.render("partials/401"));

router.get("/encontre-escolas", escolaController.paginarEscolas);
router.get("/perfil-escola", escolaController.mostrarPerfil);

router.get(
  "/editar-escola",
  verificarUsuAutorizado(["E"], "partials/401"),
  (req, res) => {
    res.render("pages/editar-escola", {
      erros: null,
      dadosNotificacao: null,
      valores: {
        name_school: "",
        adress: "",
        adress_n: "",
        city: "",
        state: "",
        email: "",
        password: "",
        reppassword: "",
      },
    
    });
  }
);

router.get("/planos", (req, res) => {
  res.render("pages/assinatura");
});


router.post(
  "/editar_escola_post",
  uploadFile("imagem_perfil_usu"),
  escolaController.regrasValidacaoEditarEscola,
  verificarUsuAutorizado(["E"], "partials/401")
);

router.post(
  "/cadastro_escola_post",
  escolaController.regrasValidacaoEscola,
  (req, res) => {
    escolaController.cadastrarEscola(req, res);
  }
);

router.post(
  "/registro_post",
  usuarioController.regrasValidacaoUsuario,
  (req, res) => {
    usuarioController.cadastrarUsuario(req, res);
  }
);

router.get(
  "/perfil1",
  (req, res) => {
    usuarioController.mostrarPerfil(req, res);
  }
);

router.get(
  "/info",
  verificarUsuAutorizado(["A", "C"], "partials/401"),
  (req, res) => {
    usuarioController.mostrarPerfil(req, res);
  }
);

router.post(
  "/info_post",
  uploadFile("imagem_perfil_usu"),
  usuarioController.regrasValidacaoPerfil,
  verificarUsuAutorizado(["A", "C"], "partials/401"),
  async (req, res) => {
    if (req.body.cor_banner) {
      await usuarioModel.updateBannerColor(
        req.body.cor_banner,
        req.session.autenticado.id
      );
    }
    usuarioController.gravarPerfil(req, res);
  }
);

router.post("/excluir-perfil", usuarioController.excluirPerfil);

router.get("/login", (req, res) => {
  res.render("pages/login", {
    erros: null,
    dadosNotificacao: null,
    valores: { email: "", password: "", cnpj: "" },
    retorno: null,
  });
});

router.post(
  "/login_post",
  loginController.regrasValidacaoLogin,
  gravarUsuAutenticado,
  loginController.logar
);

router.get(
  "/ativar-conta",
  verificarUsuAutenticado,
  async (req, res) => {
    usuarioController.ativarConta(req, res);
  }
);

router.get("/ativar-conta", (req, res) => {
  res.render("pages/ativacao");
});

router.get("/sair", limparSessao, (req, res) => {
  res.redirect("/");
});

router.get("/redefinicao-senha", (req, res) => {
  res.render("pages/redefinicao-senha");
});

router.get("/redefinir-senha", (req, res) => {
  res.render("pages/redefinicao-senha");
});

router.get("/redefinir-senha-st2", (req, res) => {
  res.render("pages/redefinir");
});

module.exports = router;
