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