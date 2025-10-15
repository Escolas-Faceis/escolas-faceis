function toggleTheme() {
    document.body.classList.toggle('tema-escuro');
    document.getElementById('tema').classList.toggle('moon');
    const isDark = document.body.classList.contains('tema-escuro');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (typeof setDefaultImages === 'function') {
        setDefaultImages();
    }
    if (typeof updateSocialMediaImages === 'function') {
        updateSocialMediaImages();
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('tema-escuro');
        document.getElementById('tema').classList.add('moon');
    }
}

applySavedTheme();

