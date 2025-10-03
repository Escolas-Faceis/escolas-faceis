const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    },
    tls: {
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false, // ignorar certificado digital - APENAS EM DESENVOLVIMENTO
    }

});

function enviarEmail(to, subject, text=null, html = null, callback) {
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject
    };
    if(text!= null){
        mailOptions.text = text;
    }else if(html != null){
        mailOptions.html = html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Erro ao enviar email:", error);
        } else {
            console.log("email enviado:", info.response);
            if (callback && typeof callback === 'function') {
                // Chama a função de callback apenas em caso de sucesso no envio do e-mail
                callback();
            } 
        }
    });

}

module.exports = { enviarEmail }
