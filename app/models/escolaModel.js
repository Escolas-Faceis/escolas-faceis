var pool = require("../../config/pool_conexoes");

const escolaModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM usuarios WHERE status_usuario = 1 AND tipo_usuario = "Escola"' )
            return linhas;
        } catch (error) {
            return error;
        }
    },
}

module.exports = escolaModel;