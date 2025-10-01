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
            }
        },

        findId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT e.*, u.nome_usuario, u.email_usuario, u.tipo_usuario, u.img_perfil_id, i.caminho_imagem as img_perfil_pasta, " +
                    "u.img_perfil_banco as img_perfil_banco " +
                    "FROM escolas e " +
                    "JOIN usuarios u ON e.id_usuario = u.id_usuario " +
                    "LEFT JOIN imagens i ON u.img_perfil_id = i.id_imagem " +
                    "WHERE e.id_usuario = ? AND u.status_usuario = 1", [id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },




    update: async (dados, id_usuario) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Update usuarios table
            await conn.query(
                `UPDATE usuarios SET nome_usuario = ?, email_usuario = ?, senha_usuario = ?, img_perfil_id = ? WHERE id_usuario = ?`,
                [dados.email_usuario, dados.email_usuario, dados.senha_usuario, dados.img_perfil_id, id_usuario]
            );

            // Update escolas table
            await conn.query(
                `UPDATE escolas SET nome_escola = ?, endereco = ?, numero = ?, cep = ?, cidade = ?, sobre_escola = ?, sobre_ensino = ?, sobre_estrutura = ?, tipo_ensino = ?, turnos = ?, rede = ?, instagram = ?, facebook = ?, whatsapp = ?, telefone_contato = ?, email_contato = ? WHERE id_usuario = ?`,
                [dados.nome_escola, dados.endereco, dados.numero, dados.cep, dados.cidade, dados.sobre_escola, dados.sobre_ensino, dados.sobre_estrutura, dados.tipo_ensino, dados.turnos, dados.rede, dados.instagram, dados.facebook, dados.whatsapp, dados.telefone_contato, dados.email_contato, id_usuario]
            );

            await conn.commit();
            return { affectedRows: 1, changedRows: 1 };
        } catch (error) {
            await conn.rollback();
            console.log(error);
            return { affectedRows: 0, changedRows: 0 };
        } finally {
            conn.release();
        }
    },

    insertImage: async (nomeImagem, caminho) => {
        try {
            const [result] = await pool.query(
                `INSERT INTO imagens (nome_imagem, caminho_imagem) VALUES (?, ?)`,
                [nomeImagem, caminho]
            );
            return result.insertId;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = escolaModel;
