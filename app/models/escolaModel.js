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

    findAllSorted: async () => {
        try {
            const [linhas] = await pool.query(`
                SELECT e.*, u.nome_usuario, u.email_usuario,
                       COALESCE(AVG(a.nota), 0) AS media_avaliacao
                FROM escolas e
                JOIN usuarios u ON e.id_usuario = u.id_usuario
                LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                WHERE u.status_usuario = 1 AND u.tipo_usuario = "Escola"
                GROUP BY e.id_escola, u.id_usuario
                ORDER BY media_avaliacao DESC, e.nome_escola ASC
            `);
            return linhas;
        } catch (error) {
            console.log(error);
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
                `INSERT INTO escolas (id_usuario, nome_escola, endereco, numero, cep, cnpj, tipo_ensino, turnos, rede, email_escola, senha_escola) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [id_usuario, dados.nome_escola, dados.endereco, dados.numero, dados.cep, dados.cnpj, dados.tipo_ensino_str, dados.turnos_str, dados.redes_str, dados.email_escola, dados.senha_escola]
            );
            
            await conn.commit();
            return id_usuario;
        } catch (erro) {
            await conn.rollback();
            console.log(erro);
            let errorInfo = { success: false, error: erro.message, code: erro.code };
            if (erro.code === 'ER_DUP_ENTRY') {
                if (erro.message.includes('email_usuario')) {
                    errorInfo.field = 'email_usuario';
                    errorInfo.userMessage = 'Este email já está cadastrado no sistema.';
                } else if (erro.message.includes('cnpj')) {
                    errorInfo.field = 'cnpj';
                    errorInfo.userMessage = 'Este CNPJ já está cadastrado no sistema.';
                } else if (erro.message.includes('email_escola')) {
                    errorInfo.field = 'email_escola';
                    errorInfo.userMessage = 'Este email da escola já está cadastrado no sistema.';
                }
            }

            return errorInfo;
        } finally {
            conn.release();
        }
    },

        findPage: async (pagina, total) => {
            try {
                const [linhas] = await pool.query(`
                    SELECT e.*, u.nome_usuario, u.email_usuario,
                           COALESCE(AVG(a.nota), 0) AS media_avaliacao
                    FROM escolas e
                    JOIN usuarios u ON e.id_usuario = u.id_usuario
                    LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                    WHERE u.status_usuario = 1 AND u.tipo_usuario = "Escola"
                    GROUP BY e.id_escola, u.id_usuario
                    ORDER BY media_avaliacao DESC, e.nome_escola ASC
                    LIMIT ?, ?
                `, [pagina, total]);
                return linhas;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    
        totalReg: async () => {
            try {
                const [linhas] = await pool.query(
                    "SELECT count(*) total FROM escolas"
                )
                return linhas;
            } catch (error) {
                console.log(error);
                return error;
            }},
}

module.exports = escolaModel;