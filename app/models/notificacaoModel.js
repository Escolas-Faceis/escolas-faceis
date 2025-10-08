const pool = require("../../config/pool_conexoes");

const notificacaoModel = {
    create: async (dados) => {
        try {
            const [result] = await pool.query(
                "INSERT INTO notificacoes (id_usuario_destinatario, tipo_notificacao, mensagem) VALUES (?, ?, ?)",
                [dados.id_usuario_destinatario, dados.tipo_notificacao, dados.mensagem]
            );
            return { id: result.insertId, ...dados };
        } catch (error) {
            console.error("Erro ao criar notificação:", error);
            throw error;
        }
    },

    getByUser: async (id_usuario) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM notificacoes WHERE id_usuario_destinatario = ? ORDER BY data_notificacao DESC",
                [id_usuario]
            );
            return results;
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
            return [];
        }
    },

    markAsRead: async (id_notificacao) => {
        try {
            const [result] = await pool.query(
                "UPDATE notificacoes SET lida = TRUE WHERE id_notificacao = ?",
                [id_notificacao]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
            throw error;
        }
    },

    markAllAsRead: async (id_usuario) => {
        try {
            const [result] = await pool.query(
                "UPDATE notificacoes SET lida = TRUE WHERE id_usuario_destinatario = ? AND lida = FALSE",
                [id_usuario]
            );
            return result.affectedRows;
        } catch (error) {
            console.error("Erro ao marcar todas as notificações como lidas:", error);
            throw error;
        }
    }
};

module.exports = notificacaoModel;
