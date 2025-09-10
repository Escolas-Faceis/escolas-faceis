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
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();


            const [usuarioResult] = await conn.query(
                `INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario, tipo_usuario, status_usuario) VALUES (?, ?, ?, "Escola", 1);`,
                [dados.name_school, dados.email, dados.password]
            );
            const id_usuario = usuarioResult.insertId;


            await conn.query(
                `INSERT INTO escolas (id_usuario, nome_escola, endereco, numero, cidade, estado, cep, cnpj, tipo_ensino, turnos, rede, email_escola, senha_escola) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [id_usuario, dados.nome_escola, dados.endereco, dados.numero, dados.cidade, dados.estado, dados.cep, dados.cnpj, dados.tipo_ensino_str, dados.turnos_str, dados.redes_str, dados.email_escola, dados.senha_escola]
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