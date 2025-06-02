// js/search.js

import { appState } from './main.js';
import { renderProducts } from './products.js';

export function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const allProductsGrid = document.getElementById('allProductsGrid');

    if (!searchInput || !searchButton || !allProductsGrid) {
        console.warn('Elementos de búsqueda no encontrados. La búsqueda no funcionará.');
        return;
    }

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let filteredProducts = appState.products;

        if (searchTerm) {
            filteredProducts = appState.products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                (product.category && product.category.toLowerCase().includes(searchTerm))
            );
        }

        renderProducts(filteredProducts, '#allProductsGrid'); // Renderiza los resultados en la sección principal de celulares
        // Opcional: Desplazar a la sección de resultados
        document.getElementById('celulares').scrollIntoView({ behavior: 'smooth' });
    };

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Opcional: Búsqueda en tiempo real (descomentar si se desea)
    // searchInput.addEventListener('input', () => {
    //     if (searchInput.value.length > 2 || searchInput.value.length === 0) { // Disparar búsqueda al menos con 3 caracteres o al limpiar
    //         performSearch();
    //     }
    // });

    console.log('Módulo de búsqueda configurado.');
}
