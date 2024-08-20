const carousel = document.querySelector('.carousel');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
 
let currentIndex = 0;
 
function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 1000}px)`;
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}
 
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % indicators.length;
    updateCarousel();
});
 
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + indicators.length) % indicators.length;
    updateCarousel();
});
 
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});
 
updateCarousel();