 const escolaModel = require("../models/escolaModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const escolaController = {
    regrasValidacaoEscola: [
        body("name_school").isLength({min:3,max:70}).withMessage("Nome entre 3 e 70 caracteres"),
        body("adress").isLength({min:3, max:50}).withMessage("Endereço entre 3 e 50 caracteres"),
        body("adress_n").isNumeric().withMessage("Insira um número"),
        body("city").isLength({min:3,max:30}).withMessage("Insira uma cidade válida"),
        body("email").isEmail().withMessage("Email inválido."),
        body("password").isStrongPassword().withMessage("Senha muito fraca!"),
        body("reppassword").custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage("Senhas estão diferentes"),
        body("cnpj")
        .isLength({ min: 18, max: 18 }).withMessage('O CNPJ tem 18 caracteres!')
        .custom((value) => {
      if (validarCNPJ(value)) {
        return true;
      } else {
        throw new Error('CNPJ inválido!');
      }
    }),

    function (req, res) {
      // Validar os dados recebidos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/cadastro-escola", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfil-usuario", { "erros": null, "valores":req.body,"retorno":req.body});
      }

    ],
}

module.exports = escolaController;