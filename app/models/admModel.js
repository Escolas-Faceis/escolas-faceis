var pool = require("../../config/pool_conexoes");

const admModel = {
    findAll: async () => {
        try {
            const [results] = await pool.query("SELECT * FROM usuarios WHERE status_usuario = 1");
            return results;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    findAllComuns: async () => {
        try {
            const [results] = await pool.query("SELECT * FROM usuarios WHERE status_usuario = 1 AND tipo_usuario = 'C'");
            return results;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    findAllAdms: async () => {
        try {
            const [results] = await pool.query("SELECT * FROM usuarios WHERE status_usuario = 1 AND tipo_usuario = 'A'");
            return results;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    findAllSchools: async () => {
        try {
            const [results] = await pool.query(`
                SELECT u.id_usuario, u.nome_usuario, u.email_usuario, u.status_usuario,
                       e.cnpj, e.endereco, e.cep, e.numero, e.tipo_ensino, e.turnos, e.rede
                FROM usuarios u
                JOIN escolas e ON u.id_usuario = e.id_usuario
                WHERE u.status_usuario = 1 AND u.tipo_usuario = 'E'
                ORDER BY u.nome_usuario ASC
            `);
            return results;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    create: async (dados) => {
        try {
            const [resultados, estrutura] = await pool.query(
            `    INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario, tipo_usuario, status_usuario) VALUES (?, ?, ?, "Escola", 1);`,
                [dados.name_school, dados.email, dados.password]
            );
            console.log(resultados);
            return estrutura;
        } catch (erro) {
            console.log(erro);
            return false;
        }
    },

        delete: async (dados) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE usuarios SET status_usuario = 0 WHERE id_usuario = ? ", [dados]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },


    findAllSchoolsData: async () => {
        try {
            const [escolas] = await pool.query(
                "SELECT id_usuario, nome_usuario, email_usuario, cnpj, tipo_usuario, status_usuario FROM escolas"
            );
            return escolas;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    findPage: async (pagina, total) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM usuarios WHERE status_usuario = 1 LIMIT ?,?', [pagina, total]);
            return linhas;
        } catch (error) {
            return error;
        }
    },

    totalReg: async () => {
        try {
            const [linhas] = await pool.query(
                "SELECT count(*) total FROM usuarios WHERE status_usuario = 1"
            )
            return linhas;
        } catch (error) {
            console.log(error);
            return error;
        }},

    findCampoCustom: async (criterioWhere) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT count(*) totalReg FROM usuario WHERE ?",
                    [criterioWhere]
                )
                return resultados[0].totalReg;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

    getTotalUsuarios: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT COUNT(*) as total FROM usuarios WHERE status_usuario = 1"
            );
            return resultados[0].total;
        } catch (error) {
            console.log(error);
            return 0;
        }
    },

    getDistribuicaoTipos: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT tipo_usuario, COUNT(*) as quantidade FROM usuarios WHERE status_usuario = 1 GROUP BY tipo_usuario"
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getStatusUsuarios: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT status_usuario, COUNT(*) as quantidade FROM usuarios GROUP BY status_usuario"
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getEscolasPorRede: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT rede, COUNT(*) as quantidade FROM escolas e JOIN usuarios u ON e.id_usuario = u.id_usuario WHERE u.status_usuario = 1 GROUP BY rede"
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getDenunciasPendentes: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT COUNT(*) as total FROM denuncias WHERE status = 'P'"
            );
            return resultados[0].total;
        } catch (error) {
            console.log(error);
            return 0;
        }
    },

findAllPremiumSchools: async () => {
  try {
    const [results] = await pool.query(`
      SELECT
        e.id_escola,
        u.nome_usuario as nome_escola,
        a.id_assinatura,
        p.nome_plano,
        a.data_inicio,
        a.data_fim
      FROM usuarios u
      JOIN escolas e ON u.id_usuario = e.id_usuario
      JOIN assinatura a ON e.id_escola = a.id_escola
      JOIN plano p ON a.id_plano = p.id_plano
      WHERE
        u.status_usuario = 1
        AND u.tipo_usuario = 'E'
        AND a.ativo = TRUE
        AND (a.data_fim IS NULL OR a.data_fim >= CURDATE())
      ORDER BY e.id_escola ASC
    `);
    return results;
  } catch (error) {
    console.log("Erro ao buscar escolas premium:", error);
    return [];
  }
},

findPremiumSchoolsPage: async (inicio, regPagina) => {
  try {
    const [results] = await pool.query(`
      SELECT
        e.id_escola,
        u.nome_usuario as nome_escola,
        a.id_assinatura,
        p.nome_plano,
        a.data_inicio,
        a.data_fim
      FROM usuarios u
      JOIN escolas e ON u.id_usuario = e.id_usuario
      JOIN assinatura a ON e.id_escola = a.id_escola
      JOIN plano p ON a.id_plano = p.id_plano
      WHERE
        u.status_usuario = 1
        AND u.tipo_usuario = 'E'
        AND a.ativo = TRUE
        AND (a.data_fim IS NULL OR a.data_fim >= CURDATE())
      ORDER BY e.id_escola ASC
      LIMIT ?, ?
    `, [inicio, regPagina]);
    return results;
  } catch (error) {
    console.log("Erro ao buscar escolas premium paginadas:", error);
    return [];
  }
},

totalPremiumSchools: async () => {
  try {
    const [results] = await pool.query(`
      SELECT COUNT(*) as total
      FROM usuarios u
      JOIN escolas e ON u.id_usuario = e.id_usuario
      JOIN assinatura a ON e.id_escola = a.id_escola
      JOIN plano p ON a.id_plano = p.id_plano
      WHERE
        u.status_usuario = 1
        AND u.tipo_usuario = 'E'
        AND a.ativo = TRUE
        AND (a.data_fim IS NULL OR a.data_fim >= CURDATE())
    `);
    return results;
  } catch (error) {
    console.log("Erro ao contar escolas premium:", error);
    return [{ total: 0 }];
  }
}


}

module.exports = admModel;
