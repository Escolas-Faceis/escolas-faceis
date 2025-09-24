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
                    const [resultados] = await pool.query(
                        "SELECT u.id_usuario, u.nome_usuario, " +
                        "u.senha_usuario, u.email_usuario, u.telefone_usuario, u.tipo_usuario, " +
                        "u.status_usuario, u.img_perfil_banco, u.img_perfil_pasta, u.biografia_usuario " +
                        "FROM usuarios u WHERE u.id_usuario = ? AND u.status_usuario = 1", [id]
                    )
                    return resultados;
                } catch (error) {
                    console.log(error);
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
            const [linhas] = await pool.query('UPDATE usuarios SET nome_usuario = ?, email_usuario = ?, telefone_usuario = ?, biografia_usuario = ?, img_perfil_banco = ?, img_perfil_pasta = ?, senha_usuario = ? WHERE id_usuario = ?', 
                [dados.nome, dados.email, dados.telefone, dados.biografia, dados.img_perfil_banco, dados.img_perfil_pasta, dados.senha_usuario, id])
            return linhas;
        } catch (error) {
            console.log("Erro na atualização do usuário: ", error);
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
