const loginModel = require("../models/loginModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const https = require("https");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(12);
const { enviarEmail } = require("../helpers/email");
const usuarioController = require("./usuarioController");
const usuarioModel = require("../models/usuarioModel");

const loginController = {

        regrasValidacaoLogin: [
        body("email")
            .isEmail()
            .withMessage("Email inválido."),
        body("password")
            .notEmpty()
            .withMessage("Senha é obrigatória.")

    ],
    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/login", { erros: erros, dadosNotificacao: null, "valores": req.body, "retorno": null })
        }
        
        if (req.session.autenticado && req.session.autenticado.autenticado != null) {
            console.log("Usuário logado com sucesso:", req.session.autenticado);
            res.redirect("/");
        } else {
            console.log("Falha na autenticação");
            res.render("pages/login", {
                erros: null,
                dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" },
                "valores": req.body, "retorno": null
            })
        }
    },

    mostrarPerfil: async (req, res) => {
        try {
            let results = await usuario.findId(req.session.autenticado.id);
            if (results[0].cep_usuario != null) {
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });
                const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_usuario}/json/`,
                    { method: 'GET', headers: null, body: null, agent: httpsAgent, });
                var viaCep = await response.json();
                var cep = results[0].cep_usuario.slice(0,5)+ "-"+results[0].cep_usuario.slice(5)
            }else{
                var viaCep = {logradouro:"", bairro:"", localidade:"", uf:""}
                var cep = null;
            }

            let campos = {
                nome_usu: results[0].nome_usuario, email_usu: results[0].email_usuario,
                cep:  cep, 
                numero: results[0].numero_usuario,
                complemento: results[0].complemento_usuario, logradouro: viaCep.logradouro,
                bairro: viaCep.bairro, localidade: viaCep.localidade, uf: viaCep.uf,
                img_perfil_pasta: results[0].img_perfil_pasta,
                img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
                nomeusu_usu: results[0].user_usuario, fone_usu: results[0].fone_usuario, senha_usu: ""
            }

            res.render("pages/perfil", { listaErros: null, dadosNotificacao: null, valores: campos })
        } catch (e) {
            console.log(e);
            res.render("pages/perfil", {
                listaErros: null, dadosNotificacao: null, valores: {
                    img_perfil_banco: "", img_perfil_pasta: "", nome_usu: "", email_usu: "",
                    nomeusu_usu: "", fone_usu: "", senha_usu: "", cep: "", numero: "", complemento: "",
                    logradouro: "", bairro: "", localidade: "", uf: ""
                }
            })
        }
    },

  regrasValidacaoFormNovaSenha: [
    body("senha")
      .isLength({ min: 8 })
      .withMessage("A senha deve ter pelo menos 8 caracteres")
      .matches(/[A-Z]/)
      .withMessage("A senha deve conter pelo menos 1 letra maiúscula")
      .matches(/[a-z]/)
      .withMessage("A senha deve conter pelo menos 1 letra minúscula")
      .matches(/\d/)
      .withMessage("A senha deve conter pelo menos 1 número")
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
      .withMessage("A senha deve conter pelo menos 1 caractere especial")
      .custom(async (value, { req }) => {
        if (value !== req.body.csenha) {
          throw new Error("As senhas não são iguais!");
        }
      }),
    body("csenha")
      .notEmpty()
      .withMessage("Confirmação de senha é obrigatória"),
  ],

  regrasValidacaoFormRecSenha: [
    body("email")
      .isEmail()
      .withMessage("Digite um e-mail válido!")
      .custom(async (value) => {
        const nomeUsu = await loginModel.findCampoCustom({ email_usuario: value });
        if (nomeUsu == 0) {
          throw new Error("E-mail não encontrado");
        }
      }),
  ],

    recuperarSenha: async (req, res) => {
    const erros = validationResult(req);
    console.log(erros);
    if (!erros.isEmpty()) {
    return res.render("pages/redefinicao-senha", {
      listaErros: erros,
      dadosNotificacao: null,
      valores: req.body,
    });
  }

    try {
    const user = await loginModel.findUserCustom({
      email_usuario: req.body.email,
    });

    const token = jwt.sign(
      { userId: user[0].id_usuario, expiresIn: "40m" },
      process.env.SECRET_KEY
    );

    const html = require("../helpers/email-reset-senha")(
      process.env.URL_BASE,
      token,
      user[0].nome_usuario
    );

    enviarEmail(
      req.body.email,
      "Pedido de recuperação de senha",
      null,
      html,
      () => {
        console.log("Email enviadinho");
        res.render("pages/redefinicao-senha", {
          listaErros: null,
          dadosNotificacao: {
            titulo: "Recuperação de senha",
            mensagem:
              "Enviamos um e-mail com instruções para resetar sua senha",
            tipo: "success",
          },
          valores: req.body,
        });
      }
    );
  } catch (e) {
    console.log(e);
  }
},

    validarTokenNovaSenha: async (req, res) => {
  const token = req.query.token;
  console.log(token);

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      // Caso o token seja inválido ou tenha expirado
      return res.render("pages/redefinicao-senha", {
        listaErros: null,
        dadosNotificacao: {
          titulo: "Link expirado!",
          mensagem: "Insira seu e-mail para iniciar o reset de senha.",
          tipo: "error",
        },
        valores: req.body,
      });
    } else {
      // Token válido → renderiza a página de redefinição de senha
      return res.render("pages/redefinir-senha", {
        listaErros: null,
        autenticado: req.session.autenticado,
        id_usuario: decoded.userId,
        dadosNotificacao: null,
      });
    }
  });
},

      resetarSenha: async (req, res) => {
    const erros = validationResult(req);
    console.log(erros);
    if (!erros.isEmpty()) {
      return res.render("pages/redefinicao-senha", {
        listaErros: erros,
        dadosNotificacao: null,
        valores: req.body,
      });
    }
    try {
      //gravar nova senha
      const senha = bcrypt.hashSync(req.body.senha, salt);
      const resetar = await usuarioModel.updatePassword(senha, req.body.id_usuario);
      console.log(resetar);
      res.render("pages/login", {
        listaErros: null,
        dadosNotificacao: {
          titulo: "Perfil alterado",
          mensagem: "Nova senha registrada",
          tipo: "success",
        },
        valores: req.body,
      });
    } catch (e) {
      console.log(e);
    }
  },







}

module.exports = loginController;