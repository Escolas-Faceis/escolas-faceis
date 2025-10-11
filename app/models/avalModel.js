const pool = require("../../config/pool_conexoes");

const avalModel = {
    create: async (dados) => {
        try {
            const [result] = await pool.query(
                "INSERT INTO avaliacoes (id_usuario, id_escola, nota, comentario, data_avaliacao) VALUES (?, ?, ?, ?, NOW())",
                [dados.id_usuario, dados.id_escola, dados.nota, dados.comentario]
            );
            return { id: result.insertId, ...dados };
        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            throw error;
        }
    },
    findAllAval: async (dados) => {
        try {
            const [results] = await pool.query("SELECT * FROM avaliacoes WHERE id_usuario = ?")
            [dados.id_usuario];
            return results;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    findBySchool: async (id_escola) => {
        try {
            const [results] = await pool.query(`
                SELECT a.*, u.nome_usuario, i.caminho_imagem as img_perfil_pasta, NULL as img_perfil_banco
                FROM avaliacoes a
                LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
                LEFT JOIN imagens i ON u.img_perfil_id = i.id_imagem
                WHERE a.id_escola = ?
                ORDER BY a.data_avaliacao DESC
            `, [id_escola]);
            return results;
        } catch (error) {
            console.error("Erro ao buscar avaliações da escola:", error);
            return [];
        }
    },

    getAverage: async (id_escola) => {
        try {
            const [results] = await pool.query(
                "SELECT AVG(nota) as media, COUNT(*) as total FROM avaliacoes WHERE id_escola = ?",
                [id_escola]
            );
            return results[0];
        } catch (error) {
            console.error("Erro ao calcular média:", error);
            return { media: 0, total: 0 };
        }
    },

    findById: async (id) => {
        try {
            const [results] = await pool.query(`
                SELECT a.*, u.nome_usuario, i.caminho_imagem as img_perfil_pasta, NULL as img_perfil_banco
                FROM avaliacoes a
                LEFT JOIN usuario u ON a.id_usuario = u.id_usuario
                LEFT JOIN imagens i ON u.img_perfil_id = i.id_imagem
                WHERE a.id_avaliacao = ?
            `, [id]);
            return results[0];
        } catch (error) {
            console.error("Erro ao buscar avaliação por id:", error);
            return null;
        }
    }


}

module.exports = avalModel;
