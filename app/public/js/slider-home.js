const slides = document.querySelector('.slides');
const slideCount = document.querySelectorAll('.slide').length;
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;
const intervalTime = 3000; // Tempo em milissegundos (3 segundos)

function updateCarousel() {
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

function moveToNextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
}

// Configurar a navegação automática
let autoPlay = setInterval(moveToNextSlide, intervalTime);

nextBtn.addEventListener('click', () => {
    clearInterval(autoPlay); // Parar autoplay ao clicar
    moveToNextSlide();
    autoPlay = setInterval(moveToNextSlide, intervalTime); // Reiniciar autoplay
});

prevBtn.addEventListener('click', () => {
    clearInterval(autoPlay); // Parar autoplay ao clicar
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
    autoPlay = setInterval(moveToNextSlide, intervalTime); // Reiniciar autoplay
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        clearInterval(autoPlay); // Parar autoplay ao clicar
        currentIndex = index;
        updateCarousel();
        autoPlay = setInterval(moveToNextSlide, intervalTime); // Reiniciar autoplay
    });
});

updateCarousel();
