var pool = require("../../config/pool_conexoes");


const usuarioModel = {
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
            const [linhas,campos] = await pool.query('SELECT * FROM usuarios WHERE status_usuario = 1 and id_usuario = ?',[id] )
            return linhas;
        } catch (error) {
            return error;
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
    
    create: async (dados) => {

        try {
            const [resultados] = await pool.query("INSERT INTO usuarios "
                + " (nome_usuario,email_usuario, telefone_usuario, senha_usuario, tipo_usuario, status_usuario) "
                + " VALUES(?,?,?,?, Comum, 1) ", [dados.name, dados.email, dados.cellphone, dados.password]);
            console.log(resultados);
            return resultados;
        } catch (erro) {
            console.log(erro);
            return false;
        }

    },

    update: async (dados, id) => {
        try {
            const [linhas] = await pool.query('UPDATE tarefas SET ? WHERE id_tarefa = ?', [dados, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },




  
};
    

module.exports = usuarioModel