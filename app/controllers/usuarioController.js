const usuarioModel = require("../models/usuarioModel");
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
            // let resultado = await usuarioModel.create(dados);

            // if (resultado) {
            //     return res.render("pages/index");
            // } else {
            //     return res.render("pages/cadastro-usuario", {
            //         erros: { errors: [{ msg: "Erro ao cadastrar." }] },
            //         valores: req.body
            //     });
            // }

        try {
            
            let create = await usuarioModel.create(dados);
            return res.render("pages/cadastro-usuario", {
                erros: null, 
                dadosNotificacao: {
                    titulo: "Cadastro realizado!", 
                    mensagem: "Novo usuário criado com sucesso!", 
                    tipo: "success"
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
    }

}

module.exports = usuarioController;