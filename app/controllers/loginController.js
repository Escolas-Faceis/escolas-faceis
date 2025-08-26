const loginModel = require("../models/loginModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const loginController = {

        regrasValidacaoLogin: [
        body("email")
            .isEmail()
            .withMessage("Email inválido."),
        body("password")
            .notEmpty()
            .withMessage("Senha é obrigatória.")

    ],
    login: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("pages/login", { "erros": errors, dadosNotificacao: null, "valores": req.body, "retorno": null });
        }
        
        return res.render("pages/login", { "erros": null, dadosNotificacao: null, "valores": req.body, "retorno": req.body });
    },
    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/login", { erros: erros, dadosNotificacao: null, "valores": req.body, "retorno": null })
        }
        
        // Check if authentication was successful (gravarUsuAutenticado middleware sets this)
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




}

module.exports = loginController;