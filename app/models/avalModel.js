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


}

module.exports = avalModel;
