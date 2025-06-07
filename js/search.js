// js/search.js

import { appState } from './main.js';
import { renderProducts } from './products.js';

export function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    // Consideramos que los resultados de búsqueda se mostrarán en la sección de celulares
    const celularesGrid = document.getElementById('celularesGrid');

    if (!searchInput || !searchButton || !celularesGrid) {
        console.warn('Elementos de búsqueda no encontrados. La búsqueda no funcionará.');
        return;
    }

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let filteredProducts = appState.products;

        if (searchTerm) {
            filteredProducts = appState.products.filter(product =>
                // Buscar en nombre, descripción, marca, y categoría (para ser más amplio)
                product.name.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm)) ||
                (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
                (product.category && product.category.toLowerCase().includes(searchTerm))
            );
        }

        // Filtra para mostrar solo celulares y accesorios en el grid de búsqueda
        const resultsForCelulares = filteredProducts.filter(p => p.category === 'Celular');
        const resultsForAccesorios = filteredProducts.filter(p => p.category === 'Accesorio');
        const resultsForServicios = filteredProducts.filter(p => p.category === 'Servicio Técnico');
        const resultsForCreditos = filteredProducts.filter(p => p.category === 'Créditos');

        // Renderizar los resultados de búsqueda en las secciones correspondientes
        renderProducts(resultsForCelulares, '#celularesGrid');
        renderProducts(resultsForAccesorios, '#accesoriosGrid');
        
        // Para servicios y créditos, solo si hay resultados, podríamos redirigir o mostrar un mensaje
        if (resultsForServicios.length > 0 || resultsForCreditos.length > 0) {
            // Esto es solo un ejemplo. Podrías hacer que la búsqueda abra un modal con todos los resultados
            // o que dirija a la sección de servicios/créditos si el término de búsqueda coincide.
            console.log('Resultados en Servicios:', resultsForServicios);
            console.log('Resultados en Créditos:', resultsForCreditos);
            // Si quieres que el usuario se desplace a la sección de servicios/créditos si hay un resultado allí
            // document.getElementById('service-tech-section').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Opcional: Desplazar a la sección de resultados (celulares o accesorios)
        document.getElementById('celulares-section').scrollIntoView({ behavior: 'smooth' });
    };

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Opcional: Búsqueda en tiempo real (descomentar si se desea)
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 2 || searchInput.value.length === 0) { // Disparar búsqueda al menos con 3 caracteres o al limpiar
            performSearch();
        }
    });

    console.log('Módulo de búsqueda configurado.');
}
