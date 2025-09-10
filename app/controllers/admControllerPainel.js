const admModel = require("../models/admModel");

const admControllerPainel = {
    listarEscolas: async (req, res, next) => {
        try {
            const escolas = await admModel.findAllSchools();
            res.locals.escolas = escolas || [];
        } catch (error) {
            res.locals.escolas = [];
        }
        next();
    },

    listarUsuarios: async (req, res, next) => {
        try {
            const usuarios = await admModel.findAllUsers();
            console.log('USUÁRIOS:', usuarios); // Veja o que retorna!
            res.locals.usuarios = usuarios || [];
        } catch (error) {
            res.locals.usuarios = [];
        }
        next();
    },
}

module.exports = admControllerPainel;