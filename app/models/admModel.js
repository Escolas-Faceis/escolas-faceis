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
    }
}

module.exports = admModel;