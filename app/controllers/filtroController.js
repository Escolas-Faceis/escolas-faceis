const filtroModel = require("../models/filtroModel");
const axios = require("axios");
const moment = require("moment");

const filtroController = {
    paginarEscolas: async (req, res, next) => {
        res.locals.moment = moment;
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let regPagina = 5;
            let inicio = (pagina - 1) * regPagina;


            const searchParams = {
                nome: req.query.nome || req.query['nome-escola-search'] || '',
                cidade: req.query.cidade || req.query['cidade-search'] || '',
                regiao: req.query.regiao || req.query['regiao-search'] || '',
                niveis: req.query.niveis ? (Array.isArray(req.query.niveis) ? req.query.niveis : [req.query.niveis]) : [],
                redes: req.query.redes ? (Array.isArray(req.query.redes) ? req.query.redes : [req.query.redes]) : [],
                turnos: req.query.turnos ? (Array.isArray(req.query.turnos) ? req.query.turnos : [req.query.turnos]) : [],
                acessibilidade: req.query.acessibilidade ? (Array.isArray(req.query.acessibilidade) ? req.query.acessibilidade : [req.query.acessibilidade]) : []
            };

            const hasFilters = Object.values(searchParams).some(value => {
                if (Array.isArray(value)) return value.length > 0;
                return value && value.trim && value.trim() !== '' && value !== 'regiao';
            });

            let results, totalReg, totPaginas, paginador;

            if (hasFilters) {

                results = await filtroModel.searchAndFilterSchools(searchParams, inicio, regPagina);
                const countResult = await filtroModel.countFilteredSchools(searchParams);
                totalReg = countResult[0] ? countResult[0].total : 0;
            } else {

                results = await filtroModel.findPage(inicio, regPagina);
                const countResult = await filtroModel.totalReg();
                totalReg = countResult[0] ? countResult[0].total : 0;
            }

            totPaginas = Math.ceil(totalReg / regPagina);
            paginador = totalReg <= regPagina ? null : { "paginaAtual": pagina, "totalReg": totalReg, "totPaginas": totPaginas };


            res.render('pages/encontre-escolas', {
                escolas: results,
                paginador: paginador,
                searchParams: searchParams,
                hasFilters: hasFilters
            });
        } catch (error) {
            console.log(error);
            res.render('pages/encontre-escolas', {
                escolas: [],
                paginador: null,
                searchParams: {},
                hasFilters: false
            });
        }
    }
};

module.exports = filtroController;
