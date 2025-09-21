const escolaModel = require("../models/escolaModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarCNPJ } = require("../helpers/validacoes");
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
            .withMessage("Email inválido."),
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
    }
}

module.exports = escolaController;