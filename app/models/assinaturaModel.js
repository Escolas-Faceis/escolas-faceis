const pool = require("../../config/pool_conexoes");

const assinaturaModel = {
    // Criar uma nova assinatura
    create: async (dados) => {
        try {
            const [result] = await pool.query(
                `INSERT INTO assinatura (id_escola, id_plano, data_inicio, data_fim, ativo) VALUES (?, ?, ?, ?, ?)`,
                [dados.id_escola, dados.id_plano, dados.data_inicio, dados.data_fim, dados.ativo]
            );
            return result.insertId;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    // Verificar se uma escola tem assinatura ativa (premium)
    isPremium: async (id_escola) => {
        try {
            const [linhas] = await pool.query(
                `SELECT COUNT(*) as total FROM assinatura WHERE id_escola = ? AND ativo = TRUE AND (data_fim IS NULL OR data_fim >= CURDATE())`,
                [id_escola]
            );
            return linhas[0].total > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    // Buscar assinatura ativa de uma escola
    findActiveBySchool: async (id_escola) => {
        try {
            const [linhas] = await pool.query(
                `SELECT a.*, p.nome_plano, p.preco_plano, p.duracao_plano
                 FROM assinatura a
                 JOIN plano p ON a.id_plano = p.id_plano
                 WHERE a.id_escola = ? AND a.ativo = TRUE AND (a.data_fim IS NULL OR a.data_fim >= CURDATE())
                 ORDER BY a.data_inicio DESC LIMIT 1`,
                [id_escola]
            );
            return linhas.length > 0 ? linhas[0] : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // Cancelar assinatura
    cancel: async (id_escola) => {
        try {
            const [result] = await pool.query(
                `UPDATE assinatura SET ativo = FALSE, data_fim = CURDATE() WHERE id_escola = ? AND ativo = TRUE`,
                [id_escola]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    // Atualizar assinatura
    update: async (id_assinatura, dados) => {
        try {
            let setParts = [];
            let values = [];
            for (let key in dados) {
                if (dados[key] !== undefined) {
                    setParts.push(`${key} = ?`);
                    values.push(dados[key]);
                }
            }
            if (setParts.length === 0) {
                return { affectedRows: 0, changedRows: 0 };
            }
            const query = `UPDATE assinatura SET ${setParts.join(', ')} WHERE id_assinatura = ?`;
            values.push(id_assinatura);
            const [result] = await pool.query(query, values);
            return result;
        } catch (error) {
            console.error("Erro ao atualizar assinatura:", error);
            return error;
        }
    },

    // Buscar todos os planos disponíveis
    getPlanos: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM plano ORDER BY preco_plano ASC');
            return linhas;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    // Buscar plano por ID
    getPlanoById: async (id_plano) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM plano WHERE id_plano = ?', [id_plano]);
            return linhas.length > 0 ? linhas[0] : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};

module.exports = assinaturaModel;
