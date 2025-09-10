
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

    findAllSchools: async () => {
        try {
            const [results] = await pool.query(`
                SELECT u.id_usuario, u.nome_usuario, u.email_usuario, u.status_usuario, e.cnpj, e.endereco, e.numero
                FROM usuarios u
                JOIN escolas e ON u.id_usuario = e.id_usuario
                WHERE u.status_usuario = 1 AND u.tipo_usuario = 'Escola'
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
    }
}

module.exports = admModel;