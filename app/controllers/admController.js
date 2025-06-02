const admModel = require("../models/admModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarTelefone } = require("../helpers/validacoes");

const admController = {

    cadastrarUsuario: async (req, res) => {
        try {
            let erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.render('pages/cadastro-usuario', { 
                    erros, 
                    valores: req.body 
                });
            }
            const dados = {
                name: req.body.name,
                email: req.body.email,
                cellphone: req.body.cellphone,
                password: req.body.password
            };
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
                valores: req.body
            });
        }
    },

    listarUsuarios: async (req, res) => {
        try {
            const usuarios = await admModel.findAll();
            console.log("USUÁRIOS DO BANCO:", usuarios);
            res.render('pages/adm/index-adm', { usuarios });
        } catch (error) {
            console.log(error);
            res.render('pages/adm/index-adm', { usuarios: [] });
        }
    },

}

module.exports = admController;