var pool = require("../../config/pool_conexoes");
const moment = require("moment");

const usuarioModel = {

    create: async (dados) => {
        try {
            const [resultados] = await pool.query(
                "INSERT INTO usuarios (nome_usuario, email_usuario, telefone_usuario, senha_usuario, tipo_usuario, status_usuario) VALUES (?, ?, ?, ?, ?, ?)",
                [dados.name, dados.email, dados.cellphone, dados.password, "C", 1]
            );
            console.log(resultados);
            return resultados;
        } catch (erro) {
            console.log(erro);
            return false;
        }
    },

    findAll: async () => {
            try {
                const [resultados] = await pool.query(
                    "SELECT u.id_usuario, u.nome_usuario, " +
                    "u.senha_usuario, u.email_usuario, u.telefone_usuario, u.tipo_usuario, " +
                    "u.status_usuario"
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;  
            }
        },


    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM usuarios WHERE status_usuario = 1')
            return linhas;
        } catch (error) {
            return error;
        }
    },

                findId: async (id) => {
                try {
                    const [resultados] = await pool.query(
                        "SELECT u.id_usuario, u.nome_usuario, " +
                        "u.senha_usuario, u.email_usuario, u.telefone_usuario, u.tipo_usuario, " +
                        "u.status_usuario, u.img_perfil_id, i.caminho_imagem as img_perfil_pasta, u.biografia_usuario, u.cor_banner, " +
                        "NULL as img_perfil_banco " +
                        "FROM usuarios u LEFT JOIN imagens i ON u.img_perfil_id = i.id_imagem " +
                        "WHERE u.id_usuario = ? AND u.status_usuario = 1", [id]
                    )
                    return resultados;
                } catch (error) {
                    console.log(error);
                    return error;
                }
            },

      findByEmail: async (email) => {
    try {
      const query = "SELECT * FROM usuario WHERE email_usuario = ? AND status_usuario = 1";
      const [rows] = await pool.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }
    },

    findPage: async (pagina, total) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM usuarios  WHERE status_usuario = 1 limit ?, ?', [pagina,total])
            return linhas;
        } catch (error) {
            return error;
        }  
    },
    
    totalReg: async ()=>{
        try {
            const [linhas] = await pool.query('SELECT count(*) total FROM usuarios  WHERE status_usuario = 1')
            return linhas;
        } catch (error) {
            return error;
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


    findCampoCustom: async (email) => {
    try {
        const [resultados] = await pool.query(
            "SELECT count(*) as count FROM usuarios WHERE email_usuario = ?",
            [email]
        )
        return resultados[0].count;
    } catch (error) {
        console.log(error);
        throw error;
    }
},

    updateBannerColor: async (cor, id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE usuarios SET cor_banner = ? WHERE id_usuario = ?",
                [cor, id]
            );
            return resultados;
        } catch (erro) {
            console.log(erro);
            return false;
        }
    },

    update: async (dados, id) => {
        try {
            const [linhas] = await pool.query('UPDATE usuarios SET nome_usuario = ?, email_usuario = ?, telefone_usuario = ?, biografia_usuario = ?, cor_banner = ?, img_perfil_id = ?, senha_usuario = ? WHERE id_usuario = ?',
                [dados.nome, dados.email, dados.telefone, dados.biografia, dados.cor_banner, dados.img_perfil_id, dados.senha_usuario, id])
            return linhas;
        } catch (error) {
            console.log("Erro na atualização do usuário: ", error);
            return error;
        }
    },


            findInativoId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT u.id_usuario, u.nome_usuario, " +
                    "u.senha_usuario, u.email_usuario, u.tipo_usuario, " +
                    "u.status_usuario, u.telefone_usuario, u.img_perfil_id " +
                    "FROM usuarios u WHERE u.status_usuario = 0 " +
                    "AND u.id_usuario = ?;", [id]
                )
                console.log(resultados);
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        delete: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE usuarios SET status_usuario = 0 WHERE id_usuario = ? ", [id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },



};
    

module.exports = usuarioModel
