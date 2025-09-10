const usuarioModel = require("../models/usuarioModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarTelefone } = require("../helpers/validacoes");
const bcrypt = require("bcryptjs");
const https = require("https");
var salt = bcrypt.genSaltSync(12);

const usuarioController = {

    regrasValidacaoUsuario: [
        body("name")
            .isLength({ min: 3, max: 50 })
            .withMessage("Nome Inválido"),
        body("email")
            .isEmail()
            .withMessage("Email inválido.")
            .custom(async value => {
                const emailUsu = await usuarioModel.findCampoCustom(value);
                if (emailUsu > 0) {
                    throw new Error('Email em uso!');
                }
            }),
        body("cellphone")
            .custom(async value => {
                if (!validarTelefone(value)) {
                    throw new Error('Número de telefone inválido');
                }
            }),

        body("password")
            .isStrongPassword()
            .withMessage("Senha muito fraca!"),
        body("reppassword")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Senhas estão diferentes"),
    ],

    cadastrarUsuario: async (req, res) => {

        const erros = validationResult(req);
        console.log(erros);
            const dados = {
                name: req.body.name,
                email: req.body.email,
                cellphone: req.body.cellphone,
                password: bcrypt.hashSync(req.body.password, salt)
            };
        if (!erros.isEmpty()) {
                return res.render('pages/cadastro-usuario', { 
                    erros, 
                    valores: req.body,
                    dadosNotificacao: null
                });
            }
            console.log("Dados enviados para o banco:", dados);

        try {
            
            let create = await usuarioModel.create(dados);
            return res.render("pages/cadastro-usuario", {
                erros: null, 
                dadosNotificacao: {
                    titulo: "Cadastro realizado!", 
                    mensagem: "Novo usuário criado com sucesso!", 
                    tipo: "success"
                }, 
                valores: req.body
            })
            
            
        } catch (error) {

            console.log(error);
            return res.render("pages/cadastro-usuario", {
                erros: { errors: [{ msg: "Erro interno no servidor." }] },
                dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                },
                valores: req.body
            });
        }
    },

    mostrarPerfil: async (req, res) => {
        try {
            let results = await usuarioModel.findId(req.session.autenticado.id);
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
                name: results[0].nome_usuario, email: results[0].email_usuario,
                img_perfil_pasta: results[0].img_perfil_pasta,
                img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
                telefone: results[0].telefone_usuario, senha: "", biografia: results[0].biografia_usuario
            }

            let view;
            if (req.path === '/perfil') {
                view = "pages/perfil";
            } else if (req.path === '/info') {
                view = "pages/perfil-usu-i";
            } else {
                view = "pages/perfil copy";
            }
            res.render(view, { erros: null, dadosNotificacao: null, valores: campos })
        } catch (e) {
            console.log(e);
            let view;
            if (req.path === '/perfil') {
                view = "pages/perfil";
            } else if (req.path === '/info') {
                view = "pages/perfil-usu-i";
            } else {
                view = "pages/perfil copy";
            }
            res.render(view, {
                erros: null, dadosNotificacao: null, valores: {
                    img_perfil_banco: "", img_perfil_pasta: "", name: "", email: "",
                     telefone: "", senha: "", biografia: ""
                }
            })
        }
    },

    gravarPerfil: async (req, res) => {

        const erros = validationResult(req);
        const erroMulter = req.session.erroMulter;
        if (!erros.isEmpty() || erroMulter != null ) {
            lista =  !erros.isEmpty() ? erros : {formatter:null, errors:[]};
            if(erroMulter != null ){
                lista.errors.push(erroMulter);
            } 
            return res.render("pages/perfil", { erros: lista, dadosNotificacao: null, valores: req.body })
        }
        try {
            var dados = {
                nome: req.body.nome,
                email: req.body.email,
                telefone: req.body.telefone,
                biografia: req.body.biografia,
                img_perfil_banco: req.session.autenticado.img_perfil_banco,
                img_perfil_pasta: req.session.autenticado.img_perfil_pasta,
            };
            if (req.body.senha != "") {
                dados.senha_usuario = bcrypt.hashSync(req.body.senha, salt);
            }
            if (!req.file) {
                console.log("Falha no carregamento");
            } else {
                //Armazenando o caminho do arquivo salvo na pasta do projeto 
                caminhoArquivo = "app/public/imagem/uploads" + req.file.filename;
                //Se houve alteração de imagem de perfil apaga a imagem anterior
                if(dados.img_perfil_pasta != caminhoArquivo ){
                    removeImg(dados.img_perfil_pasta);
                }
                dados.img_perfil_pasta = caminhoArquivo;
                dados.img_perfil_banco = null;

                // //Armazenando o buffer de dados binários do arquivo 
                // dados.img_perfil_banco = req.file.buffer;                
                // //Apagando a imagem armazenada na pasta
                // if(dados.img_perfil_pasta != null ){
                //     removeImg(dados.img_perfil_pasta);
                // }
                // dados.img_perfil_pasta = null; 
            }
            let resultUpdate = await usuarioModel.update(dados, req.session.autenticado.id);
            if (!resultUpdate.isEmpty) {
                if (resultUpdate.changedRows == 1) {
                    var result = await usuario.findId(req.session.autenticado.id);
                    var autenticado = {
                        autenticado: result[0].nome_usuario,
                        id: result[0].id_usuario,
                        tipo: result[0].tipo_usuario,
                        img_perfil_banco: result[0].img_perfil_banco != null ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString('base64')}` : null,
                        img_perfil_pasta: result[0].img_perfil_pasta
                    };
                    req.session.autenticado = autenticado;
                    var campos = {
                        nome: result[0].nome_usuario, email: result[0].email_usuario,
                        img_perfil_pasta: result[0].img_perfil_pasta, img_perfil_banco: result[0].img_perfil_banco,
                        biografia: result[0].biografia_usuario, telefone: result[0].telefone_usuario, senha_usu: ""
                    }
                    res.render("pages/perfil", { erros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, valores: campos });
                }else{
                    res.render("pages/perfil", { erros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: dados });
                }
            }
        } catch (e) {
            console.log(e)
            res.render("pages/perfil", { erros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body })
        }
    },
    

}

module.exports = usuarioController;