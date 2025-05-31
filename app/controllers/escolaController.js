const escolaModel = require("../models/escolaModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarCNPJ } = require("../helpers/validacoes");


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
        .custom(value => {
  if (!validarCNPJ(value)) {
    throw new Error('CNPJ inválido');
  }
  return true;
}),

    function (req, res) {
      // Validar os dados recebidos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/cadastro-escola", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfil-escola-e", { "erros": null, "valores":req.body,"retorno":req.body});
      }

    ],

    cadastrarEscola: async( req, res) =>{
      try{
        let listaErros = validationResult(req);
        if(listaErros.isEmpty()){
          const dados = {
            'name_school':req.body.name_school,
            'email':req.body.email,
            'password':req.body.password 
          };
          let resultado = await escolaModel.create(dados);
          console.log("Gravando no banco...")
          if(resultado){
            return res.render('pages/index');
          }else{
            return res.render('pages/cadastro-escola', {"listaErros": null, "valores": req.body})
          }
        }else{
            return res.render('pages/cadastro-escola', {"listaErros": null, "valores": req.body})
          }

      }catch(error){
            console.log(error);
            return false;
        }
    }
}

module.exports = escolaController;