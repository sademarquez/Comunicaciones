// js/products.js

import { appState } from './main.js'; // Importar el estado global

/**
 * Carga los productos y banners. En este punto, ya se están cargando en main.js
 * pero esta función se mantiene para claridad si se quisiera cargar solo productos aquí.
 * @returns {Promise<void>}
 */
export async function loadProducts() {
    // Los productos ya se cargan en main.js en appState.products
    // Si fuera necesario, se podrían cargar aquí también.
}

/**
 * Renderiza los productos en un contenedor HTML.
 * @param {Array} productsToRender - La lista de productos a mostrar.
 * @param {string} containerSelector - Selector CSS del contenedor donde se renderizarán.
 * @param {object} options - Opciones adicionales (ej. { limit: 8, isNew: true })
 */
export function renderProducts(productsToRender, containerSelector, options = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Contenedor no encontrado para renderizar productos: ${containerSelector}`);
        return;
    }

    // Filtrar si hay opciones
    let filteredProducts = [...productsToRender]; // Copia para no modificar el original

    if (options.isNew) {
        filteredProducts = filteredProducts.filter(p => p.isNew);
    }
    if (options.limit) {
        filteredProducts = filteredProducts.slice(0, options.limit);
    }

    container.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    if (filteredProducts.length === 0) {
        container.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });

    console.log(`Productos renderizados en ${containerSelector}:`, filteredProducts.length);
}

/**
 * Crea la tarjeta HTML de un solo producto.
 * @param {object} product - Objeto de producto.
 * @returns {HTMLElement} El elemento HTML de la tarjeta del producto.
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.dataset.id = product.id; // Para identificar el producto al agregar al carrito

    let priceHtml = `<span class="price">$${product.price.toLocaleString('es-CO')}</span>`;
    let badgeHtml = '';

    if (product.isOnOffer && product.offerPrice) {
        priceHtml = `
            <span class="old-price">$${product.price.toLocaleString('es-CO')}</span>
            <span class="price">$${product.offerPrice.toLocaleString('es-CO')}</span>
        `;
        badgeHtml = `<span class="product-badge offer">Oferta</span>`;
    } else if (product.isNew) {
        badgeHtml = `<span class="product-badge new">Nuevo</span>`;
    }

    card.innerHTML = `
        <div class="product-card-image">
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            ${badgeHtml}
        </div>
        <div class="product-card-info">
            <h3>${product.name}</h3>
            <p class="brand">${product.brand}</p>
            <div class="price-container">
                ${priceHtml}
            </div>
            <div class="product-card-actions">
                <button class="add-to-cart-btn" data-product-id="${product.id}">Agregar al Carrito</button>
            </div>
        </div>
    `;

    // Añadir event listener al botón de "Agregar al Carrito"
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se dispare el evento del click en la tarjeta si hubiera
            const productId = e.target.dataset.productId;
            // Aquí se llamaría a la función de agregar al carrito desde el módulo cart.js
            import('./cart.js').then(module => module.addToCart(productId));
        });
    }

    return card;
}

/**
 * Configura los filtros de productos y actualiza la vista.
 * @param {Array} products - Lista de todos los productos disponibles.
 */
export function setupProductFilters(products) {
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productSearchInput = document.getElementById('productSearch');
    const allProductsGrid = document.getElementById('allProductsGrid');

    if (!brandFilter || !priceFilter || !productSearchInput || !allProductsGrid) {
        console.warn('Uno o más elementos de filtro de productos no encontrados.');
        return;
    }

    // Llenar el filtro de marcas dinámicamente
    const brands = [...new Set(products.map(p => p.brand))].sort();
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });

    const applyFilters = () => {
        let filtered = [...products];

        // Filtrar por marca
        const selectedBrand = brandFilter.value;
        if (selectedBrand) {
            filtered = filtered.filter(p => p.brand === selectedBrand);
        }

        // Filtrar por texto de búsqueda (se manejará más a fondo en search.js)
        const searchTerm = productSearchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.brand.toLowerCase().includes(searchTerm)
            );
        }

        // Ordenar por precio
        const sortOrder = priceFilter.value;
        if (sortOrder === 'asc') {
            filtered.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        }

        renderProducts(filtered, '#allProductsGrid');
    };

    brandFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    productSearchInput.addEventListener('input', applyFilters); // Para búsqueda en tiempo real
}

// Función para cargar las marcas dinámicamente en la sección "Explora por Marca"
export function renderBrands(products) {
    const brandsListContainer = document.getElementById('brandsList');
    if (!brandsListContainer) return;

    brandsListContainer.innerHTML = ''; // Limpiar las marcas estáticas

    const uniqueBrands = new Map(); // Usar un Map para mantener el orden y evitar duplicados

    products.forEach(product => {
        if (!uniqueBrands.has(product.brand)) {
            uniqueBrands.set(product.brand, product.brandLogoUrl || `images/icons/${product.brand.toLowerCase()}-logo.svg`);
        }
    });

    uniqueBrands.forEach((logoUrl, brandName) => {
        const brandItem = document.createElement('a');
        brandItem.href = `#celulares?brand=${encodeURIComponent(brandName)}`; // Enlace a la sección de celulares filtrados
        brandItem.classList.add('brand-item');
        brandItem.innerHTML = `
            <img src="${logoUrl}" alt="Logo ${brandName}">
            <span>${brandName}</span>
        `;
        brandsListContainer.appendChild(brandItem);
    });
}
