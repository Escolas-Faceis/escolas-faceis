const avalModel = require("../models/avalModel");
const escolaModel = require("../models/escolaModel");
const loginModel = require("../models/loginModel");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");
const https = require("https");
const moment = require("moment");

const avalController = {

    regrasValidacaoAval: [
            body("comentario").notEmpty().withMessage("O campo de comentário não pode estar vazio."),
            body("comentario").isLength({ min: 1, max: 352 }).withMessage("Número máximo de caracteres para comentário atingido!"),
            body("nota").isInt({ min: 1, max: 5 }).withMessage("A avaliação deve ser um número entre 1 e 5."),

    ],
    
    criarAvaliacao: async (req, res) => {
        req.body.comentario = req.body.ratetext;
        req.body.nota = req.body.rating;

        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.redirect('/perfil-escola?id=' + req.body.id_usuario + '&error=Campos obrigatórios não preenchidos');
        }
        if (!req.session.autenticado || !req.session.autenticado.id) {
            return res.redirect('/perfil-escola?id=' + req.body.id_usuario + '&error=User not authenticated');
        }
        if (req.session.autenticado.tipo === 'E' && req.session.autenticado.id == req.body.id_usuario) {
            return res.redirect('/perfil-escola?id=' + req.body.id_usuario + '&error=Você não pode avaliar sua própria escola');
        }
        const dadosAvaliacao = {
            id_usuario: req.session.autenticado.id,
            id_escola: req.body.id_escola,
            nota: req.body.nota,
            comentario: req.body.comentario
        };
        console.log("Dados da avaliação recebidos:", dadosAvaliacao);

        try {
            console.log("Tentando criar avaliação no banco de dados...");
            const result = await avalModel.create(dadosAvaliacao);
            console.log("Nova avaliação criada com sucesso: ", result);

            res.redirect('/perfil-escola?id=' + req.body.id_escola);

        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            let errorMessage = "Erro no banco de dados. Tente novamente.";

            if (error.code === 'ER_DATA_TOO_LONG') {
                errorMessage = "Dados muito longos para um dos campos. Verifique o tamanho dos dados inseridos.";
            } else if (error.code === 'ER_DUP_ENTRY') {
                errorMessage = "Você já avaliou esta escola.";
            }

            res.redirect('/perfil-escola?id=' + req.body.id_escola + '&error=' + encodeURIComponent(errorMessage));
        }

    },

    listarAvaliacoesPorUsuario: async (req, res) => {
        try {
            const dados = {
                id_usuario: req.session.autenticado.id};

            const avaliacoes = await avalModel.findAllAval(dados);
            res.json(avaliacoes);
            return res.redirect('/perfil-usuario?id=' + req.body.id_usuario);
        } catch (error) {
            console.error("Erro ao listar avaliações:", error);
            res.status(500).json({ error: "Erro ao listar avaliações" });
        }
    },
};  

module.exports = avalController;