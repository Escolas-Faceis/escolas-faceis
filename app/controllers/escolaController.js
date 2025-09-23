const escolaModel = require("../models/escolaModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarCNPJ, cnpjExiste, emailExiste } = require("../helpers/validacoes");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);

const escolaController = {
    regrasValidacaoEscola: [
        body("name_school")
            .isLength({ min: 3, max: 70 })
            .withMessage("Nome entre 3 e 70 caracteres"),
        body("adress")
            .isLength({ min: 3, max: 50 })
            .withMessage("Endereço entre 3 e 50 caracteres"),
        body("adress_n")
            .isNumeric()
            .withMessage("Insira um número"),
        body("city")
            .isLength({ min: 3, max: 30 })
            .withMessage("Insira uma cidade válida"),
        body("email")
            .isEmail()
            .withMessage("Email inválido.")
            .custom(async value => {
                const exists = await emailExiste(value);
                if (exists) {
                    throw new Error('Email já cadastrado');
                }
                return true;
            }),
        body("password")
            .isStrongPassword()
            .withMessage("Senha muito fraca!"),
        body("cep")
            .isLength({ min: 9, max: 9 })
            .withMessage("CEP inválido"),
        body("reppassword")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Senhas estão diferentes"),
        body("cnpj")
            .isLength({ min: 14, max: 18 })
            .withMessage('O CNPJ deve ter entre 14 e 18 caracteres!')
            .custom(value => {
                if (!validarCNPJ(value)) {
                    throw new Error('CNPJ inválido');
                }
                return true;
            })
            .custom(async value => {
                const exists = await cnpjExiste(value);
                if (exists) {
                    throw new Error('CNPJ já cadastrado');
                }
                return true;
            }),

    ],

    cadastrarEscola: async (req, res) => {
        let erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render('pages/cadastro-escola', { 
                erros, 
                valores: req.body,
                dadosNotificacao: null
            });
        }
        const tiposEnsinoValues = Array.isArray(req.body.ensino) ? req.body.ensino : [req.body.ensino].filter(Boolean);
        const turnosValues = Array.isArray(req.body.turno) ? req.body.turno : [req.body.turno].filter(Boolean);
        const redesValues = Array.isArray(req.body.rede) ? req.body.rede : [req.body.rede].filter(Boolean);

        console.log("Checkbox values received - ensino:", tiposEnsinoValues);
        console.log("Checkbox values received - turno:", turnosValues);
        console.log("Checkbox values received - rede:", redesValues);

        const dados = {
            'tipos_ensino': tiposEnsinoValues,
            'turnos': turnosValues,
            'redes': redesValues,
            'name_school': req.body.name_school,
            'email': req.body.email,
            'password': bcrypt.hashSync(req.body.password, salt),
            'cep': req.body.cep,
            'numero': req.body.adress_n,
            'cnpj': req.body.cnpj,
            'endereco': req.body.adress,
            'cidade': req.body.city,
            'estado': req.body.estado || 'SP',
            'email_escola': req.body.email,
            'senha_escola': bcrypt.hashSync(req.body.password, salt),
            'nome_escola': req.body.name_school,
            'tipo_ensino_str': tiposEnsinoValues.join(','),
            'turnos_str': turnosValues.join(','),
            'redes_str': redesValues.join(',')
        };
        console.log("Dados enviados para o banco:", dados);
       
        try {
            let create = await escolaModel.create(dados);
            console.log("Result of create:", create);

            if (create && create.success === false) {
                // Handle specific database errors
                let errorMessage = "Erro no banco de dados. Tente novamente.";
                let notificationType = "error";
                
                if (create.code === 'ER_DATA_TOO_LONG') {
                    errorMessage = "Dados muito longos para um dos campos. Verifique o tamanho dos dados inseridos.";
                } else if (create.code === 'ER_DUP_ENTRY') {
                    errorMessage = create.userMessage || "Dados duplicados encontrados. Verifique os campos únicos.";
                }
                
                return res.render('pages/cadastro-escola', {
                    "erros": null,
                    "valores": req.body,
                    "dadosNotificacao": {
                        titulo: "Erro no Cadastro",
                        mensagem: errorMessage,
                        tipo: notificationType
                    }
                });
            }

            res.render("pages/cadastro-escola", {
                erros: null, dadosNotificacao: {
                    titulo: "Cadastro realizado!", mensagem: "Nova escola criada com sucesso!", tipo: "success"
                }, valores: req.body
            });
        } catch (error) {
            console.log(error);
            return res.render('pages/cadastro-escola', {
                "erros": { errors: [{ msg: "Erro interno no servidor." }] },
                "valores": req.body,
                "dadosNotificacao": null
            });
        }
    },

    listarEscolas: async (req, res) => {
        try {
            const escolas = await escolaModel.findAllSorted();
            res.render('pages/encontre-escolas', { escolas });
        } catch (error) {
            console.log(error);
            res.status(500).send('Erro interno do servidor');
        }
    },

    
    paginarEscolas: async (req, res, next) => {
        res.locals.moment = moment;
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let results = null;
            let regPagina = 5;
            let inicio = (pagina - 1) * regPagina;
            let totalReg = await escolaModel.totalReg();
            let totPaginas = Math.ceil(totalReg[0].total / regPagina);
            results = await escolaModel.findPage(inicio, regPagina);
            let paginador = totalReg[0].total <= regPagina ? null : { "paginaAtual": pagina, "totalReg": totalReg[0].total, "totPaginas": totPaginas };
            res.render('pages/encontre-escolas', { escolas: results, paginador: paginador });
        } catch (error) {
            console.log(error);
            res.render('pages/encontre-escolas', { escolas: [], paginador: null });
        }
    },
}

module.exports = escolaController;
