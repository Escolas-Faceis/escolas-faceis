// Script para controle do slider automático
let counter = 1;
let autoInterval;

function iniciarAutoSlide() {
    autoInterval = setInterval(function(){
        document.getElementById('radio' + counter).checked = true;
        counter++;
        if(counter > 3){
            counter = 1;
        }
    }, 5000);
}

function changeSlide(n) {
    clearInterval(autoInterval);
    counter += n;
    if (counter > 3) counter = 1;
    if (counter < 1) counter = 3;
    document.getElementById('radio' + counter).checked = true;
    iniciarAutoSlide();
}

// Iniciar auto-slide
iniciarAutoSlide();

// Parar auto no hover
const slider = document.querySelector('.slider');
slider.addEventListener('mouseenter', () => clearInterval(autoInterval));
slider.addEventListener('mouseleave', iniciarAutoSlide);
