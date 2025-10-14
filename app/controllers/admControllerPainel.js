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

    // Método para buscar dados agregados para gráficos
    buscarDadosGraficos: async (req, res, next) => {
        try {
            const totalUsuarios = await admModel.getTotalUsuarios();
            const distribuicaoTipos = await admModel.getDistribuicaoTipos();
            const statusUsuarios = await admModel.getStatusUsuarios();
            const escolasPorRede = await admModel.getEscolasPorRede();
            const usuariosOnline = await admModel.getUsuariosOnline();
            const denunciasPendentes = await admModel.getDenunciasPendentes();

            res.locals.dadosGraficos = {
                totalUsuarios,
                distribuicaoTipos,
                statusUsuarios,
                escolasPorRede,
                usuariosOnline,
                denunciasPendentes
            };
        } catch (error) {
            console.log('ERRO AO BUSCAR DADOS PARA GRÁFICOS:', error);
            res.locals.dadosGraficos = {
                totalUsuarios: 0,
                distribuicaoTipos: [],
                statusUsuarios: [],
                escolasPorRede: [],
                usuariosOnline: 0,
                denunciasPendentes: 0
            };
        }
        next();
    },
}

module.exports = admControllerPainel;
