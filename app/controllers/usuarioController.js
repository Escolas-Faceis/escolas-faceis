const usuarioModel = require("../models/usuarioModel");
const escolaModel = require("../models/usuarioModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarTelefone } = require("../helpers/validacoes");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);

const usuarioController = {

    regrasValidacaoUsuario: [
        body("name")
            .isLength({ min: 3, max: 50 })
            .withMessage("Nome Inválido"),
        body("email")
            .isEmail()
            .withMessage("Email inválido.")
            .custom(async value => {
                const emailUsu = await usuario.findCampoCustom({'email': value});
                if (emailUsu > 0) {
                    throw new Error('Email em uso!');
                }
            }),
        body("cellphone")
            .custom(async value => {
                if (!validarTelefone(value)) {
                    throw new Error('Telefone inválido');
                }

                const emailUsu = await usuario.findCampoCustom({'cellphone': value});
                if (emailUsu > 0) {
                    throw new Error('Número de telefone em uso!');
                }
                return true;
            })
            ,
        body("password")
            .isStrongPassword()
            .withMessage("Senha muito fraca!"),
        body("reppassword")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Senhas estão diferentes"),
    ],

    cadastrarUsuario: async (req, res) => {
        try {
            let erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.render('pages/cadastro-usuario', { 
                    erros, 
                    valores: req.body,
                    dadosNotificacao: null
                });
            }
            
            const dados = {
                name: req.body.name,
                email: req.body.email,
                cellphone: req.body.cellphone,
                password: bcrypt.hashSync(req.body.password, salt)
            };

            //acho q é pra notificação =P
            let create = usuarioModel.create(dados);
            res.render("pages/cadastro-usuario", {
                listaErros: null, dadosNotificacao: {
                    titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
                }, valores: req.body
            })
            
            //teste do console :-*
            console.log("Dados enviados para o banco:", dados);
            let resultado = await usuarioModel.create(dados);

            if (resultado) {
                return res.render("pages/index");
            } else {
                return res.render("pages/cadastro-usuario", {
                    erros: { errors: [{ msg: "Erro ao cadastrar." }] },
                    valores: req.body
                });
            }
            
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
    }

}

module.exports = usuarioController;