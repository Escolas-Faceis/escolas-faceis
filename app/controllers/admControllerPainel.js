const admModel = require("../models/admModel");

const admControllerPainel = {
    listarEscolas: async (req, res, next) => {
        try {
            const escolas = await admModel.findAllSchools();
            res.locals.escolas = escolas || [];
        } catch (error) {
            console.log('ERRO AO LISTAR ESCOLAS:', error);
            res.locals.escolas = [];
        }
        next();
    },

    listarUsuarios: async (req, res, next) => {
        try {
            const usuarios = await admModel.findAll();
            res.locals.usuarios = usuarios || [];
        } catch (error) {
            res.locals.usuarios = [];
        }
        next();
    },
}

module.exports = admControllerPainel;