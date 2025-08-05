const admModel = require("../models/admModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarTelefone } = require("../helpers/validacoes");

const admControllerPainel = {

    listarEscolas: async (req, res) => {
        try {
            const escolas = await admModel.findAllSchools();
            res.render('pages/adm/adm-list-escolas', { escolas: escolas || [] });
        } catch (error) {
            res.render('pages/adm/adm-list-escolas', { escolas: [] });
        }
    },

        listarUsuarios: async (req, res) => {
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

}

module.exports = admControllerPainel;