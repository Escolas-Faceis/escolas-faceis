var pool = require("../../config/pool_conexoes");

const loginModel = {
    findUserEmail: async (dados) => {
        try {
            const [linhas] = await pool.query(
               `SELECT u.*,
                       CASE
                           WHEN u.tipo_usuario = 'E' THEN i2.caminho_imagem
                           ELSE i.caminho_imagem
                       END as img_perfil_pasta,
                       NULL as img_perfil_banco
                FROM usuarios u
                LEFT JOIN imagens i ON u.img_perfil_id = i.id_imagem
                LEFT JOIN escolas e ON u.id_usuario = e.id_usuario
                LEFT JOIN imagens i2 ON e.img_perfil_id = i2.id_imagem
                WHERE u.email_usuario = ? AND u.status_usuario = 1`,
                [dados.email_usuario]
            );
            return linhas;
        } catch (error) {
            console.error("Erro ao buscar usuário por email:", error);
            return [];
        }
    },

            findId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT u.id_usuario, u.nome_usuario, " +
                    "u.senha_usuario, u.email_usuario, u.telefone_usuario, u.tipo_usuario, " +
                    "u.status_usuario,u.numero_usuario, u.cep_usuario,u.img_perfil_banco, u.img_perfil_pasta," +
                    "t.id_tipo_usuario, t.descricao_usuario " +
                    "FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
                    "u.tipo_usuario = t.id_tipo_usuario and u.id_usuario = ? ", [id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

                findCampoCustom: async (criterioWhere) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT count(*) totalReg FROM usuarios WHERE ?",
                    [criterioWhere]
                )
                return resultados[0].totalReg;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

            findUserCustom: async (criterioWhere) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT *  FROM usuarios WHERE ?",
                    [criterioWhere]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },



};

module.exports = loginModel;