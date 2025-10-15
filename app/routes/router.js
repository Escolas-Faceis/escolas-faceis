const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const mysql = require("mysql2");
const dotenv = require("dotenv");

const usuarioController = require("../controllers/usuarioController");
const escolaController = require("../controllers/escolaController");
const filtroController = require("../controllers/filtroController");
const loginController = require("../controllers/loginController");
const admController = require("../controllers/admController");
const usuarioModel = require("../models/usuarioModel");
const avalController = require("../controllers/avalController");
const assinaturaController = require("../controllers/assinaturaController");
const contatoController = require("../controllers/contatoController")

const uploadFile = require("../helpers/uploader")("app/public/imagem/uploads");
const multer = require("multer");
const path = require("path");
const fileFilter = (req, file, callBack) => {
    const allowedExtensions = /jpeg|jpg|png|gif|webp/;
    const extname = allowedExtensions.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
        return callBack(null, true);
    } else {
        callBack(new Error("Apenas arquivos de imagem são permitidos!"));
    }
};
const storagePasta = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "app/public/imagem/uploads");
    },
    filename: (req, file, callBack) => {
        callBack(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({
    storage: storagePasta,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: fileFilter,
});
const {
  verificarUsuAutenticado,
  limparSessao,
  gravarUsuAutenticado,
  verificarUsuAutorizado,
} = require("../models/autenticador_middleware");

dotenv.config();

// SDK do Mercado Pago
const { MercadoPagoConfig, Preference } = require("mercadopago");

// Adicione as credenciais
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

router.post("/create-preference", async function (req, res) {
  const preference = new Preference(client);
  console.log("🛒 Itens recebidos:", req.body.items);

  try {
    const result = await preference.create({
      body: {
        items: req.body.items,
        back_urls: {
          success: process.env.URL_BASE + "/feedback",
          failure: process.env.URL_BASE + "/feedback",
          pending: process.env.URL_BASE + "/feedback",
        },
        notification_url: process.env.URL_BASE + "/webhook-mercadopago",
        payer: {
          email: "test_user_123456@testuser.com", // e-mail fictício de teste
        },
      },
    });

    // Verifica a estrutura real retornada
    console.log("🔍 Resultado bruto da preferência:", result);

    // Extrai corretamente o link
    const body = result?.body || result; // em algumas versões vem dentro de .body, em outras direto

    console.log("✅ Preferência criada com sucesso!");
    console.log("🔗 Sandbox link:", body.sandbox_init_point);

    res.json({
      sandbox_init_point: body.sandbox_init_point || null,
      init_point: body.init_point || null,
      id: body.id || null,
    });

  } catch (error) {
    console.error("❌ Erro ao criar preferência:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/feedback", verificarUsuAutenticado, function (req, res) {
  assinaturaController.gravarAssinatura(req, res);
});

router.post("/webhook-mercadopago", function (req, res) {
  console.log("Webhook received:", req.body);
  // Processar notificações do MercadoPago aqui
  res.sendStatus(200);
});

router.get("/", verificarUsuAutenticado, async (req, res) => {
  try {
    const escolasPremium = await escolaController.listarEscolasPremium();
    res.render("pages/index", { escolasPremium });
  } catch (error) {
    console.log("Erro ao carregar homepage:", error);
    res.render("pages/index", { escolasPremium: [] });
  }
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

router.get("/encontre-escolas", filtroController.paginarEscolas);
router.get("/perfil-escola", verificarUsuAutorizado(["A", "C", "E"], "partials/login-required"), escolaController.mostrarPerfil);

router.get(
  "/editar-escola",
  verificarUsuAutorizado(["E"], "partials/401"),
  escolaController.mostrarEditarEscola,
  assinaturaController.verificarPremium
);

router.get("/planos", assinaturaController.mostrarPlanos);


router.post(
  "/editar_escola_post",
  upload.fields([{ name: 'imagem_perfil_usu', maxCount: 1 }, { name: 'imagens_carrossel', maxCount: 6 }]),
  escolaController.regrasValidacaoEditarEscola,
  verificarUsuAutorizado(["E"], "partials/401"),
    async (req, res) => {
    console.log("Route /editar_escola_post hit");
    escolaController.gravarPerfil(req, res);
  }

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

router.get("/perfil-usuario", (req, res) => {
  usuarioController.mostrarPerfil(req, res);
});

router.get("/redefinir", 
  verificarUsuAutenticado, 
  function(req, res){
    res.render("pages/redefinicao-senha",
      { listaErros: null, dadosNotificacao: null });
});

router.post("/redefinir_post",
  loginController.regrasValidacaoFormRecSenha,
  function(req, res){
    loginController.recuperarSenha(req, res);
    console.log("!@#")
});

router.get("/redefinir-senha",
  function(req, res){
    loginController.validarTokenNovaSenha(req, res);
  });

router.post("/resetar-senha",
  loginController.regrasValidacaoFormNovaSenha,
  function(req, res){
    loginController.resetarSenha(req, res);
  });

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
const uploadAval = multer();
router.post("/avaliar", uploadAval.none(), verificarUsuAutorizado(["A", "C", "E"], "partials/login-required"), avalController.criarAvaliacao);
router.post("/excluir-avaliacao", verificarUsuAutenticado, avalController.excluirAvaliacao);

router.get("/notificacoes", verificarUsuAutenticado, avalController.getNotificacoes);
router.post("/notificacoes/marcar-todas-lidas", verificarUsuAutenticado, avalController.marcarTodasLidas);

router.get("/api/avaliacoes/escola/:id", avalController.listarAvaliacoesPorEscola);

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

router.get("/pagamento", (req, res) => {
  // Produto padrão único
  const carrinho = [
    {
      produto: "Plano Premium Mensal",
      preco: 20.62,
      qtde: 1
    }
  ];
  res.render("pages/pagamento", { carrinho });
});


router.get("/redefinir-senha-st2", (req, res) => {
  res.render("pages/redefinir");
});

router.post("/assinar-plano", verificarUsuAutorizado(["E"], "partials/401"), assinaturaController.assinarPlano);
router.post("/cancelar-assinatura", verificarUsuAutorizado(["E"], "partials/401"), assinaturaController.cancelarAssinatura);
router.get("/api/premium-status/:id", assinaturaController.getStatusPremium);
router.post("/enviar-contato", contatoController.enviarMensagem);

module.exports = router;
