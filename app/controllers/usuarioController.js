// const usuarioModel = require("../models/usuarioModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const usuarioController = {
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
    regrasValidacaoUsuario: [
         body("name").isLength({min:3,max:50}).withMessage("Nome Inválido"),
    body("email").isEmail().withMessage("Email inválido."),
    body("cellphone").custom((value) => {
        if (validarTelefone(value)) {
          return true;
        } else {
          throw new Error('Telefone inválido!');
        }
        }),
        body("password").isStrongPassword().withMessage("Senha muito fraca!"),
        body("reppassword").custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage("Senhas estão diferentes"),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/cadastro-usuario", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfil-usuario", { "erros": null, "valores":req.body,"retorno":req.body});
    }
    ],
    regrasValidacaoLogin: [
         body("email").isEmail().withMessage("Email inválido."),
            body("password").isStrongPassword().withMessage("Senha muito fraca!"),
            function (req, res) {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                console.log(errors);
                return res.render("pages/login", { "erros": errors, "valores":req.body,"retorno":null});
              }
          
                return res.render("pages/perfil-usuario", { "erros": null, "valores":req.body,"retorno":req.body});
            }
    ],

    listarUsuarios: async (req, res) =>{
        res.locals.moment = moment;
        try{
        let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
        let results = null
        let regPagina = 10
        let inicio = parseInt(pagina - 1) * regPagina
        let totReg = await usuarioModel.totalReg();
        let totPaginas = Math.ceil(totReg[0].total / regPagina);
        results = await usuarioModel.findPage(inicio, regPagina);
        let paginador = totReg[0].total <= regPagina ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas };
        res.render("pages/index-adm", { tarefas: results, paginador: paginador });
        }
        
            catch (e) {
            console.error("Erro ao listar usuários:", e);
            res.status(500).send("Erro ao listar usuários");
            res.json({ erro: "Falha ao acessar dados" });
        }
    }

}

module.exports = usuarioController;