const usuarioModel = require("../models/usuarioModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarTelefone, telefoneExiste } = require("../helpers/validacoes");
const bcrypt = require("bcryptjs");
const https = require("https");
const jwt = require("jsonwebtoken");
const { removeImg } = require("../helpers/removeImg");
const path = require("path");
var salt = bcrypt.genSaltSync(12);
const emailAtivarConta = require("../helpers/email-ativar-conta");
const { enviarEmail } = require("../helpers/email");


const usuarioController = {

    regrasValidacaoPerfil: [
        body("nome")
            .isLength({ min: 3, max: 50 })
            .withMessage("Nome Inválido"),
        body("email")
            .isEmail()
            .withMessage("Email inválido.")
            .custom(async (value, { req }) => {
                const emailUsu = await usuarioModel.findCampoCustom(value);
                if (emailUsu > 0) {
                    const current = await usuarioModel.findId(req.session.autenticado.id);
                    if (current[0].email_usuario !== value) {
                        throw new Error('Email em uso!');
                    }
                }
            }),
        body("telefone")
            .custom(async value => {
                if (!validarTelefone(value)) {
                    throw new Error('Número de telefone inválido');
                }
            }),
        body("biografia")
            .optional()
            .isLength({ max: 255 })
            .withMessage("Biografia muito longa"),
        body("senha")
            .optional({ checkFalsy: true }),
    ],

    regrasValidacaoUsuario: [
        body("name")
            .isLength({ min: 3, max: 50 })
            .withMessage("Nome Inválido"),
        body("email")
            .isEmail()
            .withMessage("Email inválido.")
            .custom(async value => {
                const emailUsu = await usuarioModel.findCampoCustom(value);
                if (emailUsu > 0) {
                    throw new Error('Email em uso!');
                }
            }),
        body("cellphone")
            .custom(async value => {
                if (!validarTelefone(value)) {
                    throw new Error('Número de telefone inválido');
                }
            })
            .custom(async value => {
                const exists = await telefoneExiste(value);
                if (exists) {
                    throw new Error('Telefone já cadastrado');
                }
                return true;
            }),

        body("password")
            .isStrongPassword()
            .withMessage("Senha muito fraca!"),
        body("reppassword")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Senhas estão diferentes"),
    ],

    cadastrarUsuario: async (req, res) => {

        const erros = validationResult(req);
        console.log(erros);
            const dados = {
                name: req.body.name,
                email: req.body.email,
                cellphone: req.body.cellphone,
                password: bcrypt.hashSync(req.body.password, salt)
            };
        if (!erros.isEmpty()) {
                return res.render('pages/cadastro-usuario', { 
                    erros, 
                    valores: req.body,
                    dadosNotificacao: null
                });
            }
            console.log("Dados enviados para o banco:", dados);

        try {
            
            let create = await usuarioModel.create(dados);
            const token = jwt.sign(
                { usuarioI: create.insertId },
                process.env.SECRET_KEY,
            )
            console.log(token)

            // Send activation email
            const activationUrl = `${req.protocol}://${req.get('host')}`;
            const htmlContent = emailAtivarConta(activationUrl, token);
            enviarEmail(dados.email, "Ativação de Conta", null, htmlContent, () => {
                console.log("Activation email sent successfully.");
            });

            return res.render("pages/cadastro-usuario", {
                erros: null, 
                dadosNotificacao: {
                titulo: "Cadastro realizado!",
                mensagem: "Novo usuário criado com sucesso!<br>"+
                        "Enviamos um e-mail para a ativação de sua conta",
                tipo: "success",
                }, 
                valores: req.body
            })
            
            
        } catch (error) {

            console.log(error);
            return res.render("pages/cadastro-usuario", {
                erros: { errors: [{ msg: "Erro interno no servidor." }] },
                dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                },
                valores: req.body
            });
        }
    },

    mostrarPerfil: async (req, res) => {
        try {
            let id = req.query.id || req.session.autenticado.id;
            console.log("ID do usuário solicitado:", id);
            let results = await usuarioModel.findId(id);
            console.log("Resultado da busca:", results.length > 0 ? "Usuário encontrado" : "Usuário não encontrado");
            if (results.length === 0) {
                return res.render("pages/index", { erros: null, dadosNotificacao: { titulo: "Erro", mensagem: "Usuário não encontrado", tipo: "error" } });
            }

            let campos = {
                nome: results[0].nome_usuario, email: results[0].email_usuario,
                img_perfil_pasta: results[0].img_perfil_pasta ? results[0].img_perfil_pasta.replace('app/public', '') : null,
                img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
                telefone: results[0].telefone_usuario, senha: "", biografia: results[0].biografia_usuario,
                cor_banner: results[0].cor_banner
            }

            // Buscar avaliações do usuário
            const avalModel = require("../models/avalModel");
            const avaliacoes = await avalModel.findAllAval({ id_usuario: id });

            let view;
            if (id === req.session.autenticado.id) {
                if (req.path === '/perfil') {
                    view = "pages/perfil";
                } else if (req.path === '/info') {
                    view = "pages/perfil-usu-i";
                } else {
                    view = "pages/perfil copy";
                }
            } else {
                view = "pages/perfil-outro-usuario";
            }
            console.log("View a ser renderizada:", view);
            res.render(view, { erros: null, dadosNotificacao: null, valores: campos, avaliacoes: avaliacoes })
        } catch (e) {
            console.log("Erro no mostrarPerfil:", e);
            let view;
            if (req.path === '/perfil') {
                view = "pages/perfil";
            } else if (req.path === '/info') {
                view = "pages/perfil-usu-i";
            } else {
                view = "pages/perfil copy";
            }
            res.render(view, {
                erros: null, dadosNotificacao: null, valores: {
                    img_perfil_banco: "", img_perfil_pasta: "", name: "", email: "",
                     telefone: "", senha: "", biografia: "", cor_banner: ""
                }, avaliacoes: []
            })
        }
    },

    gravarPerfil: async (req, res) => {

        const erros = validationResult(req);
        const erroMulter = req.session.erroMulter;
        if (!erros.isEmpty() || erroMulter != null ) {
            lista =  !erros.isEmpty() ? erros : {formatter:null, errors:[]};
            if(erroMulter != null ){
                lista.errors.push(erroMulter);
                delete req.session.erroMulter;
            }
            return res.render("pages/perfil-usu-i", { erros: lista, dadosNotificacao: null, valores: req.body })
        }
        try {
            let currentUser = await usuarioModel.findId(req.session.autenticado.id);
            var dados = {
                nome: req.body.nome,
                email: req.body.email,
                telefone: req.body.telefone,
                biografia: req.body.biografia,
                cor_banner: req.body.cor_banner,
                senha_usuario: req.body.senha != "" ? bcrypt.hashSync(req.body.senha, salt) : currentUser[0].senha_usuario,
                img_perfil_id: currentUser[0].img_perfil_id
            };
            if (req.file) {
                let nomeImagem = req.file.originalname;
                let caminho = "app/public/imagem/uploads/" + req.file.filename;
                let newId = await usuarioModel.insertImage(nomeImagem, caminho);
                dados.img_perfil_id = newId;
                // remove old if exists
                if (currentUser[0].img_perfil_id != null) {
                    removeImg(currentUser[0].img_perfil_pasta);
                }
            }
            let resultUpdate = await usuarioModel.update(dados, req.session.autenticado.id);
            if (resultUpdate.affectedRows > 0) {
                if (resultUpdate.changedRows >= 1) {
                    var result = await usuarioModel.findId(req.session.autenticado.id);
                    var autenticado = {
                        autenticado: result[0].nome_usuario,
                        id: result[0].id_usuario,
                        tipo: result[0].tipo_usuario,
                        img_perfil_banco: result[0].img_perfil_banco != null ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString('base64')}` : null,
                        img_perfil_pasta: result[0].img_perfil_pasta ? result[0].img_perfil_pasta.replace('app/public', '') : null,
                        cor_banner: result[0].cor_banner
                    };
                    req.session.autenticado = autenticado;
                    var campos = {
                        nome: result[0].nome_usuario, email: result[0].email_usuario,
                        img_perfil_pasta: result[0].img_perfil_pasta ? result[0].img_perfil_pasta.replace('app/public', '') : null, img_perfil_banco: result[0].img_perfil_banco,
                        biografia: result[0].biografia_usuario, telefone: result[0].telefone_usuario, senha: "", cor_banner: result[0].cor_banner
                    }
                    res.render("pages/perfil-usu-i", { erros: null, dadosNotificacao: { titulo: "Perfil atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, valores: campos });
                }else{
                res.render("pages/perfil-usu-i", { erros: null, dadosNotificacao: { titulo: "Perfil atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: req.body });
                
                }
            } else {
            res.render("pages/perfil-usu-i", { erros: null, dadosNotificacao: { titulo: "Erro ao atualizar", mensagem: "Nenhuma alteração foi feita", tipo: "error" }, valores: req.body });
            }
        } catch (e) {
            console.log(e)
            res.render("pages/perfil-usu-i", { erros: { errors: [{ msg: "Erro interno no servidor." }] }, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body })
        }
    },

      ativarConta: async (req, res) => {
    try {
      const token = req.query.token;
      console.log(token);
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        console.log(decoded);
        if (err) {
          console.log({ message: "Token inválido ou expirado" });
        } else {
          const user = usuarioModel.findInativoId(decoded.userId);
          if (!user) {
            console.log({ message: "Usuário não encontrado" });
          } else {
            let resultUpdate = usuarioModel.update({ status_usuario: 1 }, decoded.userId);
            console.log({ message: "Conta ativada" });
            res.render("pages/login", {
              listaErros: null,
              autenticado: req.session.autenticado,
              dadosNotificacao: {
                titulo: "Sucesso",
                mensagem: "Conta ativada, use seu e-mail e senha para acessar o seu perfil!",
                tipo: "success",
              },
              valores: {
                email: "",
                password: ""
              }
            });
          }
          // Ativa a conta do usuário
        }
      });
    } catch (e) {
      console.log(e);
    }
  },

  excluirPerfil: async (req, res) => {
    try {
        const id = req.session.autenticado.id;
        const resultado = await usuarioModel.delete(id);
         console.log("Resultado da exclusão:", );
        console.log(resultado);
        if (resultado.affectedRows > 0) {
            req.session.destroy();
            return res.render("pages/login",                 
               {
                listaErros: null,
                dadosNotificacao: {
                    titulo: "Perfil excluído",
                    mensagem: "Seu perfil foi excluído com sucesso.",
                    tipo: "success"
                },
                valores: { email: "", password: "" }
            });
        } else {
            return res.render("pages/perfil-usu-i", {
                erros: { errors: [{ msg: "Não foi possível excluir o perfil." }] },
                dadosNotificacao: {
                    titulo: "Erro",
                    mensagem: "Tente novamente mais tarde.",
                    tipo: "error"
                },
                valores: {}
            });
        }
    } catch (error) {
        console.log(error);
        return res.render("pages/perfil-usu-i", {
            erros: { errors: [{ msg: "Erro interno ao excluir perfil." }] },
            dadosNotificacao: {
                titulo: "Erro",
                mensagem: "Tente novamente mais tarde.",
                tipo: "error"
            },
            valores: {}
        });
    }
},

carregarPerfil: async (req, res) => {
  try {
    const user = req.session.usuario;
    var userinfos = await usuarioModel.findByEmail(user.email);
    userinfos.tipo = userinfos.tipo[0].toUpperCase() + userinfos.tipo.substring(1);

    let ingressos = await UsuarioModel.findIngressosInscritos(userinfos.usu_id);


    res.render("pages/perfil", {
                 campos: {
                name: results[0].nome_usuario, email: results[0].email_usuario,
                img_perfil_pasta: results[0].img_perfil_pasta ? results[0].img_perfil_pasta.replace('app/public', '') : null,
                img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
                telefone: results[0].telefone_usuario, senha: "", biografia: results[0].biografia_usuario,
                cor_banner: results[0].cor_banner
            },
        ingressos: ingressos,
        dadosNotificacao:""
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
},




}

module.exports = usuarioController;