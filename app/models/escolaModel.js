var pool = require("../../config/pool_conexoes");

const escolaModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM usuarios WHERE status_usuario = 1 AND tipo_usuario = "Escola"' )
            return linhas;
        } catch (error) {
            return error;
        }
    },

    create: async(dados) => {
        try {
            const [resultados] = await pool.query('INSERT INTO usuarios' + 
                '(nome_usuario, email_usuario, senha_usuario, tipo_usuario, status_usuario)' + 
                'VALUES (?, ?, ?, "Escola", 1)', [dados.name_school, dados.email, dados.password]);
                console.log(resultados);
                return resultados;
    }catch(erro){
        console.log(erro)
        return false;
    }}

}

module.exports = escolaModel;