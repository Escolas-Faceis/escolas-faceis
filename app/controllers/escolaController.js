const escolaModel = require("../models/escolaModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarCNPJ } = require("../helpers/validacoes");


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
            
        body("reppassword")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Senhas estão diferentes"),
        body("cnpj")
            .isLength({ min: 18, max: 18 })
            .withMessage('O CNPJ tem 18 caracteres!')
            .custom(value => {
                if (!validarCNPJ(value)) {
                    throw new Error('CNPJ inválido');
                }
                return true;
            }),

    ],

    cadastrarEscola: async (req, res) => {
        try {
            let erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.render('pages/cadastro-escola', { "erros": erros, "valores": req.body });
            }
            const dados = {
                'name_school': req.body.name_school,
                'email': req.body.email,
                'password': req.body.password,
                // 'cep': req.body.cep,
                // 'numero': req.body.adress_n,
                // 'cnpj': req.body.cnpj
            };
            console.log("Dados enviados para o banco:", dados); // <-- Adicione esta linha
            let resultado = await escolaModel.create(dados);
            if (resultado) {
                return res.render('pages/index');
            } else {
                return res.render('pages/cadastro-escola', {
                    "erros": { errors: [{ msg: "Erro ao cadastrar." }] },
                    "valores": req.body
                });
            }
        } catch (error) {
            console.log(error);
            return res.render('pages/cadastro-escola', {
                "erros": { errors: [{ msg: "Erro interno no servidor." }] },
                "valores": req.body
            });
        }
    }
}

module.exports = escolaController;