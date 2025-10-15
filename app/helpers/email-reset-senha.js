module.exports = (url, token, usuario)=>{

    return ` <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha</title>
</head>
<style>
    .caixa{
        border: solid;
        border-radius: 20px;
        width: 20%;
        border-color: #77b6ea;
        padding: 15px;
        margin-bottom: 10%;
        margin: auto;
    }
    .dentro{
        margin: 0px 20px 3px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    h2{
        font-family: "Poppins", sans-serif;
        color: #141c44;
    }
    article{
        margin-bottom: 3%;
        margin-top: 6%;
        font-size: 20px;
        font-family: "Poppins", sans-serif;
        text-align: justify;
        color: #141c44;
    }
    #redefinir_button{
        font-family: "Poppins", sans-serif;
        transition: all 0.3s;
        background-color:#f56d44;
        border: 1px solid #f56d44;
        border-radius: 30px;
        color: white;
        width: 250px;
        height: 70px;
        font-size: 25px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
        margin: auto;
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
    #redefinir_button:hover{
        background-color: #f87d57;
    }
    </style>
<body>
    <section class="caixa">
        <section class="dentro">
            <h2>Ola, ${usuario}</h2>
            <article>Vamos recuperar sua senha.</article>

            <article>Somente as pessoas que souberem sua senha do Escolas Faceis ou clicarem no link de login neste email poderão entrar na sua conta.<br><br>
                Se você não solicitou um link de redefinição de senha, ignore esta mensagem. 

            </article> <br>
            <a href="${url}/redefinir-senha?token=${token}" style="text-decoration: none;">
                <button id="redefinir_button">Redefinir Senha</button>
            </a>
        </section>
    </section>

</body>
</html>`

    }

    //${url}