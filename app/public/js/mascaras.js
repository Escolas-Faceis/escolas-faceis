// CNPJ

const input = document.getElementById('cnpj_input')

input.addEventListener('keypress', () => {
    let inputLength = input.value.length

    // MAX LENGHT 18  CNPJ
    if (inputLength == 2 || inputLength == 6) {
        input.value += '.'
    }else if (inputLength == 9) {
        input.value += '/'
    }else if (inputLength == 15) {
        input.value += '-'
    }})


    //TELEFONE CELULAR
    function mascaraTelefone(telefone) {
    document.addEventListener('DOMContentLoaded', function () {
        const numero = document.getElementById('cellphone' || 'telefone');
    
        numero.addEventListener('keypress', (event) => {
            const numerLength = numero.value.replace(/[^0-9]/g, '').length; // Contar apenas números
    
            // Impedir a inserção de mais caracteres
            if (numerLength >= 11) {
                event.preventDefault();
            }
    
            // Formatação do telefone
            if (numerLength === 0) {
                numero.value += '(';
            } else if (numerLength === 2) {
                numero.value += ') ';
            } else if (numerLength === 7) {
                numero.value += '-';
            }
        });
    });
}