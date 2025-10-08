function updateSocialMediaImages() {
        const isDark = document.body.classList.contains('tema-escuro');
        const socialImages = document.querySelectorAll('.social-media');
        socialImages.forEach(img => {
            let src = img.src;
            if (isDark) {
                img.src = src.replace('1.svg', '2.svg');
            } else {
                img.src = src.replace('2.svg', '1.svg');
            }
        });
    }
    updateSocialMediaImages();
    const observer = new MutationObserver(updateSocialMediaImages);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
