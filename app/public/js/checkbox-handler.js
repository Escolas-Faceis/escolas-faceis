// Função para capturar valores das checkboxes e adicionar ao formulário
function capturarCheckboxes() {
    const form = document.getElementById('multiSteps');
    
    // Remover campos hidden anteriores se existirem
    document.querySelectorAll('input[name="tipos_ensino_values"]').forEach(el => el.remove());
    document.querySelectorAll('input[name="turnos_values"]').forEach(el => el.remove());
    document.querySelectorAll('input[name="redes_values"]').forEach(el => el.remove());
    
    // Capturar checkboxes de Tipo de Ensino
    const tiposEnsinoCheckboxes = document.querySelectorAll('input[name="ensino"]:checked');
    tiposEnsinoCheckboxes.forEach(checkbox => {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'tipos_ensino_values';
        hiddenInput.value = checkbox.value;
        form.appendChild(hiddenInput);
    });
    
    // Capturar checkboxes de Turnos
    const turnosCheckboxes = document.querySelectorAll('input[name="turno"]:checked');
    turnosCheckboxes.forEach(checkbox => {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'turnos_values';
        hiddenInput.value = checkbox.value;
        form.appendChild(hiddenInput);
    });
    
    // Capturar checkboxes de Redes
    const redesCheckboxes = document.querySelectorAll('input[name="rede"]:checked');
    redesCheckboxes.forEach(checkbox => {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'redes_values';
        hiddenInput.value = checkbox.value;
        form.appendChild(hiddenInput);
    });
    
    return true;
}

// Adicionar evento de submit ao formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('multiSteps');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Capturar checkboxes antes do envio
            capturarCheckboxes();
        });
    }
});

// Função para validar se pelo menos uma checkbox foi selecionada em cada grupo
function validarCheckboxes() {
    const tiposEnsinoSelecionados = document.querySelectorAll('input[name="ensino"]:checked').length;
    const turnosSelecionados = document.querySelectorAll('input[name="turno"]:checked').length;
    const redesSelecionados = document.querySelectorAll('input[name="rede"]:checked').length;
    
    let erros = [];
    
    if (tiposEnsinoSelecionados === 0) {
        erros.push('Selecione pelo menos um tipo de ensino');
    }
    
    if (turnosSelecionados === 0) {
        erros.push('Selecione pelo menos um turno');
    }
    
    if (redesSelecionados === 0) {
        erros.push('Selecione pelo menos uma rede');
    }
    
    return erros;
}
