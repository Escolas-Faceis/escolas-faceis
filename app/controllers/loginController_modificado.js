const loginModel = require("../models/loginModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const loginController = {

        regrasValidacaoLogin: [
        body("email")
            .isEmail()
            .withMessage("Email inválido."),
        body("password")
            .notEmpty()
            .withMessage("Senha é obrigatória.")

    ],
    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/login", { erros: erros, dadosNotificacao: null, "valores": req.body, "retorno": null })
        }

        // Check if authentication was successful (gravarUsuAutenticado middleware sets this)
        if (req.session.autenticado && req.session.autenticado.autenticado != null) {
            console.log("Usuário logado com sucesso:", req.session.autenticado);

            // Redirecionamento baseado no tipo de usuário
            const tipoUsuario = req.session.autenticado.tipo;
            if (tipoUsuario === 'Escola') {
                res.redirect("/perfil-escola");
            } else if (tipoUsuario === 'Comum') {
                res.redirect("/perfil-usuario");
            } else {
                // Para outros tipos (como ADM), redireciona para a página inicial
                res.redirect("/");
            }
        } else {
            console.log("Falha na autenticação");
            res.render("pages/login", {
                erros: null,
                dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" },
                "valores": req.body, "retorno": null
            })
        }
    },

    mostrarPerfil: async (req, res) => {
        try {
            let results = await usuario.findId(req.session.autenticado.id);
            if (results[0].cep_usuario != null) {
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });
                const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_usuario}/json/`,
                    { method: 'GET', headers: null, body: null, agent: httpsAgent, });
                var viaCep = await response.json();
                var cep = results[0].cep_usuario.slice(0,5)+ "-"+results[0].cep_usuario.slice(5)
            }else{
                var viaCep = {logradouro:"", bairro:"", localidade:"", uf:""}
                var cep = null;
            }

            let campos = {
                nome_usu: results[0].nome_usuario, email_usu: results[0].email_usuario,
                cep:  cep,
                numero: results[0].numero_usuario,
                complemento: results[0].complemento_usuario, logradouro: viaCep.logradouro,
                bairro: viaCep.bairro, localidade: viaCep.localidade, uf: viaCep.uf,
                img_perfil_pasta: results[0].img_perfil_pasta,
                img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
                nomeusu_usu: results[0].user_usuario, fone_usu: results[0].fone_usuario, senha_usu: ""
            }

            res.render("pages/perfil", { listaErros: null, dadosNotificacao: null, valores: campos })
        } catch (e) {
            console.log(e);
            res.render("pages/perfil", {
                listaErros: null, dadosNotificacao: null, valores: {
                    img_perfil_banco: "", img_perfil_pasta: "", nome_usu: "", email_usu: "",
                    nomeusu_usu: "", fone_usu: "", senha_usu: "", cep: "", numero: "", complemento: "",
                    logradouro: "", bairro: "", localidade: "", uf: ""
                }
            })
        }
    },




}

module.exports = loginController;
