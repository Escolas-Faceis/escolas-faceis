function mudar_cor(color){
    var sxt = document.querySelector(':root');
    sxt.style.setProperty('--background_banner', color);
}

const editarBtn = document.getElementById('editar_perfil');
const salvarBtn = document.getElementById('salvar_botao');
const biografia = document.getElementById('biografia');
const alerta = document.querySelector('.alert'); // Seleciona o primeiro alerta

// Função para ativar/desativar edição
function toggleEdit() {
if (biografia.hasAttribute('readonly')) {
    biografia.removeAttribute('readonly'); // Permite edição
} else {
    biografia.setAttribute('readonly', true); // Remove edição
}
}



// Adiciona evento para o botão de editar
editarBtn.addEventListener('click', toggleEdit);

// Ao clicar em "Salvar", desabilita a edição e mostra o alerta
salvarBtn.addEventListener('click', () => {
biografia.setAttribute('readonly', true);
alerta.style.display = 'block'; // Mostra o alerta

// Oculta o alerta após 3 segundos
setTimeout(() => {
    alerta.style.display = 'none';
}, 5000);
});