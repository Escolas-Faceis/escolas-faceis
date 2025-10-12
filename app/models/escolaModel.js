var pool = require("../../config/pool_conexoes");

const escolaModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM usuarios WHERE status_usuario = 1 AND tipo_usuario = "E"');
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findAllSorted: async () => {
        try {
            const [linhas] = await pool.query(`
                SELECT e.*, u.nome_usuario, u.email_usuario,
                       COALESCE(AVG(a.nota), 0) AS media_avaliacao,
                       REPLACE(i.caminho_imagem, 'app/public', '') AS img_perfil_pasta
                FROM escolas e
                JOIN usuarios u ON e.id_usuario = u.id_usuario
                LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                LEFT JOIN imagens i ON e.img_perfil_id = i.id_imagem
                WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
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
                `INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario, tipo_usuario, status_usuario) VALUES (?, ?, ?, "E", 1);`,
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
                           COALESCE(AVG(a.nota), 0) AS media_avaliacao,
                           REPLACE(i.caminho_imagem, 'app/public', '') AS img_perfil_pasta
                    FROM escolas e
                    JOIN usuarios u ON e.id_usuario = u.id_usuario
                    LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                    LEFT JOIN imagens i ON e.img_perfil_id = i.id_imagem
                    WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
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

        searchAndFilterSchools: async (params = {}, pagina = 0, total = 5) => {
            try {
                let whereConditions = [];
                let queryParams = [];

                // Base query with joins
                let query = `
                    SELECT e.*, u.nome_usuario, u.email_usuario,
                           COALESCE(AVG(a.nota), 0) AS media_avaliacao,
                           REPLACE(i.caminho_imagem, 'app/public', '') AS img_perfil_pasta
                    FROM escolas e
                    JOIN usuarios u ON e.id_usuario = u.id_usuario
                    LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                    LEFT JOIN imagens i ON e.img_perfil_id = i.id_imagem
                    WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
                `;

                // Search by school name
                if (params.nome && params.nome.trim()) {
                    whereConditions.push("e.nome_escola LIKE ?");
                    queryParams.push(`%${params.nome.trim()}%`);
                }

                // Filter by city
                if (params.cidade && params.cidade.trim()) {
                    whereConditions.push("e.cidade LIKE ?");
                    queryParams.push(`%${params.cidade.trim()}%`);
                }

                // Filter by region (estado)
                if (params.regiao && params.regiao !== 'regiao') {
                    // Map region codes to actual states
                    const regioes = {
                        'RNO': ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'],
                        'RND': ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
                        'RCE': ['MT', 'MS', 'GO', 'DF'],
                        'RSD': ['MG', 'ES', 'RJ', 'SP'],
                        'RSU': ['PR', 'SC', 'RS']
                    };

                    if (regioes[params.regiao]) {
                        const placeholders = regioes[params.regiao].map(() => '?').join(',');
                        whereConditions.push(`e.estado IN (${placeholders})`);
                        queryParams.push(...regioes[params.regiao]);
                    }
                }

                // Filter by education levels (tipo_ensino)
                if (params.niveis && Array.isArray(params.niveis) && params.niveis.length > 0) {
                    const nivelConditions = params.niveis.map(nivel => "e.tipo_ensino LIKE ?");
                    whereConditions.push(`(${nivelConditions.join(' OR ')})`);
                    params.niveis.forEach(nivel => queryParams.push(`%${nivel}%`));
                }

                // Filter by network types (rede)
                if (params.redes && Array.isArray(params.redes) && params.redes.length > 0) {
                    const redeConditions = params.redes.map(rede => "e.rede LIKE ?");
                    whereConditions.push(`(${redeConditions.join(' OR ')})`);
                    params.redes.forEach(rede => queryParams.push(`%${rede}%`));
                }

                // Filter by shifts (turnos)
                if (params.turnos && Array.isArray(params.turnos) && params.turnos.length > 0) {
                    const turnoConditions = params.turnos.map(turno => "e.turnos LIKE ?");
                    whereConditions.push(`(${turnoConditions.join(' OR ')})`);
                    params.turnos.forEach(turno => queryParams.push(`%${turno}%`));
                }

                // Filter by accessibility
                if (params.acessibilidade && params.acessibilidade === 'true') {
                    whereConditions.push("e.acessibilidade = 1");
                }

                // Filter by EJA
                if (params.eja && params.eja === 'true') {
                    whereConditions.push("e.eja = 1");
                }

                // Filter by bilingual
                if (params.bilingue && params.bilingue === 'true') {
                    whereConditions.push("e.bilingue = 1");
                }

                // Add WHERE clause if conditions exist
                if (whereConditions.length > 0) {
                    query += " AND " + whereConditions.join(" AND ");
                }

                // Group by and order
                query += `
                    GROUP BY e.id_escola, u.id_usuario
                    ORDER BY media_avaliacao DESC, e.nome_escola ASC
                    LIMIT ?, ?
                `;

                queryParams.push(pagina, total);

                const [linhas] = await pool.query(query, queryParams);
                return linhas;
            } catch (error) {
                console.log("Error in searchAndFilterSchools:", error);
                return error;
            }
        },

        countFilteredSchools: async (params = {}) => {
            try {
                let whereConditions = [];
                let queryParams = [];

                let query = `
                    SELECT COUNT(DISTINCT e.id_escola) as total
                    FROM escolas e
                    JOIN usuarios u ON e.id_usuario = u.id_usuario
                    WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
                `;

                // Apply same filters as searchAndFilterSchools
                if (params.nome && params.nome.trim()) {
                    whereConditions.push("e.nome_escola LIKE ?");
                    queryParams.push(`%${params.nome.trim()}%`);
                }

                if (params.cidade && params.cidade.trim()) {
                    whereConditions.push("e.cidade LIKE ?");
                    queryParams.push(`%${params.cidade.trim()}%`);
                }

                if (params.regiao && params.regiao !== 'regiao') {
                    const regioes = {
                        'RNO': ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'],
                        'RND': ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
                        'RCE': ['MT', 'MS', 'GO', 'DF'],
                        'RSD': ['MG', 'ES', 'RJ', 'SP'],
                        'RSU': ['PR', 'SC', 'RS']
                    };

                    if (regioes[params.regiao]) {
                        const placeholders = regioes[params.regiao].map(() => '?').join(',');
                        whereConditions.push(`e.estado IN (${placeholders})`);
                        queryParams.push(...regioes[params.regiao]);
                    }
                }

                if (params.niveis && Array.isArray(params.niveis) && params.niveis.length > 0) {
                    const nivelConditions = params.niveis.map(nivel => "e.tipo_ensino LIKE ?");
                    whereConditions.push(`(${nivelConditions.join(' OR ')})`);
                    params.niveis.forEach(nivel => queryParams.push(`%${nivel}%`));
                }

                if (params.redes && Array.isArray(params.redes) && params.redes.length > 0) {
                    const redeConditions = params.redes.map(rede => "e.rede LIKE ?");
                    whereConditions.push(`(${redeConditions.join(' OR ')})`);
                    params.redes.forEach(rede => queryParams.push(`%${rede}%`));
                }

                if (params.turnos && Array.isArray(params.turnos) && params.turnos.length > 0) {
                    const turnoConditions = params.turnos.map(turno => "e.turnos LIKE ?");
                    whereConditions.push(`(${turnoConditions.join(' OR ')})`);
                    params.turnos.forEach(turno => queryParams.push(`%${turno}%`));
                }

                if (params.acessibilidade && params.acessibilidade === 'true') {
                    whereConditions.push("e.acessibilidade = 1");
                }

                if (params.eja && params.eja === 'true') {
                    whereConditions.push("e.eja = 1");
                }

                if (params.bilingue && params.bilingue === 'true') {
                    whereConditions.push("e.bilingue = 1");
                }

                if (whereConditions.length > 0) {
                    query += " AND " + whereConditions.join(" AND ");
                }

                const [linhas] = await pool.query(query, queryParams);
                return linhas;
            } catch (error) {
                console.log("Error in countFilteredSchools:", error);
                return error;
            }
        },


    update: async (dados, idUsuario) => {
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
                // No fields to update
                return { affectedRows: 0, changedRows: 0 };
            }
            const query = `UPDATE escolas SET ${setParts.join(', ')} WHERE id_usuario = ?`;
            values.push(idUsuario);
            const [result] = await pool.query(query, values);
            return result;
        } catch (error) {
            console.error("Erro ao atualizar escola:", error);
            return error;
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
    },

        insertImage: async (nome, caminho) => {
            try {
                const [resultados] = await pool.query(
                    "INSERT INTO imagens (nome_imagem, caminho_imagem) VALUES (?, ?)",
                    [nome, caminho]
                );
                return resultados.insertId;
            } catch (erro) {
                console.log(erro);
                return false;
            }
        },

    insertCarouselImages: async (idEscola, files) => {
        try {
            // First, delete existing carousel images for the school
            await pool.query("DELETE FROM imagens_escola WHERE id_escola = ?", [idEscola]);

            // Insert new images
            for (let file of files) {
                let nomeImagem = file.originalname;
                let caminho = "app/public/imagem/uploads/" + file.filename;
                const [imageResult] = await pool.query(
                    "INSERT INTO imagens (nome_imagem, caminho_imagem) VALUES (?, ?)",
                    [nomeImagem, caminho]
                );
                let imageId = imageResult.insertId;

                // Link image to school
                await pool.query(
                    "INSERT INTO imagens_escola (id_escola, id_imagem) VALUES (?, ?)",
                    [idEscola, imageId]
                );
            }
            return true;
        } catch (error) {
            console.error("Erro ao inserir imagens do carrossel:", error);
            return false;
        }
    },

    findId: async (id) => {
        try {
            const [resultados] = await pool.query(
                "SELECT e.id_escola, " +
                "e.nome_escola, e.email_escola, e.cep, e.endereco, e.numero," +
                "e.cnpj, e.tipo_ensino, e.turnos, e.rede, e.acessibilidade, e.whatsapp, e.telefone, " +
                "e.instagram, e.facebook, e.email, e.sobre_escola, e.sobre_ensino, " +
                "e.sobre_estrutura, e.ingresso, e.img_perfil_id, " +
                "REPLACE(i.caminho_imagem, 'app/public', '') AS img_perfil_pasta," +
                "GROUP_CONCAT(DISTINCT ie.id_imagem) AS imagens_ids, " +
                "GROUP_CONCAT(DISTINCT REPLACE(im.caminho_imagem, 'app/public', '')) AS imagens_caminhos " +
                "FROM escolas e " +
                "LEFT JOIN imagens i ON e.img_perfil_id = i.id_imagem " +
                "LEFT JOIN imagens_escola ie ON e.id_escola = ie.id_escola " +
                "LEFT JOIN imagens im ON ie.id_imagem = im.id_imagem " +
                "WHERE e.id_usuario = ? " +
                "GROUP BY e.id_escola",
                [id]
            );
            return resultados;
        } catch (error) {
            console.error("Erro ao buscar escola:", error);
            return error;
        }
    },
    


}

    

module.exports = escolaModel;


