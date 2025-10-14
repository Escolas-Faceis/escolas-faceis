const { enviarEmail } = require("../helpers/email");
const { body, validationResult } = require("express-validator");

const contatoController = {

    regrasValidacao:[
        body("email").isEmail().withMessage("Digite um email válido!"),
        body("assunto").isEmpty().withMessage("Adicione um assunto!"),
        body("mensagem").isEmpty().withMessage("Você deve adicionar a sua mensagem!")
    ],

    enviarMensagem: async (req, res) => {
        // Verificar se o usuário está autenticado
        if (!req.session.autenticado || !req.session.autenticado.autenticado) {
            return res.json({
                success: false,
                redirect: '/login',
                message: 'Você precisa estar logado para enviar mensagens de contato.'
            });
        }

        let erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render('pages/cadastro-escola', {
                erros,
                valores: req.body,
                dadosNotificacao: null
            });
        }
        try {
            const { email, assunto, mensagem } = req.body;

            if (!email || !mensagem) {
                return res.status(400).json({
                    success: false,
                    message: "Email e mensagem são obrigatórios."
                });
            }

            // Construir o conteúdo do email
            const subject = assunto ? `Contato: ${assunto}` : "Contato via site";
            const htmlContent = `
                <h2>Nova mensagem de contato</h2>
                <p><strong>Email do remetente:</strong> ${email}</p>
                <p><strong>Assunto:</strong> ${assunto || 'N/A'}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem.replace(/\n/g, '<br>')}</p>
            `;

            // Enviar email
            enviarEmail("escolasfaceis@gmail.com", subject, null, htmlContent, () => {
                console.log("Email de contato enviado com sucesso.");
            });

            // Responder com sucesso
            res.json({
                success: true,
                message: "Mensagem enviada com sucesso! Entraremos em contato em breve."
            });

        } catch (error) {
            console.error("Erro ao enviar mensagem de contato:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor. Tente novamente mais tarde."
            });
        }
    }
};

module.exports = contatoController;
