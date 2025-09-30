const { validationResult } = require("express-validator");
const usuario = require("./loginModel");
const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync('Senha@123', 10);

verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
    res.locals.autenticado = autenticado;
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    console.log("Sessão limpa");
    next()
}

gravarUsuAutenticado = async (req, res, next) => {
    var autenticado =  { autenticado: null, id: null, tipo: null };
    erros = validationResult(req)
    if (erros.isEmpty()) {
        var dadosForm = {
            email_usuario: req.body.email,
            senha_usuario: req.body.password,
        };
        var results = await usuario.findUserEmail(dadosForm);
        console.log("Resultados do banco:", results);
        var total = Object.keys(results).length;
        if (total == 1) {
            if (bcrypt.compareSync(req.body.password, results[0].senha_usuario)) {
                autenticado = {
                    autenticado: results[0].nome_usuario,
                    id: results[0].id_usuario,
                    tipo: results[0].tipo_usuario,
                    img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
                    img_perfil_pasta: results[0].img_perfil_pasta ? results[0].img_perfil_pasta.replace('app/public', '') : null
                };
                console.log("Usuário autenticado:", autenticado);
            } else {
                console.log("Senha incorreta");
            }
        } else {
            console.log("Usuário não encontrado");
        }
    } else {    
        console.log("Erros de validação:", erros.array());
    }
    req.session.autenticado = autenticado;
    next();
}

verificarUsuAutorizado = (tipoPermitido, destinoFalha = '../401.ejs') => {
    return (req, res, next) => {
        if (
            req.session.autenticado.autenticado != null &&
            tipoPermitido.includes(req.session.autenticado.tipo)
        ) {
            console.log("Usuário autorizado:", req.session.autenticado);
            next();
        } else {
            console.log("Usuário não autorizado:", req.session.autenticado);
            return res.render(destinoFalha)
        }
    }
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}
