const avalModel = require("../models/avalModel");
const escolaModel = require("../models/escolaModel");
const loginModel = require("../models/loginModel");
const notificacaoModel = require("../models/notificacaoModel");
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
        req.body.comentario = req.body.ratetext || req.body.comentario || '';
        req.body.nota = req.body.rating || req.body.nota || 0;

        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
            if (isAjax) {
                return res.json({ success: false, message: "Verifique os valores digitados!" });
            }
            req.session.dadosNotificacao = {
                titulo: "Erro ao avaliar!",
                mensagem: "Verifique os valores digitados!",
                tipo: "error"
            };
            return res.redirect('/perfil-escola?id=' + req.body.id_usuario_escola);
        }
        if (!req.session.autenticado || !req.session.autenticado.id) {
            const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
            if (isAjax) {
                return res.json({ success: false, message: "Usuário não autenticado." });
            }
            req.session.dadosNotificacao = {
                titulo: "Erro ao avaliar!",
                mensagem: "Usuário não autenticado.",
                tipo: "error"
            };
            return res.redirect('/perfil-escola?id=' + req.body.id_usuario_escola);
        }
        if (req.session.autenticado.tipo === 'E' && req.session.autenticado.id == req.body.id_usuario_escola) {
            const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
            if (isAjax) {
                return res.json({ success: false, message: "Você não pode avaliar sua própria escola." });
            }
            req.session.dadosNotificacao = {
                titulo: "Erro ao avaliar!",
                mensagem: "Você não pode avaliar sua própria escola.",
                tipo: "error"
            };
            return res.redirect('/perfil-escola?id=' + req.body.id_usuario_escola);
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

            try {
                await notificacaoModel.create({
                    id_usuario_destinatario: req.body.id_usuario_escola,
                    tipo_notificacao: 'avaliacao',
                    mensagem: `Sua escola recebeu uma nova avaliação de ${req.session.autenticado.autenticado || 'um usuário'}.`
                });
                console.log("Notificação criada com sucesso.");
            } catch (notifError) {
                console.error("Erro ao criar notificação:", notifError);
            }

            const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
            if (isAjax) {
                const newAverage = await avalModel.getAverage(req.body.id_escola);
                newAverage.media = parseFloat(newAverage.media).toFixed(1);
                newAverage.totalAvaliacoes = newAverage.total;
                const newAval = await avalModel.findById(result.id);
                newAval.data_formatada = moment(newAval.data_avaliacao).fromNow();
                return res.json({ success: true, mediaAvaliacao: newAverage, newAval: newAval });
            }

            req.session.dadosNotificacao = {
                titulo: "Avaliação realizada!",
                mensagem: "Sua avaliação foi criada com sucesso!",
                tipo: "success",
            };
            res.redirect('/perfil-escola?id=' + req.body.id_usuario_escola);

        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            let errorMessage = "Erro no banco de dados. Tente novamente.";

            if (error.code === 'ER_DATA_TOO_LONG') {
                errorMessage = "Dados muito longos para um dos campos. Verifique o tamanho dos dados inseridos.";
            } else if (error.code === 'ER_DUP_ENTRY') {
                errorMessage = "Você já avaliou esta escola.";
            }

            const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
            if (isAjax) {
                return res.json({ success: false, message: errorMessage });
            }

            req.session.dadosNotificacao = {
                titulo: "Erro ao avaliar!",
                mensagem: errorMessage,
                tipo: "error"
            };
            res.redirect('/perfil-escola?id=' + req.body.id_escola);
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

    getAvaliacoesPorEscola: async (id_escola) => {
        try {
            const avaliacoes = await avalModel.findBySchool(id_escola);
            return avaliacoes;
        } catch (error) {
            console.error("Erro ao buscar avaliações da escola:", error);
            return [];
        }
    },

    getNotificacoes: async (req, res) => {
        try {
            if (!req.session.autenticado) {
                return res.json([]);
            }
            const notificacoes = await notificacaoModel.getByUser(req.session.autenticado.id);
            res.json(notificacoes);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
            res.status(500).json({ error: "Erro ao buscar notificações" });
        }
    },

    marcarTodasLidas: async (req, res) => {
        try {
            const count = await notificacaoModel.markAllAsRead(req.session.autenticado.id);
            res.json({ success: true, count });
        } catch (error) {
            console.error("Erro ao marcar todas as notificações como lidas:", error);
            res.status(500).json({ success: false });
        }
    },

        excluirAvaliacao: async (req, res) => {
        const id_avaliacao = req.body.id_avaliacao || req.query.id_avaliacao;
        const id_usuario = req.session.autenticado.id;

        if (!id_usuario) {
            req.session.dadosNotificacao = {
                titulo: "Erro ao excluir!",
                mensagem: "Usuário não autenticado.",
                tipo: "error"
            };
            return res.redirect(req.get('Referer') || '/');
        }

        try {
            const deleted = await avalModel.delete(id_avaliacao, id_usuario);
            if (deleted) {
                const aval = await avalModel.findById(id_avaliacao);
                if (aval) {
                    const newAverage = await avalModel.getAverage(aval.id_escola);
                    newAverage.media = parseFloat(newAverage.media).toFixed(1);
                    newAverage.totalAvaliacoes = newAverage.total;
                }
                req.session.dadosNotificacao = {
                    titulo: "Avaliação excluída!",
                    mensagem: "Sua avaliação foi excluída com sucesso.",
                    tipo: "success"
                };
                const referer = req.get('Referer');
                if (referer && referer.includes('/perfil-escola')) {
                    return res.redirect(referer);
                } else {
                    return res.redirect('/perfil1');
                }
            } else {
                req.session.dadosNotificacao = {
                    titulo: "Erro ao excluir!",
                    mensagem: "Avaliação não encontrada ou você não tem permissão para excluí-la.",
                    tipo: "error"
                };
                const referer = req.get('Referer');
                if (referer && referer.includes('/perfil-escola')) {
                    return res.redirect(referer);
                } else {
                    return res.redirect('/perfil1');
                }
            }
        } catch (error) {
            console.error("Erro ao excluir avaliação:", error);
            req.session.dadosNotificacao = {
                titulo: "Erro ao excluir!",
                mensagem: "Erro no servidor.",
                tipo: "error"
            };
            const referer = req.get('Referer');
            if (referer && referer.includes('/perfil-escola')) {
                return res.redirect(referer);
            } else {
                return res.redirect('/perfil1');
            }
        }
    },

            listarAvaliacoesPorEscola: async (req, res) => {
        try {
            const id_escola = req.params.id;
            console.log("Buscando avaliações para a escola ID:", id_escola);
            if (!id_escola) {
                console.log("ID da escola não fornecido");
                return res.status(400).json({ error: "ID da escola é obrigatório" });
            }
            const avaliacoes = await avalModel.findBySchool(id_escola);
            console.log(`Encontradas ${avaliacoes.length} avaliações para a escola ID ${id_escola}`);
            if (avaliacoes.length > 0) {
                console.log("Detalhes das avaliações:", avaliacoes.map(aval => ({
                    id_avaliacao: aval.id_avaliacao,
                    id_usuario: aval.id_usuario,
                    nome_usuario: aval.nome_usuario,
                    nota: aval.nota,
                    comentario: aval.comentario,
                    data_avaliacao: aval.data_avaliacao
                })));
            }
            res.json(avaliacoes);
        } catch (error) {
            console.error("Erro ao listar avaliações por escola:", error);
            res.status(500).json({ error: "Erro ao listar avaliações" });
        }
    },

    




};

module.exports = avalController;