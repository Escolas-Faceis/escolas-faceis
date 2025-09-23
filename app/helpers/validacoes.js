const pool = require("../../config/pool_conexoes");
function validarTelefone(value) {
    let telefone = value.replace(/[^\d]+/g, '');
    if (!(telefone.length >= 10 && telefone.length <= 11)) {
        return false;
    }
    // Se tiver 11 caracteres, verificar se começa com 9 o celular
    if (telefone.length === 11 && telefone[2] !== '9') {
        return false;
    }
     //DDDs validos
    var codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28, 31, 32, 33, 34,
        35, 37, 38, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 51, 53, 54, 55, 61, 62,
        64, 63, 65, 66, 67, 68, 69, 71, 73,
        74, 75, 77, 79, 81, 82, 83, 84, 85,
        86, 87, 88, 89, 91, 92, 93, 94, 95,
        96, 97, 98, 99];

    if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) return false;

    if (new Date().getFullYear() < 2017) return true;
    if (telefone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) == -1) return false;


    return true;
}

function validarCNPJ(cnpj) {
 
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}

async function validarCep() {
    
    const cepValue = inputCep.value.replace("-", "").replace(" ", "");

    try {
        const urlViaCEP = `https://viacep.com.br/ws/${cepValue}/json/`;
        let response = await fetch(urlViaCEP);
        let json = await response.json();

        if (json.erro) {
            msgAviso.innerHTML = `<p>O CEP ${cepValue} não é válido.</p>`;
        } else {
            dadosCepUnitario.innerHTML = `
                <ul id="json-campos">
                    <li><strong>CEP:</strong> ${json.cep}</li>
                    <li><strong>Logradouro:</strong> ${json.logradouro}</li>
                    <li><strong>Bairro:</strong> ${json.bairro}</li>
                    <li><strong>Cidade:</strong> ${json.localidade}</li>
                    <li><strong>UF:</strong> ${json.uf}</li>
                </ul>`;
        }
    } catch (e) {
        msgAviso.innerHTML = "<p>Erro ao buscar o CEP. Tente novamente.</p>";
    }
}

const emailExiste = async (email) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE email_usuario = ?',
            [email]
        );
        return rows.length > 0;
    } catch (error) {
        console.log('Erro ao verificar email:', error);
        return false;
    }
};

const cnpjExiste = async (cnpj) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_escola FROM escolas WHERE cnpj = ?',
            [cnpj]
        );
        return rows.length > 0;
    } catch (error) {
        console.log('Erro ao verificar CNPJ:', error);
        return false;
    }
};

const telefoneExiste = async (telefone) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE telefone_usuario = ?',
            [telefone]
        );
        return rows.length > 0;
    } catch (error) {
        console.log('Erro ao verificar telefone:', error);
        return false;
    }
};


module.exports = {validarTelefone, validarCNPJ, validarCep, emailExiste, cnpjExiste, telefoneExiste};