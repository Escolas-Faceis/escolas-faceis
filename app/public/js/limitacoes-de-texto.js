    const ingressos = document.querySelectorAll('.ingresso');

    ingressos.forEach(ingresso => {
        const text = ingresso.textContent;
        const truncatedText = text.length > 30 ? text.slice(0, 30) + '...' : text;
        ingresso.textContent = truncatedText;
    });

