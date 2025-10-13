const assinaturaModel = require("../models/assinaturaModel");
const escolaModel = require("../models/escolaModel");

const assinaturaController = {
    // Mostrar página de planos
    mostrarPlanos: async (req, res) => {
        try {
            const planos = await assinaturaModel.getPlanos();
            res.render("pages/assinatura", {
                planos: planos,
                erros: null,
                dadosNotificacao: null
            });
        } catch (error) {
            console.log(error);
            res.render("pages/assinatura", {
                planos: [],
                erros: { errors: [{ msg: "Erro ao carregar planos." }] },
                dadosNotificacao: null
            });
        }
    },

    // Assinar um plano
    assinarPlano: async (req, res) => {
        try {
            const { id_plano } = req.body;
            const id_escola = req.session.autenticado.id;

            // Verificar se a escola já tem assinatura ativa
            const isPremium = await assinaturaModel.isPremium(id_escola);
            if (isPremium) {
                return res.redirect("/perfil-escola?error=Você já possui uma assinatura ativa");
            }

            // Buscar informações do plano
            const plano = await assinaturaModel.getPlanoById(id_plano);
            if (!plano) {
                return res.redirect("/planos?error=Plano não encontrado");
            }

            // Calcular data de fim baseada na duração
            let data_fim = null;
            if (plano.duracao_plano === 'M') {
                // Assinatura mensal (30 dias)
                const dataInicio = new Date();
                data_fim = new Date(dataInicio.getTime() + 30 * 24 * 60 * 60 * 1000);
            } else if (plano.duracao_plano === 'A') {
                // Assinatura anual
                const dataInicio = new Date();
                data_fim = new Date(dataInicio.getFullYear() + 1, dataInicio.getMonth(), dataInicio.getDate());
            }

            // Criar assinatura
            const dadosAssinatura = {
                id_escola: id_escola,
                id_plano: id_plano,
                data_inicio: new Date(),
                data_fim: data_fim,
                ativo: true
            };

            const result = await assinaturaModel.create(dadosAssinatura);
            if (result) {
                res.redirect("/perfil-escola?success=Assinatura realizada com sucesso!");
            } else {
                res.redirect("/planos?error=Erro ao processar assinatura");
            }
        } catch (error) {
            console.log(error);
            res.redirect("/planos?error=Erro interno do servidor");
        }
    },

    // Cancelar assinatura
    cancelarAssinatura: async (req, res) => {
        try {
            const id_escola = req.session.autenticado.id;

            const result = await assinaturaModel.cancel(id_escola);
            if (result) {
                res.redirect("/perfil-escola?success=Assinatura cancelada com sucesso");
            } else {
                res.redirect("/perfil-escola?error=Erro ao cancelar assinatura");
            }
        } catch (error) {
            console.log(error);
            res.redirect("/perfil-escola?error=Erro interno do servidor");
        }
    },

    // Verificar status premium (middleware helper)
    verificarPremium: async (req, res, next) => {
        try {
            const id_escola = req.params.id || req.session.autenticado.id;
            const isPremium = await assinaturaModel.isPremium(id_escola);
            req.isPremium = isPremium;
            next();
        } catch (error) {
            console.log(error);
            req.isPremium = false;
            next();
        }
    },

    // API endpoint para verificar status premium
    getStatusPremium: async (req, res) => {
        try {
            const id_escola = req.params.id;
            const isPremium = await assinaturaModel.isPremium(id_escola);
            const assinatura = await assinaturaModel.findActiveBySchool(id_escola);

            res.json({
                success: true,
                isPremium: isPremium,
                assinatura: assinatura
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Erro ao verificar status premium"
            });
        }
    }
};

module.exports = assinaturaController;
