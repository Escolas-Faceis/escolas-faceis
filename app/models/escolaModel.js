var pool = require("../../config/pool_conexoes");

const escolaModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM usuarios WHERE status_usuario = 1 AND tipo_usuario = "Escola"');
            return linhas;
        } catch (error) {
            return error;
        }
    },

    create: async (dados) => {
        const conn = await pool.getConnection(); // se estiver usando pool do mysql2/promise
        try {
            await conn.beginTransaction();

            // 1. Cria o usuário
            const [usuarioResult] = await conn.query(
                `INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario, tipo_usuario, status_usuario) VALUES (?, ?, ?, "Escola", 1);`,
                [dados.name_school, dados.email, dados.password]
            );
            const id_usuario = usuarioResult.insertId;

            // 2. Cria a escola, usando o id_usuario
            await conn.query(
                `INSERT INTO escolas (cep, numero, cnpj, tipo_ensino, rede, id_usuario) VALUES (?, ?, ?, "Escola", 1, ?);`,
                [dados.cep, dados.numero, dados.cnpj, id_usuario]
            );
            
            await conn.commit();
            return id_usuario;
        } catch (erro) {
            await conn.rollback();
            console.log(erro);
            return false;
        } finally {
            conn.release();
        }
    }
}

module.exports = escolaModel;