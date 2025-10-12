document.addEventListener('DOMContentLoaded', function() {
    const filtrosTrigger = document.getElementById('filtros');
    const panel = document.getElementById('panel');
    const filterForm = document.getElementById('filter-form');

    // Toggle panel on click
    filtrosTrigger.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!panel.contains(event.target) && !filtrosTrigger.contains(event.target)) {
            panel.style.display = 'none';
        }
    });

    // Close panel on form submit
    filterForm.addEventListener('submit', function() {
        panel.style.display = 'none';
    });
});
