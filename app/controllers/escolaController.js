const escolaModel = require("../models/escolaModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { validarCNPJ, cnpjExiste, emailExiste } = require("../helpers/validacoes");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const https = require("https");

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
            let regPagina = 5;
            let inicio = (pagina - 1) * regPagina;

            // Extract search and filter parameters
            const searchParams = {
                nome: req.query.nome || req.query['nome-escola-search'] || '',
                cidade: req.query.cidade || req.query['cidade-search'] || '',
                regiao: req.query.regiao || req.query['regiao-search'] || '',
                niveis: req.query.niveis ? (Array.isArray(req.query.niveis) ? req.query.niveis : [req.query.niveis]) : [],
                redes: req.query.redes ? (Array.isArray(req.query.redes) ? req.query.redes : [req.query.redes]) : [],
                turnos: req.query.turnos ? (Array.isArray(req.query.turnos) ? req.query.turnos : [req.query.turnos]) : [],
                acessibilidade: req.query.acessibilidade,
                eja: req.query.eja,
                bilingue: req.query.bilingue
            };

            // Check if any search/filter parameters are provided
            const hasFilters = Object.values(searchParams).some(value => {
                if (Array.isArray(value)) return value.length > 0;
                return value && value.trim && value.trim() !== '' && value !== 'regiao';
            });

            let results, totalReg, totPaginas, paginador;

            if (hasFilters) {
                // Use filtered search
                results = await escolaModel.searchAndFilterSchools(searchParams, inicio, regPagina);
                const countResult = await escolaModel.countFilteredSchools(searchParams);
                totalReg = countResult[0] ? countResult[0].total : 0;
            } else {
                // Use regular pagination
                results = await escolaModel.findPage(inicio, regPagina);
                const countResult = await escolaModel.totalReg();
                totalReg = countResult[0] ? countResult[0].total : 0;
            }

            totPaginas = Math.ceil(totalReg / regPagina);
            paginador = totalReg <= regPagina ? null : { "paginaAtual": pagina, "totalReg": totalReg, "totPaginas": totPaginas };

            // Pass search parameters back to view for form population
            res.render('pages/encontre-escolas', {
                escolas: results,
                paginador: paginador,
                searchParams: searchParams,
                hasFilters: hasFilters
            });
        } catch (error) {
            console.log(error);
            res.render('pages/encontre-escolas', {
                escolas: [],
                paginador: null,
                searchParams: {},
                hasFilters: false
            });
        }
    },

    regrasValidacaoEditarEscola: [
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
        body("cep")
            .isLength({ min: 9, max: 9 })
            .withMessage("CEP inválido"),
    ],

    mostrarPerfil: async (req, res) => {
        try {

             let id = req.query.id || req.session.autenticado.id;
            console.log("ID da escola solicitado:", id);
            let results = await escolaModel.findId(id);
            console.log("Resultado da busca:", results.length > 0 ? "Escola encontrada" : "Escola não encontrada");
            if (results.length === 0) {
                return res.render("pages/index", { erros: null, dadosNotificacao: { titulo: "Erro", mensagem: "Escola não encontrada", tipo: "error" } });

            }

            if(results[0].cep != null){
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false});
                    const response = await fetch(`https://viacep.com.br/ws/${results[0].cep}/json/`, {
                        method: 'GET',
                        agent: httpsAgent
                    });
                var viaCep = await response.json();
                var cep = results[0].cep.slice(0,5)+ "-"+results[0].cep.slice(5)
            }else{
                var viaCep = {logradouro:"", bairro:"", localidade:"", uf:""}
                var cep = null;
            }

            let campos = {
                name: results[0].nome_escola, email: results[0].email_escola, cep: results[0].cep,
                endereco: results[0].endereco, numero: results[0].numero, cnpj: results[0].cnpj,
                tipos_ensino: results[0].tipo_ensino ? results[0].tipo_ensino.split(',') : [],
                turnos: results[0].turnos ? results[0].turnos.split(',') : [],
                redes: results[0].rede ? results[0].rede.split(',') : [],
                whatsapp: results[0].whatsapp, telefone: results[0].telefone,
                instagram: results[0].instagram, facebook: results[0].facebook, email_contato: results[0].email,
                sobre_escola: results[0].sobre_escola, sobre_ensino: results[0].sobre_ensino,
                sobre_estrutura: results[0].sobre_estrutura, ingresso: results[0].ingresso,
                img_perfil_id: results[0].img_perfil_id, 
                cidade: viaCep.localidade, estado: viaCep.uf, bairro: viaCep.bairro, logradouro: viaCep.logradouro

            }

            let view = "pages/perfil-escola";
            if (req.session.autenticado && req.session.autenticado.tipo === "E" && id == req.session.autenticado.id) {
                view = "pages/perfil-escola";
            } else {
                view = "pages/perfil-escola-e";
            }

            res.render(view, { erros: null, dadosNotificacao: null, valores: campos, cep: cep });

        } catch (e) {
            console.log('ERRO NO PERFIL:', e);
            res.render("pages/perfil-escola", { erros: { errors: [{ msg: "Erro ao carregar perfil." }] }, dadosNotificacao: null, valores: {}, cep: null });
        }
    },

    gravarPerfilEscola: async (req, res) => {
        const erros = validationResult(req);
        const erroMulter = req.session.erroMulter;
        if (!erros.isEmpty() || erroMulter != null) {
            lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
            if (erroMulter != null) {
                lista.errors.push(erroMulter);
                delete req.session.erroMulter;
            }
            return res.render("pages/editar-escola", { erros: lista, dadosNotificacao: null, valores: req.body });
        }
        try {
            let currentSchool = await escolaModel.findId(req.session.autenticado.id);
            const tiposEnsinoValues = Array.isArray(req.body.ensino) ? req.body.ensino : [req.body.ensino].filter(Boolean);
            const turnosValues = Array.isArray(req.body.turno) ? req.body.turno : [req.body.turno].filter(Boolean);
            const redesValues = Array.isArray(req.body.rede) ? req.body.rede : [req.body.rede].filter(Boolean);

            var dados = {
                nome_escola: req.body.name_school,
                endereco: req.body.adress,
                numero: req.body.adress_n,
                cidade: req.body.city,
                estado: req.body.state,
                cep: req.body.cep,
                tipos_ensino: tiposEnsinoValues,
                turnos: turnosValues,
                redes: redesValues,
                tipo_ensino_str: tiposEnsinoValues.join(','),
                turnos_str: turnosValues.join(','),
                redes_str: redesValues.join(','),
                img_perfil_id: currentSchool[0].img_perfil_id,
                sobre_escola: req.body['Sobre a Escola'],
                sobre_ensino: req.body['Sobre o Ensino'],
                sobre_estrutura: req.body['Sobre a Estrutura']
            };
            if (req.file) {
                let nomeImagem = req.file.originalname;
                let caminho = "app/public/imagem/uploads/" + req.file.filename;
                let newId = await escolaModel.insertImage(nomeImagem, caminho);
                dados.img_perfil_id = newId;
                // remove old if exists
                if (currentSchool[0].img_perfil_id != null) {
                    require("../helpers/removeImg")(currentSchool[0].img_perfil_pasta);
                }
            }
            let resultUpdate = await escolaModel.update(dados, req.session.autenticado.id);
            if (resultUpdate.affectedRows > 0) {
                if (resultUpdate.changedRows >= 1) {
                    var result = await escolaModel.findId(req.session.autenticado.id);
                    var autenticado = {
                        autenticado: result[0].nome_escola,
                        id: result[0].id_escola,
                        tipo: result[0].tipo_usuario,
                        img_perfil_banco: result[0].img_perfil_banco != null ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString('base64')}` : null,
                        img_perfil_pasta: result[0].img_perfil_pasta ? result[0].img_perfil_pasta.replace('app/public', '') : null
                    };
                    req.session.autenticado = autenticado;
                    var campos = {
                        name_school: result[0].nome_escola,
                        adress: result[0].endereco,
                        adress_n: result[0].numero,
                        city: result[0].cidade,
                        state: result[0].estado,
                        cep: result[0].cep,
                        img_perfil_pasta: result[0].img_perfil_pasta ? result[0].img_perfil_pasta.replace('app/public', '') : null,
                        img_perfil_banco: result[0].img_perfil_banco,
                        tipos_ensino: result[0].tipos_ensino ? result[0].tipos_ensino.split(',') : [],
                        turnos: result[0].turnos ? result[0].turnos.split(',') : [],
                        redes: result[0].redes ? result[0].redes.split(',') : []
                    };
                    res.render("pages/editar-escola", { erros: null, dadosNotificacao: { titulo: "Perfil atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, valores: campos });
                } else {
                    res.render("pages/editar-escola", { erros: null, dadosNotificacao: { titulo: "Perfil atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: req.body });
                }
            } else {
                res.render("pages/editar-escola", { erros: null, dadosNotificacao: { titulo: "Erro ao atualizar", mensagem: "Nenhuma alteração foi feita", tipo: "error" }, valores: req.body });
            }
        } catch (e) {
            console.log(e);
            res.render("pages/editar-escola", { erros: { errors: [{ msg: "Erro interno no servidor." }] }, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body });
        }
    },


}

module.exports = escolaController;
