const { validationResult } = require("express-validator");
const usuario = require("./loginModel");
const bcrypt = require("bcryptjs");

verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
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
        var total = Object.keys(results).length;
        if (total == 1) {
            if (bcrypt.compareSync(req.body.password, results[0].senha_usuario)) {
                var autenticado = {
                    autenticado: results[0].nome_usuario,
                    id: results[0].id_usuario,
                    tipo: results[0].tipo_usuario
                };
            }
        } 
    } 
    req.session.autenticado = autenticado;
    next();
}

verificarUsuAutorizado = (tipoPermitido, destinoFalha) => {
    return (req, res, next) => {
        if (req.session.autenticado.autenticado != null &&
            tipoPermitido.find(function (element) { return element == req.session.autenticado.tipo }) != undefined) {
            console.log("Usuário autorizado:", req.session.autenticado);
                next();
        } else {
            res.render(destinoFalha, req.session.autenticado);
            console.log("Usuário não autorizado:", req.session.autenticado);
        }
    };
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}
