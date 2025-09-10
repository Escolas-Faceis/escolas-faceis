var pool = require("../../config/pool_conexoes");


const usuarioModel = {

    create: async (dados) => {
        try {
            const [resultados] = await pool.query(
                "INSERT INTO usuarios (nome_usuario, email_usuario, telefone_usuario, senha_usuario, tipo_usuario, status_usuario) VALUES (?, ?, ?, ?, ?, ?)",
                [dados.name, dados.email, dados.cellphone, dados.password, "Comum", 1]
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
    
    update: async (dados, id) => {
        try {
            const [linhas] = await pool.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [dados, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    findCampoCustom: async (criterioWhere) => {
    try {
        const [resultados] = await pool.query(
            "SELECT count(*) email_usuario FROM usuarios WHERE ?",
            [criterioWhere]
        )
        return resultados[0].email_usuario;
    } catch (error) {
        console.log(error);
        return error;
    }
},




  
};
    

module.exports = usuarioModel
