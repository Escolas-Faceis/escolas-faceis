const loginModel = require("../models/loginModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const loginController = {

        regrasValidacaoLogin: [
        body("email")
            .isEmail()
            .withMessage("Email inválido."),
        body("password")
            .isStrongPassword()
            .withMessage("Senha muito fraca!")
    ],

    login: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("pages/login", { "erros": errors, "valores": req.body, "retorno": null });
        }
        return res.render("pages/perfil-usuario", { "erros": null, "valores": req.body, "retorno": req.body });
    },

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/login", { listaErros: erros, dadosNotificacao: null })
        }
        if (req.session.autenticado.autenticado != null) {
            res.redirect("/");
        } else {
            res.render("pages/login", {
                listaErros: null,
                dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" }
            })
        }
    },




}

module.exports = loginController;