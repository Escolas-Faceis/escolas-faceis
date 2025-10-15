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

    buscarDadosGraficos: async (req, res, next) => {
        try {
            const totalUsuarios = await admModel.getTotalUsuarios();
            const distribuicaoTipos = await admModel.getDistribuicaoTipos();
            const statusUsuarios = await admModel.getStatusUsuarios();
            const escolasPorRede = await admModel.getEscolasPorRede();
            const denunciasPendentes = await admModel.getDenunciasPendentes();

            res.locals.dadosGraficos = {
                totalUsuarios,
                distribuicaoTipos,
                statusUsuarios,
                escolasPorRede,
                denunciasPendentes
            };
        } catch (error) {
            console.log('ERRO AO BUSCAR DADOS PARA GRÁFICOS:', error);
            res.locals.dadosGraficos = {
                totalUsuarios: 0,
                distribuicaoTipos: [],
                statusUsuarios: [],
                escolasPorRede: [],
                denunciasPendentes: 0
            };
        }
        next();
    },

    listarEscolasPremium: async (req, res, next) => {
        try {
            const escolasPremium = await admModel.findAllPremiumSchools();
            console.log('Escolas Premium encontradas:', escolasPremium);
            res.locals.escolasPremium = escolasPremium || [];
        } catch (error) {
            console.log('ERRO AO LISTAR ESCOLAS PREMIUM:', error);
            res.locals.escolasPremium = [];
        }
        next();
    },

    listarEscolasPremiumPaginadas: async (req, res) => {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let regPagina = 10;
            let inicio = (pagina - 1) * regPagina;
            let totalReg = await admModel.totalPremiumSchools();
            let totPaginas = Math.ceil(totalReg[0].total / regPagina);
            let results = await admModel.findPremiumSchoolsPage(inicio, regPagina);
            let paginador = totalReg[0].total <= regPagina ? null : { "paginaAtual": pagina, "totalReg": totalReg[0].total, "totPaginas": totPaginas };
            res.render('pages/adm/premium', { escolasPremium: results, paginador: paginador });
        } catch (error) {
            console.log('ERRO AO LISTAR ESCOLAS PREMIUM PAGINADAS:', error);
            res.render('pages/adm/premium', { escolasPremium: [], paginador: null });
        }
    },

    listarUsuariosComuns: async (req, res, next) => {
        try {
            const usuariosComuns = await admModel.findAllComuns();
            res.locals.usuariosComuns = usuariosComuns || [];
        } catch (error) {
            console.log('ERRO AO LISTAR USUÁRIOS COMUNS:', error);
            res.locals.usuariosComuns = [];
        }
        next();
    },

    listarUsuariosAdms: async (req, res, next) => {
        try {
            const usuariosAdms = await admModel.findAllAdms();
            res.locals.usuariosAdms = usuariosAdms || [];
        } catch (error) {
            console.log('ERRO AO LISTAR USUÁRIOS ADMINISTRADORES:', error);
            res.locals.usuariosAdms = [];
        }
        next();
    },
}

module.exports = admControllerPainel;
