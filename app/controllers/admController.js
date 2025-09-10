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

    listarUsuarios: async (req, res, next) => {
        try {
            const usuarios = await admModel.findAll();
            
            req.usuarios = usuarios;
            next();
        } catch (error) {
            req.usuarios = [];
            next();
        }
    },

    listarEscolas: async (req, res) => {
        try {
            const escolas = await admModel.findAllSchools();
            res.render('pages/adm/adm-list', {
                usuarios: req.usuarios || [],
                escolas: escolas || []
            });
        } catch (error) {
            res.render('pages/adm/adm-list', {
                usuarios: req.usuarios || [],
                escolas: []
            });
        }
    },

    listarUsuariosPaginados: async (req, res, next) => {
        res.locals.moment = moment;
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let results = null;
            let regPagina = 10;
            let inicio = (pagina - 1) * regPagina;
            let totalReg = await admModel.totalReg();
            let totPaginas = Math.ceil(totalReg[0].total / regPagina);
            results = await admModel.findPage(inicio, regPagina);
            let paginador = totalReg[0].total <= regPagina ? null : { "paginaAtual": pagina, "totalReg": totalReg[0].total, "totPaginas": totPaginas };
            res.render('pages/adm/index-adm', { usuarios: results, paginador: paginador });
        } catch (error) {
            console.log(error);
            res.render('pages/adm/index-adm', { usuarios: [], paginador: null });
        }
    },

    

}

module.exports = admController;