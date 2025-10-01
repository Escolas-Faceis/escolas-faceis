function toggleTheme() {
    document.body.classList.toggle('tema-escuro');
    document.getElementById('tema').classList.toggle('moon');
    // Save the current theme to localStorage
    const isDark = document.body.classList.contains('tema-escuro');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Apply saved theme on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('tema-escuro');
        document.getElementById('tema').classList.add('moon');
    }
}

// Run on page load
applySavedTheme();

