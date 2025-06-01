const usuarioModel = require("../models/usuarioModel");
const escolaModel = require("../models/usuarioModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarTelefone } = require("../helpers/validacoes");

const usuarioController = {

    regrasValidacaoUsuario: [
        body("name")
            .isLength({ min: 3, max: 50 })
            .withMessage("Nome Inválido"),
        body("email")
            .isEmail()
            .withMessage("Email inválido."),
        body("cellphone")
            .custom(value => {
                if (!validarTelefone(value)) {
                    throw new Error('Telefone inválido');
                }
                return true;
            }),
        body("password")
            .isStrongPassword()
            .withMessage("Senha muito fraca!"),
        body("reppassword")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Senhas estão diferentes"),
        function (req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res.render("pages/cadastro-usuario", { "erros": errors, "valores": req.body, "retorno": null });
            }
            return res.render("pages/perfil-usuario", { "erros": null, "valores": req.body, "retorno": req.body });
        }
    ],

    cadastrarUsuario: async (req, res) => {
        try {
            let listaErros = validationResult(req);
            if (!listaErros.isEmpty()) {
                // erro no formulário
                console.log(listaErros);
                return res.render("pages/cadastro-usuario", {
                    erros: listaErros,
                    valores: req.body
                });
            }
            // não tem erro no formulário
            const dados = {
                name: req.body.name,
                email: req.body.email,
                cellphone: req.body.cellphone,
                password: req.body.password
            };
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
                valores: req.body
            });
        }
    }

}

module.exports = usuarioController;